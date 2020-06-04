import {type} from "./reused";
class ValidFormItem{
    constructor({key="",vaildObj="",title="",vaildRule=[],index=0}={})
    {
        this.key=key;
        this.vaildObj=type(vaildObj)===null?"":vaildObj;
        this.message = "";
        this.title=title;
        this.index=index;
        this.vaildRule=vaildRule;
        //校验状态
        this.vaildStatus=false;
    }
    //校验方法
    vaild(){
        let vaildObj=[];
        this.vaildRule.map((item)=>{
            item.validator(null,this.vaildObj,(err)=>{
                if(err){
                    vaildObj.push({
                        status:!err,
                        message:err.message
                    })
                }else{
                    vaildObj.push({
                        status:true,
                        message:""
                    })
                }
            }) 
        })
        if(vaildObj.every((item)=>item.status===true)){
            this.vaildStatus=true;
        }else{
            this.vaildStatus=false;
        }
        if(this.vaildStatus===false){
            vaildObj.map((item)=>{
                if(item.status===false){
                    this.message=item.message;
                    return
                }
            })
        }
    }
    //获取信息
    getMessage(){
        return this.message;
    }
    //获取校验状态
    getVaildStatus(){
        return this.vaildStatus;
    }
    getTitle(){
        return this.title;
    }
    getKey(){
        return this.key;
    }
    getIndex(){
        return this.index;
    }
}
export default ValidFormItem;