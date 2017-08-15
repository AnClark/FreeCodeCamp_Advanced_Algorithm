let arr = [1,1,2,3,3,4,5,6,6];

function appearCount(arr, elem){
            let count = 0;
            arr.forEach(function(val){
                if(val === elem)
                    count++;
            });
			
			return count;
        }

arr.forEach(function (val){
	while(appearCount(arr, val) > 1)
		arr.splice(arr.indexOf(val), 1);
});

console.log(arr);