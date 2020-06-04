import Vue from "vue";
const errorHandler = (error, vm,info)=>{
    const pattern = /(Failed to load resource: the server responded with a status of 404)|(net::ERR_ABORTED 404)/g;
    if(error.message){
        const isChunkLoadFailed = error.message.match(pattern);
        console.error(error);
        if (isChunkLoadFailed) {
            Vue.prototype.$alert("客户端资源已更新,点击确定按钮刷新资源", {
                confirmButtonText: '确定',
                callback: action => {
                    location.reload()
                }
            })
        }
    }else if(error.data){
        Vue.prototype.$alert(error.data.message, {
            confirmButtonText: '确定',
            callback: action => {
                location.reload()
            }
        })
    }
    if(vm)console.error(vm);
    if(info)console.error(info);
}
export default errorHandler