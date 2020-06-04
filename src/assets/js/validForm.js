import ValidFormItem from "./validFormItem.js";
import {type} from "./reused";
class ValidForm{
    constructor(vaildFormArr=[])
    {
        this.vaildArr=[];
        this.message=[];
        this.vaildFormArr=vaildFormArr;
        this.test()
    }
    test(){
        this.vaildFormArr.map((element)=>{
            for(let key in element.vaildArrObj){
                if(type(element.vaildArrObj[key].value)==="array"){
                    element.vaildArrObj[key].value.map((v,index)=>{
                        let obj=new ValidFormItem({key:key+index,vaildObj:element.vaildArrObj[key].value[index],title:element.vaildArrObj[key].title,vaildRule:element.rules,index:index})
                        obj.vaild();
                        this.vaildArr.push({key:obj.getKey(),vaildStatus:obj.getVaildStatus(),message:obj.getMessage(),title:obj.getTitle(),index:obj.getIndex()})
                    })
                }else{
                    let obj=new ValidFormItem({key:key,vaildObj:element.vaildArrObj[key].value,title:element.vaildArrObj[key].title,vaildRule:element.rules,index:0})
                    obj.vaild();
                    this.vaildArr.push({key:obj.getKey(),vaildStatus:obj.getVaildStatus(),message:obj.getMessage(),title:obj.getTitle(),index:obj.getIndex()})
                }
                
            }
        })
    }
    getStatus(){
       return this.vaildArr.every((item)=>item.vaildStatus===true)
    }
    getMessage(){
        this.message=[];
        this.vaildArr.map((item)=>{
            if(item.vaildStatus===false){
                this.message.push({
                    key:item.key,
                    message:item.message,
                    title:item.title,
                    vaildStatus:item.vaildStatus,
                    index:item.index
                })
            }
        })
        return this.message;
    }
    getFirstMessage(){
        this.getMessage();
        return this.message[0]
    }
}
//用法
// let validResult=new ValidForm([
//     {
//        vaildArrObj:{
//            a:{
//                value:["1","-12","-3"],
//                title:"卡种"
//            },
//            b:{
//                value:"1",
//                title:"苹果"
//            }
//        },
//         rules: [
//             {
//                 validator:validateNumber
//             },
           
//         ]
//     },
//     {
//         vaildArrObj:{
//             c:{
//                 value:"3",
//                 title:"卡种1"
//             },
//             d:{
//                 value:"1",
//                 title:"苹果1"
//             }
//         },
//          rules: [
//             {
//                 validator:validateNaturalNumber
//             }
//          ]
//      }
// ])
export default ValidForm