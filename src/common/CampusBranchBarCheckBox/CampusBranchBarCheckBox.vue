<template lang='html'>
    <div class='campusbranchbar'>
        <el-form :model="formData" :rules="rules" size="medium" ref="formData" label-width="200px" label-position="left" class="demo-ruleForm">
                 <el-form-item label="城市" prop="provinceNum" ref="provinceNum">
                    <div v-if="cityOptions.length>0">
                         <div v-if="cityOptions.length>1">
                            <el-checkbox :indeterminate="isIndeterminate" :disabled="disabled" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
                            <el-checkbox-group v-model="formData.provinceNum" :disabled="disabled" @change="handleCheckedCitiesChange">
                                <el-checkbox v-for="item in cityOptions" :label="item.provinceNum" :key="item.id">{{item.label}}</el-checkbox>
                            </el-checkbox-group>
                        </div>
                        <div v-else>
                            {{cityOptions[0]&&cityOptions[0]["label"]}}
                        </div>
                    </div>
                   <div v-else>
                       暂无城市数据
                   </div>
                 </el-form-item>
                <el-form-item label="校区/分馆" ref="campusIds" prop="campusIds">
                    <div v-if="campusBranchOptions.length>0">
                         <div v-if="campusBranchOptions.length>1">
                            <el-checkbox :indeterminate="isIndeterminate1" :disabled="disabled" v-model="checkAll1" @change="handleCheckAllChange1">全选</el-checkbox>
                                <el-checkbox-group v-model="formData.campusIds" :disabled="disabled" @change="handleCheckedCampusBranchChange">
                                    <el-checkbox v-for="item in campusBranchOptions" :label="item.id" :key="item.id">{{item.label}}</el-checkbox>
                                </el-checkbox-group>
                        </div>
                        <div v-else>
                            {{campusBranchOptions[0]&&campusBranchOptions[0].label}}
                        </div>
                    </div>
                    <div v-else>
                        该城市暂无校区
                    </div>
                </el-form-item>
        </el-form>
    </div>
</template>
<script>
   //学员卡设置目前在使用
    import {isEmpty,type} from "assets/js/reused";
     export default {
        name: 'CampusBranchBarCheckBox',
        props:{
            campusAreaTotalList:{//所有城市校区数据
                type:Array,
                default:()=>{
                    return []
                }
            },
            campusAreaListData:{
                type:Array,
                default:()=>{
                    return []
                }
            },//选中默认项
            disabled:{
                type:Boolean,
                default:false
            },
            isAll:{
                type:Number,
                default:0
            },//isAll为默认1查全部,为0按权限分
            initGetCampusData:{
                type:Boolean,
                default:true
            }, //initGetCampusData初始化触发其他相关的,为false不进行触发
            isInit:{
                type:Boolean,
                default:true
            }//默认调用接口
        },
        data () {
            return {
                cityOptions:[],
                isIndeterminate: false,
                isIndeterminate1:false,
                campusBranchOptions:[],
                campusAreaList:[],
                checkAll: false,
                checkAll1:false,
                editStatus:1,//1为默认状态,2为编辑后状态
                options: [],
                value:"",
                formData:{
                    provinceNum:[],
                    campusIds:[],
                },
                rules:{
                    provinceNum:[
                            { required: true, message: this.$t('form.required'), trigger: 'change' },
                        ],
                    campusIds:[
                            { required: true, message: this.$t('form.required'), trigger: 'change' },
                        ]
                }
            }
        },
        watch:{
            campusAreaListData(newV,oldV){
               //城市所有项
                this.campusAreaTotalList.forEach((element)=>{
                    this.cityOptions.push({
                        label:element.provinceName,
                        provinceNum:element.provinceNum,
                        value:element.provinceNum,
                    })
                })
                //城市绑定默认项
                this.formData.provinceNum=[];
                newV.forEach((element)=>{
                    if(typeof(element.provinceNum)=="string"&&!isEmpty(element.provinceNum)){
                        this.formData.provinceNum.push(element.provinceNum)
                    }
                    if(element.campuses!=null){
                        element.campuses.forEach((a)=>{
                            this.formData.campusIds.push(a.campusId)
                        })
                    }
                })
                this.campusAreaList=this.campusAreaTotalList;
                this.handleCheckedCitiesChange1(this.formData.provinceNum)
                this.getCampusBranchData1(this.formData.provinceNum)
            }
        },
        created(){
            if(this.isInit){
                this.init()
            }
            // this.campusAreaList=formData.campusAreaList;
        },
        methods:{
            init(){
                //初始化
                if(this.cityOptions.length==0){
                    this.getAddress().then(res=>{
                        if(res.data.length!=0){
                            res.data.forEach(element => {
                                // console.log(element)
                                this.cityOptions.push({
                                    label:element.provinceName,
                                    provinceNum:element.provinceNum,
                                    value:element.provinceNum,
                                })
                                
                            });
                            this.campusAreaList=res.data;
                            if(this.isSelect&&this.cityOptions.length>0||this.provinceSelect&&this.cityOptions.length>0){
                                this.formData.provinceNum=this.cityOptions[0].provinceNum;
                                if(this.editStatus==1){
                                    this.getCampusBranchData(this.formData.provinceNum)
                                }
                            }else if(this.cityOptions.length==1){
                                this.formData.provinceNum=this.cityOptions[0].provinceNum;
                                this.getCampusBranchData(this.formData.provinceNum)
                            }
                        }
                    })
                }
            },
            handleChangeSelect1(val){
                 this.getCampusBranchData(this.formData.provinceNum)
                 this.$emit("provinceNum",this.formData.provinceNum)
            },
            clear(){
                //获得校区分馆data
                //重置校区/分馆状态
                this.campusBranchOptions=[];
                if(this.provinceSelect){
                    this.formData.campusIds=[];
                }
                else if(this.isSelect){
                    this.formData.campusIds="";
                }
                this.checkAll1=false;
                this.isIndeterminate1=false;
                this.$refs["campusIds"]&&this.$refs["campusIds"].clearValidate();
            },
            handleChangeSelect2(val){
                //选择分馆
                this.$emit("campusId",{campusId:val})
            },
            getCampusBranchData1(id){
                //修改时
                this.campusBranchOptions=[];
                return new Promise((resolve,reject)=>{
                    this.campusAreaList.forEach((element)=>{
                        if(id.indexOf(element.provinceNum)>-1){
                            element.campuses.forEach((a)=>{
                                this.campusBranchOptions.push({
                                    label:a.campusName,
                                    id:a.campusId
                                })
                            })
                        }
                    })
                    //根据校区/分馆数量判断
                    if(this.campusBranchOptions.length==1){
                        this.formData.campusIds=this.campusBranchOptions[0].id;
                    }else if(this.campusBranchOptions.length>1){
                        this.handleCheckedCampusBranchChange1(this.formData.campusIds)
                    }
                    resolve()
                })
            },
            getCampusBranchData(id){
                //跟据城市id获得校区
                return new Promise((resolve,reject)=>{
                    this.clear();
                    this.campusAreaList.forEach((element)=>{
                        if(id.indexOf(element.provinceNum)>-1){
                            element.campuses.forEach((a)=>{
                                this.campusBranchOptions.push({
                                    label:a.campusName,
                                    id:a.campusId
                                })
                            })
                        }
                    })
                    if(this.campusBranchOptions.length==1){
                        this.formData.campusIds=this.campusBranchOptions[0].id;
                        this.$emit("campusIds",{campusIds:this.formData.campusIds})
                    }else if(this.campusBranchOptions.length>1){
                        this.$emit("campusIds",{campusIds:this.formData.campusIds})
                    }
                    resolve()
                })
            },
            getAddress(){
                //获得城市
                return new Promise((resolve, reject) => {
                    this.$axios.post({
                    url:baseURL+"common/findarea",
                    data:{
                        isAll:this.isAll
                    },
                    success:(res)=>{
                        resolve(res);
                    }
                    })
                });
            },
            handleCheckAllChange(val) {
                //全选
                if(val){
                    this.formData.campusIds=[];
                    this.cityOptions.forEach(element=>{
                        this.formData.provinceNum.push(element.provinceNum)
                    })
                    this.getCampusBranchData(this.formData.provinceNum)
                }else{
                     this.formData.provinceNum = [];
                     this.campusBranchOptions=[];
                     this.formData.campusIds=[];
                     this.checkAll1=false;
                }
                this.isIndeterminate = false;
            },
            handleCheckedCitiesChange1(value) {
                //修改页默认判断城市全选
                let checkedCount = value.length;
                this.checkAll = checkedCount === this.cityOptions.length;
                this.isIndeterminate = checkedCount > 0 && checkedCount < this.cityOptions.length;
                if(this.formData.provinceNum.length>0){
                    
                }else{
                    this.campusBranchOptions=[];
                }
            },
            handleCheckedCitiesChange(value) {
                this.formData.campusIds=[];
                let checkedCount = value.length;
                this.checkAll = checkedCount === this.cityOptions.length;
                this.isIndeterminate = checkedCount > 0 && checkedCount < this.cityOptions.length;
                if(this.formData.provinceNum.length>0){
                    this.getCampusBranchData(this.formData.provinceNum)
                }else{
                    this.campusBranchOptions=[];
                    //选择城市时,即使城市一个也不选,也要触发
                    this.$emit("campusIds",{campusIds:""})
                }
            },
            handleCheckAllChange1(val) {
                this.formData.campusIds=[];
                if(val){
                    this.campusBranchOptions.forEach(element=>{
                    this.formData.campusIds.push(element.id)
                 })
                }else{
                     this.formData.campusIds = [];
                }
                this.$emit("campusIds",{campusIds:this.formData.campusIds})
                this.isIndeterminate1 = false;
            },
            handleCheckedCampusBranchChange1(value) {
                //编辑时isInit等于false不$emit
                let checkedCount = value.length;
                this.checkAll1 = checkedCount === this.campusBranchOptions.length;
                this.isIndeterminate1 = checkedCount > 0 && checkedCount < this.campusBranchOptions.length;
            },
            handleCheckedCampusBranchChange(value) {
                let checkedCount = value.length;
                this.checkAll1 = checkedCount === this.campusBranchOptions.length;
                this.isIndeterminate1 = checkedCount > 0 && checkedCount < this.campusBranchOptions.length;
                this.$emit("campusIds",{campusIds:this.formData.campusIds})
            },
            submit(callback){
                //提交时调用
                if(this.isSelect){
                     this.$refs["formData"].validate((valid,prop)=>{
                        callback(valid,{campusId:this.formData.campusIds},prop)
                    })
                }else{
                     this.$refs["formData"].validate((valid,prop)=>{
                        callback(valid,{campusIds:this.formData.campusIds},prop)
                    })
                }
            },
            reset(){
                this.cityOptions=[],
                  this.isIndeterminate= false,
                  this.isIndeterminate1=false,
                  this.campusBranchOptions=[],
                  this.campusAreaList=[],
                  this.checkAll= false,
                  this.checkAll1=false,
                  this.editStatus=1,//1为默认状态,2为编辑后状态
                  this.options= [],
                  this.value="",
                //重置组件
                this.formData={
                    provinceNum:[],
                    campusIds:[]
                }
                this.init()
            }
        }
    }
</script>
<style lang="scss" scoped>
.campusbranchbar{
     .el-checkbox+.el-checkbox{
        margin: 0;
        margin-right: 50px;
    }
    .el-checkbox{
        margin-right: 50px;
    }
}
</style>