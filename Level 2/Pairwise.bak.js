/*
* 举个例子：有一个能力数组[7,9,11,13,15]，按照最佳组合值为20来计算，只有7+13和9+11两种组合。而7在数组的索引为0，13在数组的索引为3，9在数组的索引为1，11在数组的索引为2。
* 所以我们说函数：pairwise([7,9,11,13,15],20) 的返回值应该是0+3+1+2的和，即6。
* 任务：帮右边的pairwise函数实现上面的功能。
 */

function pairwise(arr, arg) {
    let target_comb = [];               // 存放整理出来的组合

    // 子函数：检测一个组合的出现次数。按题目要求，一个组合若重复出现，则不再重复计入。
    function appearCount(num1, num2) {
        let count = 0;
        target_comb.forEach(function (val) {
            if(val.number1 === num1  &&  val.number2 === num2)
                count ++;
        });

        return count;
    }

    // 第一步：遍历所有组合，发现符合题意，且第一次出现（为了保证组合不重复）的就提出来
    for(let i = 0; i < arr.length; i++) {
        for(let j = i + 1; j < arr.length; j++) {
            if(arr[i] + arr[j] === arg  &&  appearCount(arr[i], arr[j]) === 0)
                target_comb.push({
                    number1: arr[i],
                    number2: arr[j],
                    number1_index: i,
                    number2_index: j
                });
        }
    }


    //console.log(appearCount(1,1));

    // 第二步：累加这些符合条件的项所对应的索引
    let result = 0;
    target_comb.forEach(function (val) {
        result += val.number1_index;
        result += val.number2_index;
    });

    console.log(result);
    return result;
}

//pairwise([1, 4, 2, 3, 0, 5], 7);
//pairwise([1, 3, 2, 4], 4);
//pairwise([1, 1, 1], 2);
pairwise([0, 0, 0, 0, 1, 1], 1);