/**
 * 依照一个存着新进货物的二维数组，更新存着现有库存(在 arr1 中)的二维数组.
 * 如果货物已存在则更新数量 . 如果没有对应货物则把其加入到数组中，更新最新的数量.
 * 返回当前的库存数组，且按货物名称的字母顺序排列.
 */

function updateInventory(arr1, arr2) {
    // 请保证你的代码考虑到所有情况

    /**
     * 子函数：检验一件商品是否在现有库存中。
     * @param cur_inv 指定现有库存之数组。
     * @param good_name 指定商品的名称。
     * @return {boolean}
     */
    function findInInventory(cur_inv, good_name){
        let result_list = [];       // 搜索结果，存放商品在现有库存数组中的索引（考虑到可能会有重复）。

        cur_inv.forEach(function(val, key){
            if(val[1] === good_name)
                result_list.push(key);
        });

        return result_list.length > 0 ? result_list : false;
    }


    // 开始更新仓库
    arr2.forEach(function updateInventory(currentNewGood){
        // 首先检索现有库存中是否有存货
        let findResult = findInInventory(arr1, currentNewGood[1]);

        // 如果有存货，则开始添加
        if(findResult)
            findResult.forEach(function (currentIndex) {
                arr1[currentIndex][0] += currentNewGood[0];
            });
        // 否则就追加到现有存货列表中
        else{
            arr1.push(currentNewGood);
        }

    });


    // 返回排序后的最后结果
    return arr1.sort(function (a, b){
        return a[1] > b[1];
    });
}

// 仓库库存示例
var curInv = [
    [21, "Bowling Ball"],
    [2, "Dirty Sock"],
    [1, "Hair Pin"],
    [5, "Microphone"]
];

var newInv = [
    [2, "Hair Pin"],
    [3, "Half-Eaten Apple"],
    [67, "Bowling Ball"],
    [7, "Toothpaste"]
];

console.log(updateInventory(curInv, newInv));
