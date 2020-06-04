<template lang='html'>
    <div>
          <div class='training_category'>
            <!--按照机构分默认不显示-->
            <el-form :model="formData" :rules="rules" size="medium" ref="formData" label-width="200px" label-position="left" class="demo-ruleForm">
                <!-- 复选框 -->
                <div v-if="radio==false">
                    <el-form-item :label="(typeof(label)=='undefined'?'培训类别':label)" prop="trainCategoryIds">
                        <div v-if="isShow">
                            <div v-if="all==true">
                                <!-- 不按校区分 -->
                                <div v-for="item in checkObj" :key="item.key">
                                    <el-checkbox-group v-model="formData.trainCategoryIds" @change="changeCheckBox">
                                    <el-checkbox :label="a.id" name="trainCategoryIds" v-for="a in item" :key="a.id">{{a.name}}</el-checkbox>
                                    </el-checkbox-group>
                                </div>
                            </div>
                            <div v-else>
                                <!-- 按校区分 -->
                                <el-checkbox-group v-model="formData.trainCategoryIds" @change="changeCheckBox">
                                    <el-checkbox :label="a.id" name="trainCategoryIds" v-for="a in checkObj" :key="a.id">{{a.name}}</el-checkbox>
                                </el-checkbox-group>
                            </div>
                        </div>
                        <div v-else>
                            无培训类别
                        </div>
                    </el-form-item>
                </div>
                <div v-else>
                    <!-- 单选框 -->
                    <el-form-item :label="(typeof(label)=='undefined'?'培训类别':label)" prop="trainCategoryIds">
                        <div v-if="isShow">
                            <div style="display:inline-block;" v-for="item in checkObj" :key="item.key">
                                <el-radio-group v-model="formData.trainCategoryIds" @change="changeCheckRadio">
                                    <el-radio :label="a.id" name="trainCategoryIds" v-for="a in item" :key="a.id">{{a.name}}</el-radio>
                                </el-radio-group>
                            </div>
                        </div>
                        <div v-else>无培训类别</div>
                    </el-form-item>
                </div>
            </el-form>
        </div>
    </div>
  
</template>
<script>
    import {getCookie,clone,type,isEmpty} from "assets/js/reused"
     export default {
        name: 'TrainingCategory',
        props:{
            trainCategoryIdsData:String,//编辑时调用
            trainsData:Object,//关联时调用,主要是按照校区分
            radio:Boolean,//单选框
            label:String,//修改标题名称,
            checkObjData:{ //编辑时的所有数据
                type:Array,
                default:function(){
                    return []
                }
            },
            value:{
                type:Array,
                default:function(){
                    return []
                }
            },
            all:{
                type:Boolean,
                default:false
            },// 按照校区分为false,不按校区分为true,默认为false
        },
        data () {
            return {
                    checkObj:"",
                    formData: {
                        trainCategoryIds:[]
                    },
                    isFilter:false,
                    rules:{
                        trainCategoryIds:[
                            { required: true, message: this.$t('form.required'),trigger: 'change' }
                        ]
                    }
                }
        },
        computed:{
            isShow(){
                console.log((this.all==true||(this.all==false&&this.checkObj.length!=0)))
                return (this.all==true||(this.all==false&&this.checkObj.length!=0))
            },
        },
        created(){
            if(this.all==true){
                this.getTraincategory();
            }
        },
        mounted(){
            if(typeof(this.radio)==undefined||this.radio==false){
                document.querySelector(".training_category .el-form-item__content").style.paddingTop=0+'px';
            }
        },
        watch:{
            trainCategoryIdsData(newV,oldV){
                //编辑时,默认参数
                if(this.radio){
                    this.formData.trainCategoryIds=parseInt(newV);
                }else{
                    this.formData.trainCategoryIds=newV.split(",").map(v=>parseInt(v));
                }
            },
            checkObjData(newV,oldV){
                if(isEmpty(this.value)){
                    this.checkObj=newV;
                }else{
                    this.updateCheck(this.value,newV);
                }
                
            },
            value(newV,oldV){
                if(isEmpty(this.checkObjData)){
                    this.formData.trainCategoryIds=newV;
                }else{
                    this.updateCheck(newV,this.checkObjData);
                }
                
            },
            formData:{
                handler(newV,oldV){
                    this.$emit("input",this.formData.trainCategoryIds)
                },
                immediate: true,
                deep: true
            },
            trainsData(newV,oldV){
                //按照校区分
                if(this.all==false){
                    this.findTrainByCampus(newV).then((res)=>{
                        this.checkObj=res.data;
                    })
                }
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
                        this.checkObj=res.data;
                    }
                    })
            },
            updateCheck(newV,newCheckData){
                let checkData=[];
                if(!isEmpty(newV)&&this.isFilter===false){
                    newV.filter((element)=>{
                        if(newCheckData.some((item)=>item.id==element)){
                            checkData.push(element)
                        }
                    })
                    this.isFilter=true;
                    this.formData.trainCategoryIds=checkData;
                    this.checkObj=newCheckData;
                    this.$emit("input",checkData)
                }
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
            changeCheckRadio(){
                //选择单选框
                this.$emit("trainCategoryIdData",this.formData.trainCategoryIds);
            },
            changeCheckBox(){
                //选择多选框
                this.$emit("trainCategoryIdData",this.formData.trainCategoryIds);
                let arr=[];
                    for(let key in this.checkObj){
                    if(this.checkObj[key].length>0){
                        this.checkObj[key].map((element)=>{
                            console.log(element.id)
                            console.log(this.formData.trainCategoryIds)
                        if(this.formData.trainCategoryIds.indexOf(element.id)>-1){
                            arr.push(element)
                        }
                    })
                    }
                }
                this.$emit("trainCategoryIdElementData",arr);
            },
            submit(callback){
                //提交时调用
                if(this.radio){
                    let formData=clone(this.formData);
                    formData.trainCategoryId=formData.trainCategoryIds;
                    delete formData["trainCategoryIds"];
                     this.$refs["formData"].validate((valid,prop)=>{
                        callback(valid,formData,prop)
                    })
                }else{
                    this.$refs["formData"].validate((valid,prop)=>{
                        callback(valid,this.formData,prop)
                    })
                }
                
                
            }
        }
    }
</script>
<style lang="scss">
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
    // .el-radio-group{
    //      .el-radio{
    //         margin-right: 50px;
    //         padding-bottom:40px;
    //     }
    //      padding-bottom: 15px;
    // }
    .el-form-item__content{
        padding-top:12px;
    }
} 
</style>