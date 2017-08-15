/**
 * 把一个字符串中的字符重新排列生成新的字符串，返回新生成的字符串里没有连续重复字符的字符串个数.连续重复只以单个字符为准
 * 例如, aab 应该返回 2 因为它总共有6中排列 (aab, aab, aba, aba, baa, baa), 但是只有两个 (aba and aba)没有连续重复的字符 (在本例中是 a).
 *
 * 【实用参考资料！】
 * ■ 排列与组合 Combinations and Permutations
 * https://www.mathsisfun.com/combinatorics/combinations-permutations.html
 *
 * 【算法来源】
 * ■ 字符串的全排列和组合算法 - Hackbuteer1的专栏 - CSDN博客
 * http://blog.csdn.net/hackbuteer1/article/details/7462447
 */

/**
 * 交换一个数组中给定的两项。
 * @param arr       待交换数组。
 * @param index_A   要交换的第一项。
 * @param index_B   要交换的第二项。
 * @return {*}
 */
let swap = function (arr, index_A, index_B) {

    let buff = arr[index_A];
    arr[index_A] = arr[index_B];
    arr[index_B] = buff;

    return arr;
};

/**
 * 获取一个字符串的全排列。
 * 运用闭包将全排列递归函数进行封装。
 * @param string        待求全排列的字符串。
 * @return {Array}      数组，存放指定字符串的全排列。
 */
function getStringPermutation(string) {
    let string_array = string.split('');
    let permutations = [];

    /**
     * 全排列函数：获取一个字符串数组的全排列。
     *
     * @param str_array     字符串数组。
     * @param currentNum    表示当前选取到第几个数。
     */
    function Permutation(str_array, currentNum){
        let len = str_array.length;

        if (currentNum === len) {
            permutations.push(str_array.join(''));
        }
        else {
            for(let i = currentNum; i < len; i++) {
                str_array = swap(str_array, currentNum, i);
                Permutation(str_array, currentNum + 1, len);
                str_array = swap(str_array, currentNum, i);
            }
        }

    }

    Permutation(string_array, 0);

    return permutations;
}




/**
 * 检查一个字符串中是否有连续重复字符。
 * @param str 待查字符串。
 */
function hasSuccessiveChar(str)
{
    /**
     * 子函数：数组去重。在这里用于提取出所有可能出现的字符，以判断是否有连续字符出现。
     * @param arr
     * @return {Array}
     */
    function deDuplicate(arr) {

        // 子函数：求元素在数组中的出现次数
        function appearCount(arr, elem){
            let count = 0;
            arr.forEach(function(val){
                if(val === elem)
                    count++;
            });

            return count;
        }

        // 开始去重
        arr.forEach(function (val){
            while(appearCount(arr, val) > 1)
                arr.splice(arr.indexOf(val), 1);
        });

        return arr;
    }


    // 第一步：提取出可能出现的字符
    let possible_chars = deDuplicate(str.split(''));

    // 第二步：枚举possible_chars，运用 indexOf 方法定位它们初次出现的位置，随后检查后续的字符中是否有同样的字符
    // 哪怕同样的字符只有一个，都构成“含有连续重复字符”，即可下肯定判断。
    let flag = false;           // 返回值标识
    possible_chars.forEach(function (current_char_to_check){
        let first_appear = str.indexOf(current_char_to_check);
        if(str[first_appear + 1] === current_char_to_check)
            flag = true;
    });

    // 返回返回值标识
    return flag;
}

/**
 * 主入口函数。
 * @param str String
 * @return {*}
 */
function permAlone(str) {
    // 第一步：获取全排列
    let permutations = getStringPermutation(str);

    // 第二步：统计哪些排列满足题意，即不含重复字符
    let count_of_no_repeat = 0;
    for (let obj of permutations) {
        if(!hasSuccessiveChar(obj)) count_of_no_repeat++;
    }

    return count_of_no_repeat;
}

console.log(permAlone('aab'));