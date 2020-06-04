<template lang='html'>
    <div class="rel search">
         <el-autocomplete ref="autocomplete"
        v-model="name"
        @input="(v)=>coachInput(v)"
        @blur="(v)=>coachBlur(v)"
        :fetch-suggestions="querySearchAsync"
        :placeholder="placeholder"
        @select="(v)=>handleSelect(v)"
        :debounce="debounce"
        :class="classObj"
        :clearable="clearable"
        >
        </el-autocomplete>
        <i v-if="isHasId" class="el-icon-check"></i>
    </div>
</template>
<script>
    import {isEmpty,debounce,getAsso} from "assets/js/reused";
    let oldId=null;
     export default {
        name: 'SearchBar',
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
                default:"请输入学员"
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
            clearable:{
                type:Boolean,
                default:false
            },
            link:{
                type:String,
                default:"system/associative"
            },
            pushCallback:{//this.memberList添加东西的过滤条件
                type:Function,
                default:(element)=>{
                    return {
                        value: element.name+"　　"+element.tel,//显示需要的
                        id: element.id
                    }
                }
            },
            isRequired:{
                type:Boolean,
                default:true
            },
            handleSelectCallBack:{//下拉菜单,选择完回调
                type:Function,
                default:(v)=>{
                    return v.id
                }
            }
        },
        data () {
            return{
                list:[],
                id:"",
                name:"",
                isHasId:false,
                defaultValue:this.isRequired?"":0
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
                    //处理memberId为0为空串的情况
                    if(newV!==0&&newV!==''&&newV!==null){
                        this.id = newV;
                        this.isHasId=true;
                    }
                    else{
                        this.isHasId=false;
                        //处理成空串是因为必填项需要,为0非必填项
                        this.id=this.defaultValue;
                        this.name="";
                        this.setParentVal("")
                    }
                },
                immediate: true,
                deep:true
            },
        },
        methods:{
             getData(v) {
                let obj;
                if(this.editSearchOpt){
                    obj=this.searchOpt(v)
                }else{
                    obj={ nameLike: v,
                        trainCategoryIdsNotEqualNull:1,
                        ...this.otherSearchOpt};
                }
                return new Promise(async (resolve, reject) => {
                    if(this.link==="system/associative"){
                        resolve(await getAsso(obj));
                    }else{
                        this.$axios.post({
                            url: baseURL + this.link,
                            data: {
                            ...obj
                            },
                            success: res => {
                                resolve(res.data);
                            }
                        });
                    }
                });
            },
            coachInput(){
                this.id=this.defaultValue;
                this.$emit("input",this.id);
            },
            coachBlur(v){
                 if (
                        this.id === 0 ||
                        this.id === ""||
                        this.list.length===0
                    ) {
                        this.$nextTick(()=>{
                            this.name = "";
                            this.isHasId=false;
                            this.setParentVal("")
                        })
                    }
            },
            querySearchAsync(queryString, cb) {
                //模糊匹配
                this.list = [];
                //用this.name的原因是清空后可以立即查询
                // autocomplete
                this.getData(this.name).then(res => {
                    res.forEach(element => {
                        this.list.push(this.pushCallback(element));
                    });
                    cb(this.list);
                });
            },
            setParentVal(name){
                //防止多次触发
                if(oldId!=this.id){
                    this.$emit("change",this.id);
                    this.$emit("input",this.id);
                    this.$emit("update:nameLike",name);
                    oldId=this.id;
                }
            },
            handleSelect(v) {
                this.id=this.handleSelectCallBack(v);
                this.isHasId=true;
                this.setParentVal(v.value)
                oldId=null;
            }
        }
    }
</script>
<style scoped>
.el-autocomplete{
    float: left;
    width: 88%;
}
.el-icon-check{
    color: green;
    position: absolute;
	right: 10px;
	top: 50%;
	transform: translateY(-50%);
}
.search{
    overflow: hidden;
}
</style>