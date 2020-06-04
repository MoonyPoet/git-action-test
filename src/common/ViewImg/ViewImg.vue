<template lang='html'>
    <div class="imgList">
        <div v-if="imgList&&imgList.length>0">
            <div v-for="item in imgList" class="list">
                <div class="play">
                    <div class="el-icon-zoom-in san" @click="playImg(item)"></div>
                </div>
                 <img :src="item">
            </div>
        </div>
        <div v-else>
            无图片
        </div>
        <el-dialog
        width="50%"
        title="查看图片"
        :visible.sync="innerVisible"
        append-to-body>
        <img :src="imgSrc" class="dialog_img" alt="">
        </el-dialog>
    </div>
</template>
<script>
    import {type,getCookie,isEmpty} from "assets/js/reused";
     export default {
        name: 'viewImg',
        props:{
            value:{
                type:[String,Array],
                default:""
            }
        },
        data () {
            return{
                imgList:[],
                innerVisible:false,
                imgSrc:""
            }
        },
        watch:{
            value:{
                handler(newV,oldV){
                    if(type(newV)=="string"){
                        if(!isEmpty(newV)){
                            this.imgList=newV.split(",").filter((item)=>item);
                            // .map((item)=>getCookie("imgOrVideo").imgUrl+item)
                        }else{
                            this.imgList=[];
                        }
                    }else{
                        if(!isEmpty(newV)){
                            this.imgList=[...newV].filter((item)=>item).map((item)=>{
                                return getCookie("imgOrVideo").imgUrl+item;
                            });
                        }else{
                            this.imgList=[];
                        }
                    }
                },
                immediate:true,
                deep:true
            }
        },
        methods:{
            playImg(imgSrc){
                this.innerVisible=true;
                this.imgSrc=imgSrc;
            }
        }
    }
</script>
<style lang="scss" scoped>
    .imgList{
        img{
            width: 200px;
            height: 200px;
            margin-right: 20px;
            border-radius: 5px;
        }
        .list{
            display: inline-block;
            position: relative;
            .play{
                position: absolute;
                width: 100%;
                height: 100%;
                left: 0;
                top: 0;
                cursor: default;
                text-align: center;
                color: #fff;
                opacity: 1;
                font-size: 20px;
                background-color: #00000080;
                -webkit-transition: opacity .3s;
                transition: opacity .3s;
                width: 200px;
                height: 200px;
                border-radius: 5px;
                .san{
                    position: absolute;
                    left: 0;
                    right: 0;
                    top: 0;
                    bottom: 0;
                    margin:auto;
                    width: 20px;
                    height: 20px;
                    cursor:pointer;
                }
            }
        }
    }
    .dialog_img{
        width: 100%;
    }
</style>