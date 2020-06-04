<template>
    <div class="imageBar">
        <div v-if="load" class="ass">
            <img :class="className" ref="img" :width="width" :height="height" :src="imgSrc" alt="" style="vertical-align:middle">
        </div>
        <div v-else-if="fail" class="ass">
            <img :class="className" ref="img" :width="width" :height="height" :src="fail" @error="errload" alt="" style="vertical-align:middle">
        </div>
    </div>
    
</template>
<script>
    import {getCookie,isEmpty} from "assets/js/reused";
    export default{
        props:{
            load:String,
            fail:String,
            className:String,
            width:String,
            height:String,
            round:{
                type:Boolean,
                default:true
            }
        },
        created(){
            // this.$refs.img.$el
            this.$nextTick(()=>{
                if(this.$refs.img){
                    if(this.round){
                        this.$refs.img.style.borderRadius="50%";
                        if(this.$refs.img.offsetWidth){
                            this.$refs.img.style.height=this.$refs.img.offsetWidth+"px";
                        }
                    }
                    this.$refs.img.onerror=(e)=>{
                            // console.log(e)
                            this.imgSrc=this.fail
                    }   
                }
            })
            // document.querySelector("img").style="borderRadius:50%;"
        },
        data(){
            return{
                imgSrc:this.load?undefined:""
            }
        },
        watch:{
            load:{
               async handler(newV,oldV){
                    let reg=/^http/g;
                    if(typeof this.load=='undefined'){
                        newV="";
                    }
                    if(newV&&newV.match(reg)){
                        this.imgSrc=newV;
                    }else{
                        this.imgSrc=await this.getImgUrl()+newV;
                    }
                },
                immediate:true,
                deep:true
            }
        },
        methods:{
            errload(){
              console.log(1)
               this.imgSrc=this.fail
            },
            getImgUrl(){
                return new Promise((resolve,reject)=>{
                    let timeStamp = new Date().getTime();
                    let clearId = setInterval(() => {
                        let timeStamp1 = new Date().getTime();
                        if (!isEmpty(this.$store.getters.imgOrVideo.imgUrl)) {
                            clearInterval(clearId)
                            resolve(this.$store.getters.imgOrVideo.imgUrl)
                        }
                        if ((timeStamp1 - timeStamp) >= 500) {
                            clearInterval(clearId)
                            resolve("")
                        }
                    })
                })
            }
        }
    }
</script>
<style lang="scss" scoped>
    .imageBar{
    }
    
</style>
