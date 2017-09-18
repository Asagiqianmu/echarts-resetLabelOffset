 /**
 * 重置echart线性图的label位置
 * chart-echarts实例
 * */
var resetLabelOffset = function (chart) {
    if (chart == null) {
        return;
    }
    var option = chart.getOption();
    var outEnd = option.series.length;
    var inEnd = option.series[0] ? option.series[0].data.length : 0;
    if (outEnd <= 1 || inEnd <= 0) {
        return;
    }
    var stacks = [];
    for (var i = 0; i < inEnd; i++) {
        var stack = [];
        var valueMap = {};
        for (var j = 0; j < outEnd; j++) {
            var isStack = option.series[j].stack;
            var value;
            if (isStack) {
                if (!valueMap[option.series[j].yAxisIndex]) {
                    value = parseFloat(option.series[j].data[i].value);
                } else {
                    value = valueMap[option.series[j].yAxisIndex]
                            + parseFloat(option.series[j].data[i].value);
                }
                valueMap[option.series[j].yAxisIndex] = value;
            } else {
                value = option.series[j].data[i].value;
            }
            var y = chart.convertToPixel(
                    {yAxisIndex: option.series[j].yAxisIndex},
                    value);
            stack[j] = y;
        }
        stacks[i] = stack;
    }
    var stacks_original = angular.copy(stacks);
    var distance = 12;

    for (var i in stacks) {
        var sort_stack = angular.copy(stacks[i]);
        var index_stack = angular.copy(stacks[i]);
        sortArrayDesc(sort_stack);
        var useIndex = [];
        for (var n = 0; n < sort_stack.length - 1; n++) {
            var smallIndex = -1;
            var bigIndex = -1;
            for (var j in index_stack) {
                if (bigIndex == -1 && index_stack[j] == sort_stack[n]) {
                    bigIndex = j;
                    index_stack[j] = NaN;
                }
                if (smallIndex == -1 && index_stack[j] == sort_stack[n
                        + 1]) {
                    smallIndex = j;
                }
                if (bigIndex != -1 && smallIndex != -1) {
                    break;
                }
            }
            var flag = false;//判断是否有Label重叠的情况

            useIndex.push(bigIndex);

            for (var x in useIndex) {
                if (Math.abs(stacks[i][smallIndex] - stacks[i][useIndex[x]])
                        <= distance) {
                    flag = true;
                    break;
                }
            }

            if (flag) {
                stacks[i][smallIndex] = stacks[i][bigIndex] - distance;
                option.series[smallIndex].data[i].label.normal.offset = [0,
                    stacks[i][smallIndex] - stacks_original[i][smallIndex]];
            }
        }
    }
    chart.setOption(option);
}
