<template lang='html'>
    <div class="iphone">
        <iframe ref="iframe" frameborder="0"></iframe>
    </div>
</template>
<script>
     export default {
        name: 'Iphone',
        props:{
            url:{
                type:String,
                default:"http://www.baidu.com"
            }
        },
        data () {
            return{
            }
        },
        created(){
            this.$nextTick(()=>{
                this.set(this.url)
            })
        },
        methods:{
            set(url){
                this.$refs.iframe.contentWindow.location.replace(url)
            }
        }
    }
</script>
<style lang="scss" scoped>
    .iphone{
        position: relative;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        background: url("/manage/img/iphone6.png") ;
        width:413px;
        height:809px;
        iframe{
            width: 375px;
            height: 667px;
            top: 61px;
            left: 0;
            right: 0;
            margin: auto;
            position: absolute;
        }
    }
</style>