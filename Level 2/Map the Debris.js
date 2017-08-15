/**
 * 返回一个数组，其内容是把原数组中对应元素的平均海拔转换成其对应的轨道周期.

 原数组中会包含格式化的对象内容，像这样 {name: 'name', avgAlt: avgAlt}.

 至于轨道周期怎么求，戳这里 on wikipedia (不想看英文的话可以自行搜索以轨道高度计算轨道周期的公式).

 求得的值应该是一个与其最接近的整数，轨道是以地球为基准的.

 地球半径是 6367.4447 kilometers, 地球的GM值是 398600.4418, 圆周率为Math.PI
 */

function orbitalPeriod(arr) {

    // 子函数：用于计算。
    function calc(avgAlt){
        const GM = 398600.4418;
        const earthRadius = 6367.4447;

        let T = 2 * Math.PI * Math.sqrt(Math.pow((earthRadius + avgAlt), 3) / GM);

        return Math.round(T);
    }


    // 利用 forEach 方法，对所有可能给出的数据进行运算
    let result = [];        // 输出结果
    arr.forEach(function (val) {
       result.push({
           name: val.name,
           orbitalPeriod: calc(val.avgAlt)
       })
    });


    return result;
}

orbitalPeriod([{name : "sputnik", avgAlt : 35873.5553}]);

console.log(2 * Math.PI * Math.sqrt(Math.pow((6367.4447 + 35873.5533), 3) / 398600.4418));