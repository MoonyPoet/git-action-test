class Observer{
    count=0;
    resolveCount=0;
    fnArr=[];
    subscribe(){
        this.count++;
    }
    setCallback(callback){
        this.callback=callback;
    }
    onResolve(){
        this.resolveCount++;
        this.notice();
    }
    canSub(){
        //取消订阅
        this.count--;
    }
    notice(){
        if(this.count===this.resolveCount){
            this.callback();
            this.resolveCount=0;
            this.count=0;
        }
    }
}
export default Observer;