//业务代码放这,目前主要是查询
async function getMemeberData(data={}){
    return (await post("operator/info",data));
}
export {
    getMemeberData
}