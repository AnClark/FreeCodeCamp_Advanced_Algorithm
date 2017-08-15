/**
 * 设计一个收银程序 checkCashRegister() ，其把购买价格(price)作为第一个参数 , 付款金额 (cash)作为第二个参数, 和收银机中零钱 (cid) 作为第三个参数.
 *
 * cid 是一个二维数组，存着当前可用的找零.
 *
 * 当收银机中的钱不够找零时返回字符串 "Insufficient Funds". 如果正好则返回字符串 "Closed".
 * 否则, 返回应找回的零钱列表,且由大到小存在二维数组中.
 */

/**
 * 【注意】二维数组中形如['DIME', 3.10] 表示 DIME 硬币的总价值为 $3.10。
 *
 * 美元的硬币
 * PENNY 1美分（￠）
 * NICKEL 5美分
 * DIME 10美分
 * QUARTER 25美分
 * $1.00 = ￠100
 *
 * “蠢”办法：贪心法——优先用大币值找补。
 * 最优办法：回溯法与动态规划，能够实现用最少数量的零钱找补。
 */

/**
 * 【异常警告！】
 * JavaScript 的小数运算存在精度问题，这是“精度炸弹”的Bug！
 * 例如：76.74 - 20 ≠ 56.74， 而等于 56.739999999999995！
 *
 * 因此，本题须把带小数的美元全部转换为美分！
 */

/**
 * 钱币面额与美分的对应表。
 * @type {{Number}}
 */
const cid_reference_list = {
    "PENNY":        1,
    "NICKEL":       5,
    "DIME":         10,
    "QUARTER":      25,
    "ONE":          100,
    "FIVE":         500,
    "TEN":          1000,
    "TWENTY":       2000,
    "ONE HUNDRED":  10000
};


/**
 * 核心函数。
 * @param price Number
 * @param cash Number
 * @param cid {Array}
 * @return {*}
 */
function checkCashRegister(price, cash, cid) {
    let change_left_pennies = (cash - price) * 100;         // 剩余还需找零的钱，以美分为单位
    let change = [];            // 找零组合

    // 第一步：判断付款金额是否小于购买价格，如果是则抛出错误
    if (change_left_pennies < 0)
        throw Error("Uh-oh! Cash is not enough~~~", 10086);

    // 第二步：数零钱——将每种零钱的总额换算成零钱币的个数
    /**
     * 零钱币盒。
     * @type {{PENNY: number, NICKEL: number, DIME: number, QUARTER: number, ONE: number, FIVE: number, TEN: number, TWENTY: number, ONE HUNDRED: number, get_cid_count: get_cid_count}}
     */
    let cid_box = {
        "PENNY": 0,
        "NICKEL": 0,
        "DIME": 0,
        "QUARTER": 0,
        "ONE": 0,
        "FIVE": 0,
        "TEN": 0,
        "TWENTY": 0,
        "ONE HUNDRED": 0,

        /**
         * 获取每种零钱币的个数。
         */
        get_cid_count: function () {

            let find_cid = function (type) {
                for (let i in cid) {
                    if (cid[i][0] === type)
                        return cid[i][1];
                }
            };

            cid_box["PENNY"] = find_cid("PENNY") * 100;
            cid_box["NICKEL"] = find_cid("NICKEL") * 1000 / 10 / 5;       // 这里的结果有异常，所以要 hack 一下：先乘1000再除以10.
            cid_box["DIME"] = find_cid("DIME") * 100 / 10;
            cid_box["QUARTER"] = find_cid("QUARTER") * 100 / 25;

            cid_box["ONE"] = find_cid("ONE");
            cid_box["FIVE"] = find_cid("FIVE") / 5;
            cid_box["TEN"] = find_cid("TEN") / 10;
            cid_box["TWENTY"] = find_cid("TWENTY") / 20;
            cid_box["ONE HUNDRED"] = find_cid("ONE HUNDRED") / 100;
        }
    };
    cid_box.get_cid_count();

    //console.log("零钱盒中钱币的个数：\n", cid_box);

    /**
     * 补给顾客的零钱数。开始为各种币的数量，后通过内建函数 cid_count_to_dollar 转为对应的美元总价。
     * @type {{PENNY: number, NICKEL: number, DIME: number, QUARTER: number, ONE: number, FIVE: number, TEN: number, TWENTY: number, ONE HUNDRED: number, cid_count_to_dollar: cid_count_to_dollar}}
     */
    let cid_to_user = {
        "PENNY": 0,
        "NICKEL": 0,
        "DIME": 0,
        "QUARTER": 0,
        "ONE": 0,
        "FIVE": 0,
        "TEN": 0,
        "TWENTY": 0,
        "ONE HUNDRED": 0,

        /**
         将初始的各种币的数量转换为其对应的美元总价，以供输出。
         */
        cid_count_to_dollar: function () {
            cid_to_user["PENNY"] /= 100;
            cid_to_user["NICKEL"] = cid_to_user["NICKEL"] * 5 / 100;       // 这里的结果有异常，所以要 hack 一下：先乘1000再除以10.
            cid_to_user["DIME"] = cid_to_user["DIME"] * 10 / 100;
            cid_to_user["QUARTER"] = cid_to_user["QUARTER"] * 25 / 100;

            cid_to_user["ONE"] = cid_to_user["ONE"];
            cid_to_user["FIVE"] *= 5;
            cid_to_user["TEN"] *= 10;
            cid_to_user["TWENTY"] *= 20;
            cid_to_user["ONE HUNDRED"] *= 100;
        }
    };

    // 第二步： 开始找零。
    // 策略——贪心策略，即优先拿出大额币种，剩下的以此类推
    // TODO: 撞到了 JavaScript 的“精度炸弹”————小数运算精度会出现问题。
    // TODO： 示例：76.74 - 20 ≠ 56.74， 而等于 56.739999999999995！

    // 1. 找一百美元币
    while (change_left_pennies >= cid_reference_list["ONE HUNDRED"] && cid_box["ONE HUNDRED"] > 0) {
        change_left_pennies -= cid_reference_list["ONE HUNDRED"];
        cid_box["ONE HUNDRED"]--;

        cid_to_user["ONE HUNDRED"]++;
    }

    // 2. 找二十美元币
    while (change_left_pennies >= cid_reference_list["TWENTY"] && cid_box["TWENTY"] > 0) {
        change_left_pennies -= cid_reference_list["TWENTY"];
        cid_box["TWENTY"]--;

        cid_to_user["TWENTY"]++;
    }

    // 3. 找十美元币
    while (change_left_pennies >= cid_reference_list["TEN"] && cid_box["TEN"] > 0) {
        change_left_pennies -= cid_reference_list["TEN"];
        cid_box["TEN"]--;

        cid_to_user["TEN"]++;
    }

    // 4. 找五美元币
    while (change_left_pennies >= cid_reference_list["FIVE"] && cid_box["FIVE"] > 0) {
        change_left_pennies -= cid_reference_list["FIVE"];
        cid_box["FIVE"]--;

        cid_to_user["FIVE"]++;
    }

    // 5. 找一美元币
    while (change_left_pennies >= cid_reference_list["ONE"] && cid_box["ONE"] > 0) {
        change_left_pennies -= cid_reference_list["ONE"];
        cid_box["ONE"]--;

        cid_to_user["ONE"]++;
    }

    // 6. 找25美分硬币
    while (change_left_pennies >= cid_reference_list["QUARTER"] && cid_box["QUARTER"] > 0) {
        change_left_pennies -= cid_reference_list["QUARTER"];
        cid_box["QUARTER"]--;

        cid_to_user["QUARTER"]++;
    }

    // 7. 找10美分硬币
    while (change_left_pennies >= cid_reference_list["DIME"] && cid_box["DIME"] > 0) {
        change_left_pennies -= cid_reference_list["DIME"];
        cid_box["DIME"]--;

        cid_to_user["DIME"]++;
    }

    // 8. 找5美分硬币
    while (change_left_pennies >= cid_reference_list["NICKEL"] && cid_box["NICKEL"] > 0) {
        change_left_pennies -= cid_reference_list["NICKEL"];
        cid_box["NICKEL"]--;

        cid_to_user["NICKEL"]++;
    }

    // 9. 找1美分硬币
    while (change_left_pennies >= cid_reference_list["PENNY"] && cid_box["PENNY"] > 0) {
        change_left_pennies -= cid_reference_list["PENNY"];
        cid_box["PENNY"]--;

        cid_to_user["PENNY"]++;
    }


    //console.log(change_left_pennies);

    //console.log("找零后剩余的零钱数：\n", cid_box);

    // 第三步：判断是否够补，若不够补则返回“Insufficient Funds”。
    if(change_left_pennies > 0)
        return "Insufficient Funds";

    // 第四步：整理找补给顾客的钱。
    // 将收集到的钱币转换为 对应的美元总额，并整理成二维数组。要求自大向小。
    cid_to_user.cid_count_to_dollar();

    let result_array = [];
    if(cid_to_user["ONE HUNDRED"] > 0)
        result_array.push(["ONE HUNDRED", cid_to_user["ONE HUNDRED"]]);
    if(cid_to_user["TWENTY"] > 0)
        result_array.push(["TWENTY", cid_to_user["TWENTY"]]);
    if(cid_to_user["TEN"] > 0)
        result_array.push(["TEN", cid_to_user["TEN"]]);
    if(cid_to_user["FIVE"] > 0)
        result_array.push(["FIVE", cid_to_user["FIVE"]]);
    if(cid_to_user["ONE"] > 0)
        result_array.push(["ONE", cid_to_user["ONE"]]);
    if(cid_to_user["QUARTER"] > 0)
        result_array.push(["QUARTER", cid_to_user["QUARTER"]]);
    if(cid_to_user["DIME"] > 0)
        result_array.push(["DIME", cid_to_user["DIME"]]);
    if(cid_to_user["NICKEL"] > 0)
        result_array.push(["NICKEL", cid_to_user["NICKEL"]]);
    if(cid_to_user["PENNY"] > 0)
        result_array.push(["PENNY", cid_to_user["PENNY"]]);

    //console.log("找补的各币种之价值：", result_array);

    // 第五步：检查所有零钱是否正好补完。若能补完，则返回“Closed”，否则返回 result_array
    let zero_count = 0;
    for(let key of Object.keys(cid_box)){
        zero_count += (cid_box[key] === 0) ? 1 : 0;
    }

    // 下面的判断中，减1是因为cid_box的最后一个成员是一个函数
    return (zero_count === Object.keys(cid_box).length - 1) ? "Closed" : result_array;
}

console.log(checkCashRegister(19.50, 20.00, [["PENNY", 1.01], ["NICKEL", 2.05], ["DIME", 3.10], ["QUARTER", 4.25], ["ONE", 90.00], ["FIVE", 55.00], ["TEN", 20.00], ["TWENTY", 60.00], ["ONE HUNDRED", 100.00]]));
console.log(checkCashRegister(3.26, 100.00, [["PENNY", 1.01], ["NICKEL", 2.05], ["DIME", 3.10], ["QUARTER", 4.25], ["ONE", 90.00], ["FIVE", 55.00], ["TEN", 20.00], ["TWENTY", 60.00], ["ONE HUNDRED", 100.00]]));

console.log(checkCashRegister(19.50, 20.00, [["PENNY", 0.01], ["NICKEL", 0], ["DIME", 0], ["QUARTER", 0], ["ONE", 0], ["FIVE", 0], ["TEN", 0], ["TWENTY", 0], ["ONE HUNDRED", 0]]));
console.log(checkCashRegister(19.50, 20.00, [["PENNY", 0.01], ["NICKEL", 0], ["DIME", 0], ["QUARTER", 0], ["ONE", 1.00], ["FIVE", 0], ["TEN", 0], ["TWENTY", 0], ["ONE HUNDRED", 0]]));
console.log(checkCashRegister(19.50, 20.00, [["PENNY", 0.50], ["NICKEL", 0], ["DIME", 0], ["QUARTER", 0], ["ONE", 0], ["FIVE", 0], ["TEN", 0], ["TWENTY", 0], ["ONE HUNDRED", 0]]));