<template lang='html'>
     <el-dialog
      title="提示"
      width="20%"
      :before-close="handleClose"
      :visible="dialogVisible"
      >
      <div id="qrcodeDiv">
      </div>
      <span slot="footer" class="dialog-footer">
          <el-button @click="cancal">关闭</el-button>
      </span>
    </el-dialog>
</template>
<script>
import QRCode from "assets/js/qrcode.min.js";
     export default {
        name: 'QrCode',
         props:{
            value:{
                type:String,
                default:""//为url链接
            }
         },
        data () {
            return{
                dialogVisible:false
            }
        },
        methods:{
            QRCodeShow(){
                 let img=new Image();
                    img.src =location.origin+"/manage/img/qrCode/dongbao.png";
                    this.dialogVisible=true;
                    img.onload = () => {
                    this.$nextTick(()=>{
                        document.getElementById("qrcodeDiv").innerHTML="<img class='qr_logo'>";
                        let qrcode = new QRCode(document.getElementById("qrcodeDiv"), {
                            width : 300,
                            height : 300
                        });
                        qrcode.makeCode(this.value);
                        document.querySelector(".qr_logo").setAttribute("src",img.src);
                    })
                }
            },
            handleClose(){
                this.dialogVisible=false;
            },
            cancal(){
                this.handleClose()
            }
        }
    }
</script>
<style lang="scss" scoped>
#qrcodeDiv {
  position: relative;
  text-align: center;
  overflow: hidden;
  width: 300px;
  margin: 0 auto;
  /deep/.qr_logo {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>