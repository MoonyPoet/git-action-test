<template lang='html'>
    <Dialog ref="dialog" :title="tchrType===0?$t('class.addHeadCoach'):$t('class.addSecondaryCoach')" width="580px" :isShowFooter="false">
       <div slot="content">
           <el-row class="pb_10">
                <el-col :span="21"><el-input class="search_input" v-model="formData.memberName" @keyup.enter.native="search" :placeholder="$t('class.coachInput')"></el-input></el-col>
                <el-col :span="3"><el-button class="search_btn"  type="primary" @click="search">{{$t("components.search")}}</el-button></el-col>
            </el-row>
            <ul>
                <li class="text_center mb_10" v-for="item in memberData" :key="item.id" @click="coachClick(item.value)">
                    <div class="mb_10"><ImageBar :load="item.headImg" :fail='coachImg' width="45" class="coach_avatar"></ImageBar></div>
                    <div class="text_over">{{item.display}}</div>
                </li>
            </ul>
       </div>
    </Dialog>
</template>
<script>
    import {
    getCookie,
    debounce,
    deleteForArr,
    selectDefaultData,
    isEmpty,
    getCode,
    validateForm,
    getCodeDisplay,
    resetObj,
    getAsso
  } from "assets/js/reused";
    import RadioOpt from "common/RadioOpt";
    import Dialog from "common/Dialog";
    import coachImg from "assets/img/student.png"
    import ImageBar from "common/ImageBar";
     export default {
        name: 'hourStudent',
        components:{
            RadioOpt,
            Dialog,
            ImageBar
        },
        data () {
            return{
                coachImg:coachImg,
                formData:{
                   memberName:null,
                },
                memberData:[],
                campusId:null,
                memberIds:null,
                tchrType:null,//老师类型(0主教，1助教)
                rules:{
                    opType:[{
                        required: true,
                        message: this.$t('form.required'),
                        trigger: "blur"
                    }],
                    score:[{
                        required: true,
                        message: this.$t('form.required'),
                        trigger: "blur"
                    }],
                    remark:[{
                        required: true,
                        message: this.$t('form.required'),
                        trigger: "blur"
                    }]
                },
            }
        },
        methods:{
            open(tchrType,campusId,memberIds){
                this.tchrType=tchrType;
                this.campusId=campusId;
                this.memberIds=memberIds;
                this.memberData=[];
                resetObj(this.formData)
                this.$refs.dialog.show()
            },
            async search(){
                if(this.formData.memberName){
                   this.memberData=await this.find(this.formData.memberName)
                }
            },
            async find(memberName){
              return await getAsso({
                   keyword:"coach",
                   campusIdFind:this.campusId,
                   assVal:memberName,
                   unMemberIds:this.memberIds.toString()
            })
            },
            coachClick(id){
                this.submit(id)
            },
            submit(id){
                let formData={};
                formData.tchrType=this.tchrType;
                formData.memberId=id;
                formData.clasId=this.$route.query.clasId;
                this.$axios.post({
                    url:baseURL+"clas/clas_time_tchr_add",
                    data:formData,
                    success:(res)=>{
                        this.$message({
                            message:res.message,
                            type: 'success'
                        })
                        this.$refs.dialog.close()
                        this.$emit("isSubmit",true)
                    }
                })
            }
        }
    }
</script>
<style lang="scss" scoped>
ul li{
    width: 10%;
    display: inline-block;
    img{
        width: 60px;
    }
}
.search_input{
    /deep/.el-input__inner{
         border-radius: 5px 0px 0px 5px;
    }
}
.search_btn{
    border-left: 0;
    border-radius: 0px 5px 5px 0px;
}
</style>