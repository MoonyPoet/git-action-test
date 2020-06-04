//取消上个页面正在pading所有请求
import axios from "axios";
const Pading="pading";
const Paded="paded";
class CancelRequest{
    constructor(){
        this.cancelRouterFn=[];
        this.cancelToken=undefined;
        this.routerArr=[];
    }
    setRouter(Router){
        this.routerArr.push(Router)
    }
    setCancelToken(){
        this.cancelToken=new axios.CancelToken((cancel)=>{
            this.cancelRouterFn.push({
                cancel,
                status:Pading,
                router:this.getRouter()
            });
        })
    }
    getRouter(){
        let result=location.hash.match(/^\#(\/\w+)+/g);
        let router;
        if(result){
            router=result[0].split("#")[1];
        }else{
            router=location.hash;
        }
        return router;
    }
    setPaded(){
        //设置paded状态
        this.cancelRouterFn.forEach((item)=>{
            if(item.router===this.getRouter()){
                item.status=Paded;
            }
        })
    }
    getCancelToken(){
        return this.cancelToken;
    }
    clearToken(){
        this.cancelRouterFn.forEach((item)=>{
            if(this.routerArr[this.routerArr.length-2]===item.router&&item.status===Pading){
                item.cancel("取消请求");
            }
        })
        this.cancelRouterFn=this.cancelRouterFn.slice(-5);
    }
}
(()=>{
    if(!window.cancelRequest instanceof CancelRequest){
        window.cancelRequest=new CancelRequest()
    }
})()
// if(!window.cancelRequest){
//     window.cancelRequest=new CancelRequest();
// }
