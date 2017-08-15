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
 * 钱币面额与美元的对应表。
 * @type {{Number}}
 */
const cid_reference_list = {
    "PENNY":        0.01,
    "NICKEL":       0.05,
    "DIME":         0.10,
    "QUARTER":      0.25,
    "ONE":          1,
    "FIVE":         5,
    "TEN":          10,
    "TWENTY":       20,
    "ONE HUNDRED":  100
};


/**
 * 核心函数。
 * @param price Number
 * @param cash Number
 * @param cid {Array}
 * @return {Array} {String}
 */
function checkCashRegister(price, cash, cid) {
    let change_left_pennies = cash - price;         // 剩余还需找零的钱，以美元为单位
    let change = [];            // 找零组合

    // 第一步：判断付款金额是否小于购买价格，如果是则抛出错误
    if(change_left_pennies < 0)
        throw Error("Uh-oh! Cash is not enough~~~", 10086);

    // 第二步：数零钱——将每种零钱的总额换算成零钱币的个数
    /**
     * 零钱币盒。
     * @type {{PENNY: number, NICKEL: number, DIME: number, QUARTER: number, ONE: number, FIVE: number, TEN: number, TWENTY: number, ONE HUNDRED: number, get_cid_count: get_cid_count}}
     */
    let cid_box = {
        "PENNY":    0,
        "NICKEL":   0,
        "DIME":     0,
        "QUARTER":  0,
        "ONE":      0,
        "FIVE":     0,
        "TEN":      0,
        "TWENTY":   0,
        "ONE HUNDRED": 0,

        /**
         * 获取每种零钱币的个数。
         */
        get_cid_count: function () {

            let find_cid = function (type) {
                for(let i in cid){
                    if(cid[i][0] === type)
                        return cid[i][1];
                }
            };

            cid_box["PENNY"]        = find_cid("PENNY") * 100;
            cid_box["NICKEL"]       = find_cid("NICKEL") * 1000 / 10 / 5;       // 这里的结果有异常，所以要 hack 一下：先乘1000再除以10.
            cid_box["DIME"]         = find_cid("DIME") * 100 / 10;
            cid_box["QUARTER"]      = find_cid("QUARTER") * 100 / 25;

            cid_box["ONE"]          = find_cid("ONE");
            cid_box["FIVE"]         = find_cid("FIVE") / 5;
            cid_box["TEN"]          = find_cid("TEN") / 10;
            cid_box["TWENTY"]       = find_cid("TWENTY") / 20;
            cid_box["ONE HUNDRED"]  = find_cid("ONE HUNDRED") / 100;
        }
    };
    cid_box.get_cid_count();


    console.log("零钱盒中钱币的个数：\n", cid_box);


    // 第二步： 开始找零。
    // 策略——贪心策略，即优先拿出大额币种，剩下的以此类推
    // TODO: 撞到了 JavaScript 的“精度炸弹”————小数运算精度会出现问题。
    // TODO： 示例：76.74 - 20 ≠ 56.74， 而等于 56.739999999999995！

    // 1. 找一百美元币
    while(change_left_pennies >= cid_reference_list["ONE HUNDRED"]  &&  cid_box["ONE HUNDRED"] > 0){
        change_left_pennies -= cid_reference_list["ONE HUNDRED"];
        cid_box["ONE HUNDRED"]--;
    }

    // 2. 找二十美元币
    while(change_left_pennies >= cid_reference_list["TWENTY"]  &&  cid_box["TWENTY"] > 0){
        change_left_pennies -= cid_reference_list["TWENTY"];
        cid_box["TWENTY"]--;
    }

    // 3. 找十美元币
    while(change_left_pennies >= cid_reference_list["TEN"]  &&  cid_box["TEN"] > 0){
        change_left_pennies -= cid_reference_list["TEN"];
        cid_box["TEN"]--;
    }

    // 4. 找五美元币
    while(change_left_pennies >= cid_reference_list["FIVE"]  &&  cid_box["FIVE"] > 0){
        change_left_pennies -= cid_reference_list["FIVE"];
        cid_box["FIVE"]--;
    }

    // 5. 找一美元币
    while(change_left_pennies >= cid_reference_list["ONE"]  &&  cid_box["ONE"] > 0){
        change_left_pennies -= cid_reference_list["ONE"];
        cid_box["ONE"]--;
    }

    // 6. 找25美分硬币
    while(change_left_pennies >= cid_reference_list["QUARTER"]  &&  cid_box["QUARTER"] > 0){
        change_left_pennies -= cid_reference_list["QUARTER"];
        cid_box["QUARTER"]--;
    }

    // 7. 找10美分硬币
    while(change_left_pennies >= cid_reference_list["DIME"]  &&  cid_box["DIME"] > 0){
        change_left_pennies -= cid_reference_list["DIME"];
        cid_box["DIME"]--;
    }

    // 8. 找5美分硬币
    while(change_left_pennies >= cid_reference_list["NICKEL"]  &&  cid_box["NICKEL"] > 0){
        change_left_pennies -= cid_reference_list["NICKEL"];
        cid_box["NICKEL"]--;
    }

    // 9. 找1美分硬币
    while(change_left_pennies >= cid_reference_list["PENNY"]  &&  cid_box["PENNY"] > 0){
        change_left_pennies -= cid_reference_list["PENNY"];
        cid_box["PENNY"]--;
    }


    console.log(change_left_pennies);

    console.log("找零后剩余的零钱数：\n", cid_box);


}

// Example cash-in-drawer array:
// [["PENNY", 1.01],
// ["NICKEL", 2.05],
// ["DIME", 3.10],
// ["QUARTER", 4.25],
// ["ONE", 90.00],
// ["FIVE", 55.00],
// ["TEN", 20.00],
// ["TWENTY", 60.00],
// ["ONE HUNDRED", 100.00]]

checkCashRegister(3.26, 100.00, [["PENNY", 1.01], ["NICKEL", 2.05], ["DIME", 3.10], ["QUARTER", 4.25], ["ONE", 90.00], ["FIVE", 55.00], ["TEN", 20.00], ["TWENTY", 60.00], ["ONE HUNDRED", 100.00]]) ;

//checkCashRegister(20.00, 19.50);