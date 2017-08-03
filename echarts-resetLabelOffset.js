/**
 * 方法用于解决echarts线性图标中label互相遮挡问题
 * chart-echarts实例
 * datas-数据集合
 * yAxisIndexs-指定datas中数据对应的y轴的Index
 * */
var resetLabelOffset = function (chart, datas, yAxisIndexs) {
    if (!datas || datas.length == 0 || !datas[0] || datas[0].length == 0) {
        return ;
    }
    var option = chart.getOption();
    var outEnd = datas.length;
    var inEnd = datas[0].length;
    var stacks = [];
    for (var i=0; i<inEnd; i++) {
        var stack = [];
        for (var j=0; j<outEnd; j++) {
            var y = chart.convertToPixel({yAxisIndex:yAxisIndexs[j]},datas[j][i]);
            stack[j] = y;
        }
        stacks[i] = stack;
    }
    var stacks_original = angular.copy(stacks);
    var distance = 15;

    for (var i in stacks) {
        var sort_stack = angular.copy(stacks[i]);
        var index_stack = angular.copy(stacks[i]);
        sortArrayDesc(sort_stack);
        var useIndex = [];
        for (var n = 0; n < sort_stack.length-1; n++) {
            var smallIndex = -1;
            var bigIndex = -1;
            for (var j in index_stack) {
                if (bigIndex == -1 && index_stack[j] == sort_stack[n]) {
                    bigIndex = j;
                    index_stack[j] = NaN;
                }
                if (smallIndex == -1 && index_stack[j] == sort_stack[n+1]) {
                    smallIndex = j;
                }
                if (bigIndex != -1 && smallIndex != -1) {
                    break;
                }
            }
            var flag = false;//判断是否有Label重叠的情况

            useIndex.push(bigIndex);

            for (var x in useIndex) {
                if(Math.abs(stacks[i][smallIndex] - stacks[i][useIndex[x]]) <= distance){
                    flag = true; break;
                }
            }

            if (flag) {
                stacks[i][smallIndex] = stacks[i][bigIndex] - distance;
                option.series[smallIndex].data[i].label.normal.offset = [0, stacks[i][smallIndex]-stacks_original[i][smallIndex]];
            }
        }
    }
    chart.setOption(option);
}