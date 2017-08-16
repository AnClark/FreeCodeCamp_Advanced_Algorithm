/*
* 举个例子：有一个能力数组[7,9,11,13,15]，按照最佳组合值为20来计算，只有7+13和9+11两种组合。而7在数组的索引为0，13在数组的索引为3，9在数组的索引为1，11在数组的索引为2。
* 所以我们说函数：pairwise([7,9,11,13,15],20) 的返回值应该是0+3+1+2的和，即6。
* 任务：帮右边的pairwise函数实现上面的功能。
 */

function pairwise(arr, arg) {
    let arr_to_check = Array.from(arr);               // 将参数中的数组复制一份，以避免修改参数
    let result = 0;             // 存放最后结果

    // 第一步：遍历所有组合，发现符合题意，且第一次出现（为了保证组合不重复）的就提出来
    for(let i = 0; i < arr_to_check.length; i++) {
        for(let j = i + 1; j < arr_to_check.length; j++) {
            if(arr_to_check[i] + arr_to_check[j] === arg) {
                result += i + j;

                arr_to_check[i] = NaN; arr_to_check[j] = NaN;
            }
        }
    }

    console.log(result);
    return result;
}

//pairwise([1, 4, 2, 3, 0, 5], 7);
//pairwise([1, 3, 2, 4], 4);
//pairwise([1, 1, 1], 2);
pairwise([0, 0, 0, 0, 1, 1], 1);