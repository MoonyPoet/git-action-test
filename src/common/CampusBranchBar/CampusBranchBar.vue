<template lang='html'>
    <div class='campusbranchbar'>
        <el-form :model="formData" :rules="rules" size="medium" ref="formData" label-width="200px" label-position="left" class="demo-ruleForm">
                 <el-form-item label="城市" prop="provinceNum" ref="provinceNum">
                    <div v-if="cityOptions.length>1">
                        <div v-if="isSelect||provinceSelect">
                            <el-select v-model="formData.provinceNum" placeholder="请选择" @change="handleChangeSelect1">
                                <el-option
                                v-for="item in cityOptions"
                                :key="item.provinceNum"
                                :label="item.label"
                                :value="item.provinceNum">
                                </el-option>
                            </el-select>
                        </div>
                        <div v-else>
                            <el-checkbox :indeterminate="isIndeterminate" :disabled="disabled" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
                            <el-checkbox-group v-model="formData.provinceNum" :disabled="disabled" @change="handleCheckedCitiesChange">
                                <el-checkbox v-for="item in cityOptions" :label="item.provinceNum" :key="item.id">{{item.label}}</el-checkbox>
                            </el-checkbox-group>
                        </div>
                    </div>
                    <div v-else>
                        {{cityOptions[0]&&cityOptions[0]["label"]}}
                    </div>
                 </el-form-item>
                <el-form-item label="校区/分馆" ref="campusIds" prop="campusIds" v-show="campusBranchOptions.length>0">
                    <div v-if="campusBranchOptions.length>1">
                        <div v-if="isSelect">
                             <el-select v-model="formData.campusIds" placeholder="请选择" @change="handleChangeSelect2">
                                <el-option
                                v-for="item in campusBranchOptions"
                                :key="item.id"
                                :label="item.label"
                                :value="item.id">
                                </el-option>
                            </el-select>
                        </div>
                        <div v-else>
                            <el-checkbox :indeterminate="isIndeterminate1" :disabled="disabled" v-model="checkAll1" @change="handleCheckAllChange1">全选</el-checkbox>
                            <el-checkbox-group v-model="formData.campusIds" :disabled="disabled" @change="handleCheckedCampusBranchChange">
                                <el-checkbox v-for="item in campusBranchOptions" :label="item.id" :key="item.id">{{item.label}}</el-checkbox>
                            </el-checkbox-group>
                        </div>
                    </div>
                    <div v-else>
                        {{campusBranchOptions[0]&&campusBranchOptions[0].label}}
                    </div>
                </el-form-item>
        </el-form>
    </div>
</template>
<script>
    //员工管理,常规班排期，学员在使用,卡种设置//该组件目前城市分馆为下拉框可以使用，为多选框,尤其是编辑的时候弃用
    import {isEmpty,type} from "assets/js/reused";
     export default {
        name: '',
        props:{
            campusAreaTotalList:{//所有城市校区数据
                type:Array,
                default:()=>{
                    return []
                }
            },
            campusAreaListData:Array,//选中默认项
            isSelect:Boolean, //城市和分馆都为下拉框
            disabled:{
                type:Boolean,
                default:false
            },
            provinceSelect:{ //城市为下拉框
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
            },
            isInit:{
                type:Boolean,
                default:true
            }//默认调用接口
            //initGetCampusData初始化触发其他相关的,为false不进行触发
        },
        data () {
            return {
                cityOptions:[],
                isIndeterminate: false,
                isIndeterminate1:false,
                campusBranchOptions:[],
                campusAreaList:"",
                checkAll: false,
                checkAll1:false,
                editStatus:1,//1为默认状态,2为编辑后状态
                options: [],
                value:"",
                selectCampusIds:"",
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
            isSelect(newV,oldV){
                console.log("===")
                console.log(newV)
                if(newV&&isInit){
                    this.formData={
                        provinceNum:"",
                        campusIds:""
                    };
                    this.formData.provinceNum=this.cityOptions[0].provinceNum;
                }
            },
            provinceSelect(newV,oldV){
                 if(newV&&isInit){
                    console.log(newV)
                    this.formData={
                        provinceNum:"",
                        campusIds:[]
                    };
                    this.formData.provinceNum=this.cityOptions[0].provinceNum;
                }
            },
            campusAreaListData(newV,oldV){
                if(isEmpty(newV)){
                    if(this.isSelect&&this.isInit===false){
                        this.campusAreaTotalList.forEach((element)=>{
                            this.cityOptions.push({
                                label:element.provinceName,
                                provinceNum:element.provinceNum,
                                value:element.provinceNum,
                            })
                        })
                        this.campusAreaList=this.campusAreaTotalList;
                        this.formData.provinceNum=this.campusAreaTotalList[0].provinceNum;
                        this.getCampusBranchData2(this.formData.provinceNum).then(()=>{
                            this.formData.campusIds="";
                            this.formData.campusIds=this.campusAreaTotalList[0].campuses[0].campusId;
                        })
                    }
                    return
                }
                this.editStatus=2;
                //针对不同的数据类型做处理
                //初始数据获得
                if(this.provinceSelect||this.isSelect){
                    //绑定值
                    this.formData.provinceNum=newV[0].provinceNum;
                    if(this.provinceSelect){
                        this.formData.campusIds=[];
                         newV.forEach((element)=>{
                            if(element.campuses!=null){
                                element.campuses.forEach((a)=>{
                                    this.formData.campusIds.push(a.campusId)
                                })
                            }
                        })
                    }else{
                         if(this.editStatus==2){
                            if(this.isInit){
                                 this.getCampusBranchData(this.formData.provinceNum).then(()=>{
                                    this.formData.campusIds="";
                                    this.formData.campusIds=newV[0].campuses[0].campusId;
                                })
                            }else{
                                console.log(this.campusAreaTotalList)
                                this.campusAreaList=this.campusAreaTotalList;
                                this.campusAreaTotalList.forEach((element)=>{
                                    this.cityOptions.push({
                                        label:element.provinceName,
                                        provinceNum:element.provinceNum,
                                        value:element.provinceNum,
                                    })
                                })
                                this.getCampusBranchData2(this.formData.provinceNum).then(()=>{
                                    this.formData.campusIds="";
                                    this.formData.campusIds=newV[0].campuses[0].campusId;
                                })
                            }
                        }
                    }
                }else{
                    console.log(this.formData.campusIds)
                    console.log(this.formData.provinceNum)
                    // this.formData.provinceNum=[];
                    // this.campusAreaList=newV;
                    // this.formData.campusIds=[];
                    // 单个城市默认的校区绑定
                    if(type(this.formData.campusIds)=="array"){
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
                    }
                }
               
                // this.getCampusBranchData(this.formData.provinceNum);
                //修改页默认判断城市全选
                if(this.isInit){
                    this.handleCheckedCitiesChange1(this.formData.provinceNum);
                }
                // this.$emit("campusIds",{campusIds:this.formData.campusIds})
            }
        },
        created(){
            if(this.isInit){
                this.init()
            }
            // this.campusAreaList=formData.campusAreaList;
        },
        methods:{
            log(v){
                console.log(v)
            },
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
                    if(this.campusBranchOptions.length==1){
                        this.formData.campusIds=this.campusBranchOptions[0].id;
                        if(this.initGetCampusData){
                            if(this.isSelect){
                                this.$emit("campusId",{campusId:this.formData.campusIds});
                            }else{
                                this.$emit("campusIds",{campusIds:this.formData.campusIds})
                            }
                        }
                        
                    }else if(this.campusBranchOptions.length>1){
                        if(this.initGetCampusData){
                            if(this.isSelect){
                                this.formData.campusIds=this.campusBranchOptions[0].id;
                                this.$emit("campusId",{campusId:this.formData.campusIds}); 
                            }else{
                                this.handleCheckedCampusBranchChange(this.formData.campusIds)
                            }
                        }
                    }
                    resolve()
                })
            },
            getCampusBranchData2(id){
                //修改时isInit等于false时不$emit
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
                    if(this.campusBranchOptions.length==1){
                        this.formData.campusIds=this.campusBranchOptions[0].id;
                        if(this.initGetCampusData){
                            
                        }
                        
                    }else if(this.campusBranchOptions.length>1){
                        if(this.initGetCampusData){
                            if(this.isSelect){
                                this.formData.campusIds=this.campusBranchOptions[0].id;
                            }else{
                                this.handleCheckedCampusBranchChange1(this.formData.campusIds)
                            }
                        }
                    }
                    resolve()
                })
            },
            getCampusBranchData(id){
                //跟进城市id获得校区
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
                        if(this.initGetCampusData){
                            if(this.isSelect){
                                this.$emit("campusId",{campusId:this.formData.campusIds});
                            }else{
                                this.$emit("campusIds",{campusIds:this.formData.campusIds})
                            }
                        }
                    }else if(this.campusBranchOptions.length>1){
                        if(this.initGetCampusData){
                            if(this.isSelect){
                                this.formData.campusIds=this.campusBranchOptions[0].id;
                                this.$emit("campusId",{campusId:this.formData.campusIds}); 
                            }
                        }
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
                  this.campusAreaList="",
                  this.checkAll= false,
                  this.checkAll1=false,
                  this.editStatus=1,//1为默认状态,2为编辑后状态
                  this.options= [],
                  this.value="",
                  this.selectCampusIds="",
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