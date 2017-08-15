/**
 * 让日期区间更友好！

 把常见的日期格式如：YYYY-MM-DD 转换成一种更易读的格式。

 易读格式应该是用月份名称代替月份数字，用序数词代替数字来表示天 (1st 代替 1).

 记住不要显示那些可以被推测出来的信息: 如果一个日期区间里结束日期与开始日期相差小于一年，则结束日期就不用写年份了；
    在这种情况下，如果月份开始和结束日期如果在同一个月，则结束日期月份也不用写了。

 另外, 如果开始日期年份是当前年份，且结束日期与开始日期小于一年，则开始日期的年份也不用写。

 例如:

 包含当前年份和相同月份的时候，makeFriendlyDates(["2017-01-02", "2017-01-05"]) 应该返回 ["January 2nd","5th"]

 不包含当前年份，makeFriendlyDates(["2003-08-15", "2009-09-21"]) 应该返回 ["August 15th, 2003", "September 21st, 2009"]。

 请考虑清楚所有可能出现的情况，包括传入的日期区间是否合理。对于不合理的日期区间，直接返回 undefined 即可
 */

/**
 * 将一个整数转换为对应的英文序数词。
 * 需要应对的情形：
 *      1. 区间 [1, 10] 和 [21, +∞) 中，每逢1，2，3，后缀特殊，其余均使用一般后缀-th；
 *      2. [11, 20] 不适用上述规律。
 * @param int 待转换的整数
 * @return {String} 对应的英文序数词
 */
function Int2Ordinal(int){
    // 首先考虑特殊情形：11~20.
    if(int >= 11  &&  int <= 20)
        return int + "th";
    // 否则视为一般情形
    else{
        switch(int % 10){
            case 1:
                return int + "st";
                break;
            case 2:
                return int + "nd";
                break;
            case 3:
                return int + "rd";
                break;
            default:
                return int + "th";
        }
    }
}

/**
 * 将表示月份的整数转换为对应的英文月份名称。
 * @param int
 * @return {String} || {undefined}
 */
function MonthInt2MonthName(int){
    const monthNameList = {
        1: 'January', 2: 'February', 3: 'March', 4: 'April', 5: 'May', 6: 'June',
        7: 'July', 8: 'August', 9: 'September', 10: 'October', 11: 'November', 12: "December"
    };

    return monthNameList[int.toString()];
}


function makeFriendlyDates(arr) {
    // 预判断：解析日期区间是否合理。这里直接利用 Date 的 parse 方法，将日期转换为 UTC 值。
    if(Date.parse(arr[1]) - Date.parse(arr[0]) < 0)
        return undefined;

    // 第一步：解析日期区间
    let date1 = arr[0].split('-');          // 用 split 拆分日期。结果存在主变量里
    date1.year = parseInt(date1[0]);
    date1.month = parseInt(date1[1]);
    date1.day = parseInt(date1[2]);

    let date2 = arr[1].split('-');
    date2.year = parseInt(date2[0]);
    date2.month = parseInt(date2[1]);
    date2.day = parseInt(date2[2]);


    // 第二步：将年月日解析成友好形式
    let date1_friendly = [];
    date1_friendly.year = date1.year;
    date1_friendly.month = MonthInt2MonthName(date1.month);
    date1_friendly.day = Int2Ordinal(date1.day);

    let date2_friendly = [];
    date2_friendly.year = date2.year;
    date2_friendly.month = MonthInt2MonthName(date2.month);
    date2_friendly.day = Int2Ordinal(date2.day);

    // 第三步：决定输出结果

    // 1. 先输出月份
    date1_friendly.push(date1_friendly.month + " ");         // 第一个日期总是显示月份
    // 如果区间中包含当前年份和相同月份，就省掉第二个日期的月份，否则不省
    if(date2.month !== date1.month  ||  date1.year !== date2.year)
        date2_friendly.push(date2_friendly.month + " ");

    // 2. 接着输出日
    date1_friendly.push(date1_friendly.day);
    date2_friendly.push(date2_friendly.day);

    // 3. 最后输出年
    // 如果区间中两个日期年份相同，则都省掉，否则一律不省
    // 如果结束日期与开始日期小于一年，则第二个日期的年份省掉
    if(date1.year !== date2.year)      // 31536000000 = Date.parse("2013-8-9") - Date.parse("2012-8-9")
    {

        // 确定是否省掉第二个日期的年份
        if(Date.parse(arr[1]) - Date.parse(arr[0]) >= 31536000000){
            date2_friendly.push(", ");                       // 先加月日与年之间的分隔符
            date2_friendly.push(date2_friendly.year);        // 然后加年份
        }

        // 第一个日期始终要加年份，除非是当前年份
        if(date1.year !== new Date().getFullYear()) {
            date1_friendly.push(", ");                       // 先加月日与年之间的分隔符
            date1_friendly.push(date1_friendly.year);        // 然后加年份
        }

    }

    // 第四步：返回最终结果
    // 要注意判断年月日是否相同，否则只输出完整的第一个日期！
    function isSameDate(){
        return (date1.year === date2.year && date1.month === date2.month && date1.day === date2.day);
    }
    if(!isSameDate())
        return [date1_friendly.join(''), date2_friendly.join('')];
    else
        return [date1_friendly.month + ' ' + date1_friendly.day + ', ' + date1_friendly.year];
}

console.log(makeFriendlyDates(["2001-12-20", "2001-12-20"]));
