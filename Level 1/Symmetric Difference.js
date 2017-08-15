/**
 * 创建一个函数，接受两个或多个数组，返回所给数组的 对等差分(symmetric difference) (△ or ⊕)数组.
 *
 * 给出两个集合 (如集合 A = {1, 2, 3} 和集合 B = {2, 3, 4}),
 * 而数学术语 "对等差分" 的集合就是指由所有只在两个集合其中之一的元素组成的集合(A △ B = C = {1, 4}).
 * 对于传入的额外集合 (如 D = {2, 3}), 你应该安装前面原则求前两个集合的结果与新集合的对等差分集合 (C △ D = {1, 4} △ {2, 3} = {1, 2, 3, 4}).
 *
 */

/** 【警告——经验教训】
 * ■ 直接如此赋值—— arr1_filtered = arr1 等于引用，而不是将 arr1 复制一份给 arr1_filtered！
 */

function sym(args) {
    // 子函数：提取对等差分。
    function sym_call(arr1, arr2){

        // 预处理一：数组去重
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

        arr1 = deDuplicate(arr1);
        arr2 = deDuplicate(arr2);


        // 预处理二：将输入的数组复制一份，以备处理
        /** 警告！直接如此赋值—— arr1_filtered = arr1 等于引用，而不是将 arr1 复制一份给 arr1_filtered！ **/
        let arr1_filtered = Array.from(arr1);
        let arr2_filtered = Array.from(arr2);



        // 第一步：遍历arr1，检查arr2_filtered中是否有arr1中已存在的某一项，有则删之
        arr1.forEach(function(val){
            if(arr2_filtered.indexOf(val) >= 0)
                arr2_filtered.splice(arr2_filtered.indexOf(val), 1)
        });


        // 第二步：同样的方法，遍历arr2，检查arr1_filtered中是否有arr2中已存在的某一项，有则删之
        arr2.forEach(function(val){
            if(arr1_filtered.indexOf(val) >= 0)
                arr1_filtered.splice(arr1_filtered.indexOf(val), 1)
        });


        // 第三步：此时，两个 filtered 数组剩下的就只有对等差分元素，即不同时包含于两个数组中的元素。
        // 将它们合并，就是题目所要求的对等差分集。不过根据示例，我们还要排序。
        return arr1_filtered.concat(arr2_filtered).sort(function (a,b){
            return a - b;
        });
    }

    // 正式处理过程：提取参数（因为有可能传入三个数组），并进行对等差分提取。
    if(arguments.length === 2){
        return sym_call(arguments[0], arguments[1]);
    }
    else if(arguments.length >= 3){
        let mediate = sym_call(arguments[0], arguments[1]);
        for(let i = 2; i < arguments.length; i++)
            mediate = sym_call(mediate, arguments[i]);

        return mediate;
    }

    //console.log(sym_call(arr1, arr2))
}

console.log(sym([3, 3, 3, 2, 5], [2, 1, 5, 7], [3, 4, 6, 6], [1, 2, 3], [5, 3, 9, 8], [1]))
console.log(sym([3, 3, 3, 2, 5], [2, 1, 5, 7], [3, 4, 6, 6], [1, 2, 3]))
console.log(sym([1, 1, 2, 5], [2, 2, 3, 5], [3, 4, 5, 5]) )
console.log(sym([1, 2, 5], [2, 3, 5], [3, 4, 5]))

console.log(sym([1, 1, 2, 5], [2, 2, 3, 5]))
console.log(sym([1, 2, 3], [5, 2, 1, 4]))