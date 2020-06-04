<template lang='html'>
    <div class="videoList">
        <div v-if="videoList&&videoList.length>0">
            <div v-for="item in videoList" class="list">
                <div class="play">
                    <div class="san" @click="playVideo(item)"></div>
                </div>
                 <img :src="item">
            </div>
        </div>
        <div v-else>
            无视频
        </div>
        <el-dialog
        width="50%"
        title="查看视频"
        :before-close="handleClose"
        :visible.sync="innerVisible"
        append-to-body>
         <video class="video"   controls="controls" style="max-width:100%;margin: 0 auto;display: block;" name="media">
             <!-- <source type="video/mp4" > -->
             <source type='video/mp4; codecs="avc1.42E01E, mp4a.40.2"' >
             <source type='video/webm; codecs="avc1.42E01E, mp4a.40.2"' >
             <source type='video/ogg; codecs="avc1.42E01E, mp4a.40.2"' >
             <!-- <source type="video/webm" > -->
             <!-- <source type="video/ogg" > -->
                您的浏览器不支持 video 标签。
            </video>
        
        <!-- <iframe class="dialogFrame" :src="iframeSrc" frameborder="0"></iframe> -->
        </el-dialog>
    </div>
</template>
<script>
    import {type,getCookie,isEmpty} from "assets/js/reused";
     export default {
        name: 'viewVideo',
        props:{
            value:{
                type:[String,Array],
                default:""
            }
        },
        data () {
            return{
                videoList:[],
                iframeSrc:"",
                innerVisible:false,
            }
        },
        watch:{
            value:{
                handler(newV,oldV){
                    if(type(newV)=="string"){
                        if(!isEmpty(newV)){
                            this.videoList=newV.split(",").filter((item)=>item).map((item)=>getCookie("imgOrVideo").vodIfrUrl+item+"?vframe/png/offset/1/w/920/h/920");
                        }else{
                            this.videoList=[];
                        }
                    }else{
                        if(!isEmpty(newV)){
                            this.videoList=[...newV].filter((item)=>item).map((item)=>{
                                return getCookie("imgOrVideo").vodIfrUrl+item+"?vframe/png/offset/1/w/920/h/920";
                            });
                        }else{
                            this.videoList=[];
                        }
                    }
                },
                immediate:true,
                deep:true
            }
        },
        methods:{
            playVideo(videoSrc){
                this.innerVisible=true;
                this.iframeSrc=videoSrc.split(/\?*(?=vframe)/g)[0];
                this.$nextTick(()=>{
                    document.querySelector(".video").src=this.iframeSrc;
                })
            },
            handleClose(){
                document.querySelector(".video").pause();
                this.innerVisible=false;
            }
        }
    }
</script>
<style lang="scss" scoped>
    .videoList{
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
                        margin: auto;
                        width: 10px;
                        height: 0px;
                        border-left: 20px solid #fff;
                        border-top: 10px solid #f000;
                        border-bottom: 10px solid #0000;
                        cursor: pointer;
                }
            }
        }
    }
    .dialogFrame{
            width: 100%;
            min-height: 500px;
        }
</style>