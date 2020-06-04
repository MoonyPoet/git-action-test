class Dialog{
    constructor({isOpenDialog}={}){
        this.isOpenDialog=isOpenDialog;
    }
    openDialog(){
        this.isOpenDialog=true;
    }
    closeDialog(){
        this.isOpenDialog=false;
    }
    getDialogStatus(){
        return this.isOpenDialog;
    }
}
class Logout{
    constructor({isLogout=false}={}){
        this.isLogout=isLogout;
    }
    setLogot(){
        this.isLogout=true
    }
}
let dialog=new Dialog();
let logout=new Logout();
export {
    dialog,
    logout
}