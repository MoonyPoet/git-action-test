<template>
  <div class="app-wrap">
    <!-- 此处放置el-tabs代码 -->
    <!-- <router-view/> -->
    <div class="content-wrap">
      <!-- 面包屑 -->
      <!-- <div style="height:40px;" class="conten-dd" v-if="parentArr.length>0&&!isHasChild">
        <el-tabs type="border-card" style="border:0px;box-shadow:0 0 0 0 #ffff" v-model="routerName" @tab-click="routUrl(routerName)">
          <el-tab-pane v-for="item in parentArr" :key="item.path" :name="item.path">
            <span slot="label">{{item.name}}</span>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div v-else-if="isHasChild">
        <BreadCrumb></BreadCrumb>
      </div> -->
      <!-- <keep-alive :exclude="exCache">
                    <router-view/>
                </keep-alive> -->
      <div class="content_table">
        <!-- <router-view /> -->
        <!-- <router-tab :tabs="tabs" :alive-id="route => route.fullPath.replace(route.hash, '')"/> -->
        <TabPages></TabPages>
      </div>
       <el-dialog
        :title="$t('editPassword.title')"
        ref="dialog"
        center
        :visible.sync="dialogVisible"
        width="20%"
        :before-close="handleClose">
        <el-form :model="formData" :rules="rules" size="medium" ref="formData" label-width="100px" label-position="left" class="demo-ruleForm" :validate-on-rule-change="false">
          <el-form-item :label="$t('editPassword.oldPasswordLabel')" ref="oldPassword" prop="oldPassword" >
              <el-input type="password" v-model="formData.oldPassword" autocomplete="new-oldPassword" show-password :placeholder="$t('editPassword.oldPassword')"></el-input>
          </el-form-item>
          <el-form-item :label="$t('editPassword.passwordLabel')" ref="password" prop="password">
            <el-input type="password" v-model="formData.password" autocomplete="new-password" show-password :placeholder="$t('editPassword.password')"></el-input>
          </el-form-item>
          <el-form-item :label="$t('editPassword.rePasswordLabel')" ref="rePassword" prop="rePassword">
            <el-input  type="password" v-model="formData.rePassword" autocomplete="new-rePassword" show-password :placeholder="$t('editPassword.rePassword')"></el-input>
          </el-form-item>
          <div class="text_center">{{$t('editPassword.msg')}}</div>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleClose">{{$t('form.cancel')}}</el-button>
          <el-button type="primary" @click="submitForm">{{$t('form.confirm')}}</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { deDuplication, getLocal,watchObj,resetObj,clone,validateForm } from "assets/js/reused";
import BreadCrumb from "common/BreadCrumb";
import RouterTab from "common/Tabs";
import Vue from 'vue';
import {dialog,logout} from "./store";
import {validatePassword} from "assets/js/vuelidate";
// Vue.use(RouterTab);
import TabPages from "common/TabPages";
export default {
  components:{
    BreadCrumb,
    TabPages
  },
  data() {
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.formData.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    }; 
    return {
      btnIsShow: true,
      parentArr: [],
      routerName: "",
      authTabs: [],
      isHasChild:false,
      dialogVisible:false,
      formData:{
        password:"",
        rePassword:"",
        oldPassword:""
      },
      rules:{
        oldPassword: [{
          required: true,
          message: this.$t("form.required"),
          trigger: "blur"
        },{
          validator:validatePassword
        }],
        password: [{
          required: true,
          message: this.$t("form.required"),
          trigger: "blur"
        },{
          validator:validatePassword
        }],
        rePassword: [{
          required:true,
          message:this.$t("form.required"),
          trigger:"blur"
        },
        {
          validator:validatePassword
        },
        {
          validator:validatePass2
        }
        ]
      },
      tabs:[{ to: '/index',closable: false }]
    };
  },
  mounted() {
     watchObj({ 
        obj:dialog, 
        prop:"isOpenDialog",
        isDefault:false,
        callback:(v)=>{
         if(v){
           this.editPassword()
         }
      }})
  },
  methods:{
      editPassword(){
        this.dialogVisible=true;
        resetObj(this.formData);
      },
      handleClose(){
        this.dialogVisible=false;
        dialog.closeDialog();
      },
      submitForm(){
        let formData=clone(this.formData);
        validateForm({
          form: this.$refs["formData"],
          formData: formData,
          url: "operator/charge_password",
          success:(res)=>{
            this.$message({
              message: res.message||"操作成功",
              type: 'success'
            });
            this.handleClose();
            logout.setLogot();
          }
        });
    },
  }
};
</script>
<style lang="scss">
.filterHeader{
  padding-bottom: 15px  ;
}
.app-wrap {
  flex: 1;
  min-width: 1190px;
  // overflow: auto;
  & > .template-tabs > .el-tabs > .el-tabs__content {
    padding: 0px 0;
    // box-shadow: 0px 4px 5px 5px #ccccccc9;
  }
  .el-tabs--border-card > .el-tabs__header .el-tabs__item.is-active {
    color: #409eff;
    background-color: #fff;
    // border-bottom: 1px solid #d9dadd;
  }

  .template-tabs {
    position: fixed;
    width: 100%;
    z-index: 4;
    top: 65px;
  }
  // .el-tabs--border-card,
  & > .template-tabs > .el-tabs--border-card,
  & > .template-tabs > .el-tabs__header,
  & > .template-tabs > .el-tabs__nav-wrap {
    width: calc(1920px - 341px);
  }
  @media screen and (max-width: 1919px) {
    & > .template-tabs > .el-tabs--border-card,
    & > .template-tabs > .el-tabs__header,
    & > .template-tabs > .el-tabs__nav-wrap {
      width: calc(1920px - 750px);
    }
  }
  @media screen and (max-width: 1366px) {
    & > .template-tabs > .el-tabs--border-card,
    & > .template-tabs > .el-tabs__header,
    & > .template-tabs > .el-tabs__nav-wrap {
      width: calc(1920px - 800px);
    }
  }
  @media screen and (max-width: 1000px) {
    & > .template-tabs > .el-tabs--border-card,
    & > .template-tabs > .el-tabs__header,
    & > .template-tabs > .el-tabs__nav-wrap {
      width: 630px;
    }
  }
  .el-tabs__nav-next,
  .el-tabs__nav-prev {
    position: absolute;
    cursor: pointer;
    line-height: 38px;
    font-size: 12px;
    color: #909399;
  }
  & > .template-tabs > .el-tabs--border-card {
    height: 39px;
    float: left;
  }
  & > .template-tabs {
    // box-shadow: 0px 4px 5px 5px #ccccccc9;
    background: #f5f7fa;
  }
  .return {
    float: left;
    height: 39px;
    border: none;
    color: #909399;
    background: #f5f7fa;
    border-bottom: 1px solid #e4e7ed;
    cursor: pointer;
    border-left: 1px solid #e4e7ed;
  }
  .reload {
    float: left;
    height: 39px;
    border: none;
    color: #909399;
    background: #f5f7fa;
    border-bottom: 1px solid #e4e7ed;
    border-left: 1px solid #e4e7ed;
    cursor: pointer;
    border-right: 1px solid #e4e7ed;
  }
  .content-wrap {
    // width: 98%;
    margin: auto;
    // margin-top: 1%;
    border-top: none;
    .content_table {
      background: #fff;
    }
    .conten-dd > .el-tabs--border-card > .el-tabs__content {
      padding: 0px 0;
    }
    .el-tabs__nav-scroll {
      // padding: 1px;
      background: #f3f3f3;
      // margin-bottom: 1px;
    }
    .conten-dd > .el-tabs--border-card > .el-tabs__header .el-tabs__item {
      background: #fff;
      margin: 0px 0px;
      border: 2px solid #f3f3f3;
      box-sizing:border-box;
      border-left: 0px;
      font-weight: 500;
    }
    .conten-dd
      > .el-tabs--border-card
      > .el-tabs__header
      .el-tabs__item.is-active {
      color: #409EFF;
      border-bottom: 2px solid #fff;
      font-weight: 700;
    }
  }
}
</style>
