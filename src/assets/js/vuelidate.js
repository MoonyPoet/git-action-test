import {isEmpty,type} from "./reused";
function turnString(value){
    if(type(value)==="number"){
        value=value.toString()
    }
    return value;
}
var validatePhone = (rule, value, callback) => {
    // /^1\d{10}$/
    let test = /^((0\d{2,3}-?\d{7,8})|(1[3567894]\d{9}))$/;
    value=turnString(value);
    if (!isEmpty(value) && value.search(test) == -1) {
        if(lang==="cn"){
            callback(new Error('您输入的手机号码格式不正确'));
        }else if(lang==="en"){
            callback(new Error('The format of the mobile phone number you entered is incorrect.'));
        }
        
    } else {
        callback();
    }
};
var validateCard = (rule, value, callback) => {
    let test = /^\d{15,21}$/;
    value=turnString(value);
    if (!isEmpty(value) && value.search(test) == -1) {
        if(lang==="cn"){
            callback(new Error('您输入的银行卡卡号不正确'));
        }else if(lang==="en"){
            callback(new Error('The bank card number you entered is incorrect'));
        }
       
    } else {
        callback();
    }
};
var validateIdCard = (rule, value, callback) => {
        let test = /(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
        value=turnString(value);
        if (!isEmpty(value) && value.search(test) == -1) {
            if(lang==="cn"){
                callback(new Error('请输入正确的身份证号码'));
            }else if(lang==="en"){
                callback(new Error('Please input the correct ID number.'));
            }
           
        } else {
            callback();
        }
    }
    //校验数字(为正整数不包含0)
var validateNumber = (rule, value, callback) => {
        let test = /^[1-9]\d*$/
        value=turnString(value);
        if (!isEmpty(value) && value.search(test) == -1) {
            if(lang==="cn"){
                callback(new Error('请输入正确的正整数(不包含0)'))
            }else if(lang==="en"){
                callback(new Error('Please input the correct positive integer (excluding 0)'));
            }
            
        } else {
            callback()
        }
    }
    //校验大于等于0
var validateNaturalNumber=(rule, value, callback) => {
    let test = /(?!^0\d+)^(0|[1-9][0-9]*)$/;
    value=turnString(value);
    if (!isEmpty(value) && value.search(test) == -1) {
        if(lang==="cn"){
            callback(new Error('请输入大于等于0的数'))
        }else if(lang==="en"){
            callback(new Error('Please input a number greater than or equal to 0'))
        }
        
    } else {
        callback()
    }
}
    //hasdecimal, 有小数的情况并且大于等于0
var validateHasDecimal = (rule, value, callback) => {
        let test =/(?!^0\d+)^\d+(?:\.\d+)?$/;
        value=turnString(value);
        if (!isEmpty(value) && value.search(test) == -1) {
            if(lang==="cn"){
                callback(new Error('请输入正确的大于等于0的小数或整数'))
            }else if(lang==="en"){
                callback(new Error('Please input the correct decimal or integer greater than or equal to 0'))
            }
        } else {
            callback()
        }
    }
    //validatePrice,整数或小数并且大于等于0
var validatePrice = (rule, value, callback) => {
    let test = /(?!^0\d+)^\d+(?:\.\d+)?$/;
    value=turnString(value);
    if (!isEmpty(value) && value.search(test) == -1) {
        if(lang==="cn"){
            if(value<0){
                callback(new Error('该值不能小于0'))
            }else{
                callback(new Error('请输入正确的小数或整数'))
            }
        }else if(lang==="en"){
            if(value<0){
                callback(new Error('The value should not be less than 0'))
            }else{
                callback(new Error('Please input the correct decimal or integer'))
            }
        }
    } else {
        callback()
    }
} 
    //校验中文
var validateChinese = (rule, value, callback) => {
        let test = /[^\u4e00-\u9fa5]/;
        value=turnString(value);
        if (!isEmpty(value) && value.search(test) == -1) {
            callback(new Error('请输入中文'))
        } else {
            callback()
        }
    }
    //校验Account
var validateAccount = (rule, value, callback) => {
    let test = /^[\_\da-zA-Z]{6,}$/;
    value=turnString(value);
    if (!isEmpty(value) && value.search(test) == -1) {
        if(lang==="cn"){
            callback(new Error('账号格式不正确'))
        }else if(lang==="en"){
            callback(new Error('The account format is incorrect'))
        }
    } else {
        callback()
    }
}
    //验证密码
var validatePassword = (rule, value, callback) => {
    let test = /^.{6,}$/;
    value=turnString(value);
    if (!isEmpty(value) && value.search(test) == -1) {
        if(lang==="cn"){
            callback(new Error("密码至少为6位"));
        }else if(lang==="en"){
            callback(new Error("Password at lease 6 bit"));
        }
      
    } else {
      callback();
    }
  };
  //两位小数
var validateHasTwoDecimal=(rule, value, callback) => {
    let test = /(?!^0\d+)^([0-9]\d*(?:\.\d{1,2})?)$/;
    value=turnString(value);
    if (!isEmpty(value) && value.search(test) == -1) {
        if(lang==="cn"){
            callback(new Error("只允许两位小数"));
        }else if(lang==="en"){
            callback(new Error("Only two decimal digits are allowed"));
        }
    } else {
      callback();
    }
  };
  //两位小数不为0
var validateHasTwoDecimalNotZero=(rule, value, callback) => {
    //排除0,023,1.
    let test = /(?!(?:(?:^0$)|(?:^0\d+)))^([0-9]\d*(?:\.\d{1,2})?)$/;
    value=turnString(value);
    if (!isEmpty(value) && value.search(test) == -1) {
        if(lang==="cn"){
            callback(new Error("只允许两位小数并不包含0"));
        }else if(lang==="en"){
            callback(new Error("Only two decimal digits are allowed not 0"));
        }
        
    } else {
        callback();
    }
};
function maxMsg(len){
    if(lang==="cn"){
        return `不能超过${len}个字节`
    }else if(lang==="en"){
        return `Don't above ${len} byte`
    }
}
function minMsg(len){
    if(lang==="cn"){
        return `至少${len}个字节`
    }else if(lang==="en"){
        return `At lease ${len} byte`
    }
}
export {
    validatePhone,
    validateCard,
    validateIdCard,
    validateNumber,
    validateHasDecimal,
    validateChinese,
    validateAccount,
    validateNaturalNumber,
    validatePrice,
    validatePassword,
    validateHasTwoDecimal,
    validateHasTwoDecimalNotZero,
    maxMsg,
    minMsg
}