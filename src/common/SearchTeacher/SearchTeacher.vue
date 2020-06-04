<template lang='html'>
    <div>
         <el-autocomplete style="width:100%;"
        v-model="name"
        @input="(v)=>coachInput(v)"
        @blur="(v)=>coachBlur(v)"
        :fetch-suggestions="querySearchAsync"
        :placeholder="placeholder"
        @select="(v)=>handleSelect(v)"
        :debounce="debounce"
        :class="classObj"
        >
        </el-autocomplete>
    </div>
</template>
<script>
     export default {
        name: 'SearchTeacher',
        props:{
            value:{
                type:[Number,String],
                default:0
            },
            nameLike:{
                type:String,
                default:""
            },
            placeholder:{
                type:String,
                default:"请输入老师"
            },
            classObj:{
                type:Object,
                default:()=>{}
            },
            otherSearchOpt:{//模糊搜索时其他条件
                type:Function,
                default:(v)=>{}
            },
            searchOpt:{
                type:Function,
                default:(v)=>{}
            },
            editSearchOpt:{
                type:Boolean,
                default:false,
            },
            debounce:{
                type:Number,
                default:500
            },
            link:{
                type:String,
                default:"member/find"
            },
            pushCallback:{//this.memberList添加东西的过滤条件
                type:Function,
                default:(element)=>{
                    return {
                        value: element.name+"　　"+element.tel,//显示需要的
                        memberId: element.memberId
                    }
                }
            },
            handleSelectCallBack:{//下拉菜单,选择完回调
                type:Function,
                default:(v)=>{
                    return v.memberId
                }
            }
        },
        data () {
            return{
                memberList:[],
                memberId:"",
                name:""
            }
        },
        watch:{
            nameLike: {
                handler(newV, oldV) {
                    this.name = newV;
                },
                immediate: true,
                deep:true
            },
            value:{
                 handler(newV, oldV) {
                    //处理memberId为0的情况
                   if(newV!==0&&newV!==''){
                        this.memberId = newV;
                    }
                    else{
                        this.memberId="";
                        this.name="";
                        this.$emit("update:nameLike","");
                        this.$emit("input",this.memberId)
                    }
                },
                immediate: true,
                deep:true
            }
        },
        methods:{
             getMemberId(v) {
                let obj;
                if(this.editSearchOpt){
                    obj=this.searchOpt(v)
                }else{
                    obj={ nameLike: v,
                        trainCategoryIdsNotEqualNull:1,
                        ...this.otherSearchOpt};
                }
                return new Promise((resolve, reject) => {
                    this.$axios.post({
                    url: baseURL + this.link,
                    data: {
                      ...obj
                    },
                    success: res => {
                        resolve(res);
                    }
                    });
                });
            },
            coachInput(){
                this.memberId="";
                this.$emit("input",this.memberId);
            },
            coachBlur(v){
                 if (
                        this.memberId === 0 ||
                        this.memberId === ""
                    ) {
                        this.name = "";
                    }
            },
            querySearchAsync(queryString, cb) {
                //模糊匹配
                this.memberList = [];
                this.getMemberId(queryString).then(res => {
                    res.data.forEach(element => {
                    this.memberList.push(this.pushCallback(element));
                    });
                    cb(this.memberList);
                });
            },
            handleSelect(v) {
                this.memberId=this.handleSelectCallBack(v);
                this.$emit("input",this.memberId);
                this.$emit("update:nameLike",v.value);
            }
        }
    }
</script>
<style scoped>
    
</style>