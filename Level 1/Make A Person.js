/**
 * 用下面给定的方法构造一个对象.

 方法有 getFirstName(), getLastName(), getFullName(), setFirstName(first), setLastName(last), and setFullName(firstAndLast).

 所有有参数的方法只接受一个字符串参数.

 所有的方法只与实体对象交互.
 */

var Person = function(firstAndLast) {
    let firstName = "";
    let lastName = "";

    this.getFirstName = function (){
        return firstName;
    };

    this.getLastName = function (){
        return lastName;
    };

    this.getFullName = function () {
        return firstName + ' ' + lastName;
    };

    this.setFirstName = function (first) {
        firstName = first;
    };

    this.setLastName = function (last) {
        lastName = last;
    };

    this.setFullName = function (firstAndLast){
        firstName = firstAndLast.split(' ')[0];
        lastName = firstAndLast.split(' ')[1];
    };


    this.setFullName(firstAndLast);
};

var bob = new Person('Bob Ross');
console.log(bob.getFullName());