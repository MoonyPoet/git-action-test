<template lang='html'>
    <div>
        <el-dialog
            ref="dialog"
            center
            :title="title"
            :visible.sync="dialogVisible"
            :width="width"
            :before-close="close">
            <div>
                <slot name="content"></slot>
            </div>
            <span slot="footer" class="dialog-footer" v-if="isShowFooter">
                <slot name="footer"></slot>
                <span v-if="!$slots.footer">
                    <el-button @click="close">{{cancelText}}</el-button>
                    <el-button type="primary" @click="submit">{{submitText}}</el-button>
                </span>
            </span>
        </el-dialog>
    </div>
</template>
<script>
    import {isEmpty,type} from "assets/js/reused";
     export default {
        name: 'Dialog',
        props:{
            value:{
                type:Boolean,
                default:false
            },
            cancelText:{
                type:String,
                default:"取消"
            },
            submitText:{
                type:String,
                default:"提交"
            },
            width:{
                type:String,
                default:"30%"
            },
            title:{
                type:String,
                default:"提示"
            },
            isShowFooter:{
                default:true
            }
        },
        data () {
            return{
                dialogVisible:this.value
            }
        },
        methods:{
            close(){
                this.dialogVisible=false;
                this.$emit("input",this.dialogVisible)
            },
            show(){
                this.dialogVisible=true;
                this.$emit("input",this.dialogVisible)
            },
            submit(){
                this.$emit("submit",this.$refs.dialog)
            }
        }
    }
</script>
<style scoped>
    
</style>