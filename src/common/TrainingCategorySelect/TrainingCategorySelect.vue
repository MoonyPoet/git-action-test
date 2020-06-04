<template lang='html'>
    <div>
          <div class='training_category'>
            <!--按照机构分默认不显示-->
            <el-form :model="formData" :rules="rules" size="medium" ref="formData" label-width="200px" label-position="left" class="demo-ruleForm">
                <!-- 下拉框 -->
                <el-form-item :label="(typeof(label)=='undefined'?'培训类别':label)" prop="trainCategoryId">
                    <el-select v-model="formData.trainCategoryId" @change="changeCheckSelect" placeholder="请选择">
                        <el-option
                        v-for="item in checkObj"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                        </el-option>
                    </el-select>
                 </el-form-item>
            </el-form>
        </div>
    </div>
  
</template>
<script>
    import {getCookie,clone,type,selectEditDefaultData,isEmpty} from "assets/js/reused"
     export default {
        name: 'TrainingCategorySelect',
        props:{
            trainCategoryIdData:String,//编辑时调用
            trainsData:Object,//关联时调用,主要是按照校区分
            label:String,//修改标题名称,
            checkObjData:{ //编辑时的所有数据
                type:Array,
                default:function(){
                    return []
                }
            },
            value:{
                type:[String,Number],
                default:""
            },
            all:{
                type:Boolean,
                default:false
            },// 按照校区分为false,不按校区分为true,默认为false
        },
        data () {
            return {
                    checkObj:[],
                    formData: {
                        trainCategoryId:""
                    },
                    trainCategoryId:"",
                    rules:{
                        trainCategoryId:[
                            { required: true, message: this.$t('form.required'),trigger: 'change' }
                        ]
                    }
                }
        },
        created(){
            if(this.all==true){
                this.getTraincategory();
            }
        },
        mounted(){
        },
        watch:{
            trainCategoryIdData(newV,oldV){
                //编辑时,默认参数
                this.formData.trainCategoryId=parseInt(newV);
            },
            value(newV,oldV){
                if(!isEmpty(newV)){
                    this.trainCategoryId=parseInt(newV);
                    this.formData.trainCategoryId=selectEditDefaultData(this.checkObj,"id",this.trainCategoryId)
                }
            },
            formData:{
                handler(newV,oldV){
                    this.$emit("input",this.formData.trainCategoryId)
                },
                immediate: true,
                deep: true
            },
            trainsData(newV,oldV){
                //按照校区分
                if(this.all==false){
                    this.findTrainByCampus(newV).then((res)=>{
                        this.checkObj=Array.prototype.concat.apply([],Object.values(res.data));
                        this.formData.trainCategoryId=selectEditDefaultData(this.checkObj,"id",this.trainCategoryId)
                    })
                }
            },
            checkObjData(newV,oldV){
                this.checkObj=Array.prototype.concat.apply([],Object.values(newV));
                this.formData.trainCategoryId=selectEditDefaultData(this.checkObj,"id",this.trainCategoryId)
            }
        },
        methods:{
            getTraincategory(data=("0,"+getCookie("baseInfo").institutionId)){
                //获取类别数据,不按照校区分,按照机构分
                this.$axios.post({
                    url:baseURL+"traincategory/find",
                    data:{
                        institutionId:data
                    },
                    success:(res)=>{
                        this.checkObj=Array.prototype.concat.apply([],Object.values(res.data));
                        this.formData.trainCategoryId=selectEditDefaultData(this.checkObj,"id",this.trainCategoryId)
                     }
                    })
            },
            findTrainByCampus(data){
                //按照校区分
                return new Promise((resolve,reject)=>{
                    this.$axios.post({
                        url:baseURL+"common/findtrainbycampus",
                        data:data,
                        success:(res)=>{
                            resolve(res)
                        }
                    })
                })
            },
            changeCheckSelect(){
                //选择单选框
                this.$emit("trainCategoryIdData",this.formData.trainCategoryId);
                this.$emit("input",this.formData.trainCategoryId)
            },
            submit(callback){
                //提交时调用
                 this.$refs["formData"].validate((valid,prop)=>{
                        callback(valid,this.formData,prop)
                    
                })   
            }
        }
    }
</script>
<style lang="scss" scoped>
.training_category{
    .el-checkbox+.el-checkbox{
        margin: 0;
        margin-right: 50px;
    }
    .el-checkbox{
        margin-right: 50px;
    }
    .el-radio+.el-radio{
        margin: 0;
        margin-right: 50px;
    }
    .el-radio{
        margin-right: 50px;
        padding-bottom: 20px;
    }
} 
</style>