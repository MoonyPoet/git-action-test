<template lang='html'>
    <div>
        <el-dialog
            title="提示"
            :visible.sync="dialogVisible"
            :before-close="beforeClose"
            width="35%"
            >
            <el-form ref="formData" :model="formData" label-width="200px" label-position="left">
                <el-form-item :label="imgTitle" v-show="!imgHidden">
                   <ViewImg v-model="formData.imgfiles"></ViewImg>
                </el-form-item>
                <el-form-item :label="videoTitle" v-show="!videoHidden">
                    <ViewVideo v-model="formData.vodfiles"></ViewVideo>
                </el-form-item>
                <el-form-item :label="contentTitle">
                    <div v-if="formData.content&&formData.content.length>0" v-html="formData.content"></div>
                    <div v-else>无内容</div>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancel">关闭</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
    import ViewImg from "common/ViewImg";
    import ViewVideo from "common/ViewVideo";
     export default {
        components:{
            ViewImg,
            ViewVideo
        },
        props:{
            value:{
                type:Boolean,
                default:false
            },
            content:{
                type:String,
                default:""
            },
            imgList:{
                type:String,
                default:""
            },
            videoList:{
                type:String,
                default:""
            },
            imgHidden:{
                type:Boolean,
                default:false
            },
            videoHidden:{
                type:Boolean,
                default:false
            },
            imgTitle:{
                type:String,
                default:"图片"
            },
            videoTitle:{
                type:String,
                default:"视频"
            },
            contentTitle:{
                type:String,
                default:"内容"
            }
        },
        name: 'dailog',  
        data () {
            return{
                dialogVisible:false,
                formData:{
                    content:"",
                    vodfiles:"",
                    imgfiles:""
                }
            }
        },
        watch:{
            value(newV,oldV){
                this.dialogVisible=newV;
                this.$emit("input",this.dialogVisible)
            },
            content(newV,oldV){
                this.formData.content=newV;
            },
            imgList(newV,oldV){
                this.formData.imgfiles=newV;
            },
            videoList(newV,oldV){
                this.formData.vodfiles=newV;
            }
        },
        methods:{
            cancel(){
                this.dialogVisible = false;
                this.$emit("input",this.dialogVisible)
            },
            beforeClose(){
                this.dialogVisible = false;
                this.$emit("input",this.dialogVisible)
            }
        }
    }
</script>
<style scoped>
    
</style>