/*
 * @Author: xcsweb 
 * @Date: 2018-06-21 09:46:22 
 * @Last Modified by: xcsweb
 * @Last Modified time: 2018-07-12 13:47:56
 */
<template>
  <div class="user-login">
    <div class="user-login-bg" style="background-color:#c0d5e2">
      <img :src="background" class="backgroundImg">
      <div class="user-login-logo-img">
        <img :src="logoImg" alt="">
      </div>
    </div>
    <div class="lang">
      <!-- <span :class="{blue:lang==='cn'}" @click="switchLang('cn')">中</span>/<span :class="{blue:lang==='en'}" @click="switchLang('en')">En</span> -->
    </div>
    <div class="content-wrapper">
      <div class="form-container">
        <h4 class="form-title">{{ $t('login.signIn')}}</h4>
        <el-form ref="form" :model="user" :rules="rules" label-width="0">
          <div class="form-items">
            <!-- <el-row class="form-item">
              <el-col>
                <el-form-item prop="insId">
                  <div class="form-line">
                    <i class="el-icon-edit-outline input-icon"></i>
                     <SearchBar link="system/associative" :placeholder="$t('login.suffix')" :title="$t('login.suffix')" v-model="user.insId" :nameLike.sync="user.merchantName" :pushCallback="pushCallbackFn" :searchOpt="searchOptFn" :editSearchOpt="true"></SearchBar>
                  </div>
                </el-form-item>
              </el-col>
            </el-row> -->
            <el-row class="form-item">
              <el-col>
                <el-form-item prop="username">
                  <div class="form-line">
                    <i class="el-icon-edit-outline input-icon"></i>
                    <el-input :placeholder="$t('login.username')" :title="$t('login.username')" autocomplete="new-username" v-model="user.username"></el-input>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="form-item">
              <el-col>
                <el-form-item prop="password">
                  <div class="form-line">
                    <i class="el-icon-info input-icon"></i>
                    <el-input type="password" :placeholder="$t('login.password')" :title="$t('login.username')" autocomplete="new-password" v-model="user.password" @keyup.enter.native="submitBtn"></el-input>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
            <div style="height:10px;"></div>
            <!-- <VerificationCode v-on:code='getCode'></VerificationCode> -->
            <el-row class="form-item">
              <el-col>
                <el-form-item>
                  <el-checkbox class="checkbox" v-model="checked">{{$t('login.remember')}}</el-checkbox>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="form-item">
              <el-button type="primary" class="submit-btn" size="small" @click="submitBtn">
                {{ $t('login.signIn')}}
              </el-button>
            </el-row>
          </div>
        </el-form>
      </div>
    </div>
    <Dialog ref="dialog1" width="502px" title="选择机构" @submit="submit1">
            <template slot="content">
                <el-form :model="formData" :rules="rules" size="medium" ref="formData" label-width="100px"
                         label-position="left" :validate-on-rule-change="false">
                  <el-form-item label="机构" prop="institutionId">
                    <SelectOpt v-model="formData.institutionId" ref="institutionId" :data="institutionData" val="institutionName" id="institutionId"></SelectOpt>
                  </el-form-item>
                </el-form>
            </template>
        </Dialog>
  </div>
</template>

<script>
  import BasicContainer from "@vue-materials/basic-container";
  // import VerificationCode from "common/VerificationCode";
  import {systemSearch} from "assets/js/mixin";
  import {
    setLocal,
    getLocal,
    getCleanCacheData,
    setCookie,
    getFourRoleArr,
    getParentLimit,
    getRouterArr,
    type
  } from "assets/js/reused";
  import logo from "assets/img/logo.png";
  import background from "assets/img/bg.jpg";
  import SearchBar from "common/SearchBar";
  import SelectOpt from "common/SelectOpt";
  import Dialog from "common/Dialog";
  const backgroundImage =
    "https://img.alicdn.com/tfs/TB1zsNhXTtYBeNjy1XdXXXXyVXa-2252-1500.png";
  export default {
    components: {
      BasicContainer,
      SearchBar,
      SelectOpt,
      Dialog
    },
    mixins:[systemSearch],
    name: "UserLogin",
    data() {
      return {
        logoImg: logo,
        background: background,
        backgroundImage,
        user: {
          // merchantName: "",
          // insId:null,
          username: "",
          password: ""
        },
        formData:{
          institutionId:null
        },
        institutionData:[],
        checked: false,
        code: false,
        lang:"cn"
      };
    },
    computed:{
      rules () {
        return {
           insId: [{
            required: true,
            message: this.$t('form.required'),
            trigger: "change"
          }],
          institutionId:[
            {
            required: true,
            message: this.$t('form.required'),
            trigger: "change"
          }
          ],
          username: [{
            required: true,
            message: this.$t('form.required'),
            trigger: "blur"
          }],
          password: [{
            required: true,
            message: this.$t('form.required'),
            trigger: "blur"
          }]
        }
      }
    },
    async created() {
      if(lang){
        this.lang=lang;
      }
      if (
        this.$route.query.insId &&
        this.$route.query.loginName &&
        this.$route.query.loginPwd
      ) {
        this.$axios.post({
          url: baseURL + "member/irlogin",
          isDebounce: true,
          data: {
            ...this.$route.query
          },
          success: res => {
            this.setOption(res);
          }
        });
      }else if(this.$route.query.insId){
        this.user.insId=this.$route.query.insId;
        // this.user.merchantName=getLocal("merchantName")
      }
    },
     mounted() {
      const getUserName = async() => {
        let userName = await getCleanCacheData({
          action: "local",
          keyword: "userName"
        });
        let insId = await getCleanCacheData({
          action: "cookie",
          keyword: "insId"
        });
        if (userName) {
          this.user.username = userName;
          this.checked = true;
        }
        if (insId) {
          this.user.insId = insId;
          console.log("TCL: getUserName ->   this.user.insId ",   this.user.insId )
          // this.user.merchantName=getLocal("merchantName");
        }
      };
      getUserName();
    },
    methods: {
       pushCallbackFn(element){
          return {
            value:element.display ,//显示需要的
            id: element.value
          }
      },
      switchLang(lang){
        this.lang=lang;
        window.lang=lang;
        setLocal("lang",lang);
      },
      submitBtn() {
        this.$refs.form.validate(valid => {
          //机构id,因为后端有过滤器
          if (valid) {
            this.$axios.post({
              url: baseURL + "operator/login",
              isDebounce: true,
              data: {
                institutionId: this.user.insId,
                loginName: this.user.username,
                loginPwd: this.user.password
              },
              success: res => {
                this.setOption(res);
              }
            });
          } else if (valid) {
            // this.$alert("请滑动滑块填充拼图", "错误提示", {
            //   confirmButtonText: "确定"
            // });
          }
        });
      },
      setOption(res) {
        if(type(res.data)==="object"){
           this.$message({
            message: res.message,
            type: "success"
          });
          //存储视频图片上传机构ID
          setCookie("insId", res.data.institutionId);
          //清空顶部tab
          this.$store.commit("clearOption");
          //登录成功记住账号和机构
          if (this.checked) {
            // setLocal("merchantName", this.user.merchantName)
            setLocal("userName", this.user.username)
          } else {
            // setLocal("merchantName", "")
            setLocal("userName", "")
          }
          setCookie("baseInfo", {
            token:res.data.token
          });
          this.$store.commit("setBaseInfo", res.data);
          this.$router.push({
            path: "/index"
          });
        }else{
          this.institutionData=res.data;
          this.$refs.dialog1.show()
          this.$nextTick(()=>{
            this.$refs.institutionId.selectDefaultData();
          });
        }
       
      },
      getCode(code) {
        this.code = code;
      },
      getMemberInfo(data = {}) {
        return new Promise((resolve, reject) => {
          this.$axios.post({
            url: baseURL + "member/info",
            data: {
              ...data
            },
            success: res => {
              resolve(res.data);
            }
          });
        });
      },
      submit1(){
        this.$refs["formData"].validate((valid) => {
          if (valid) {
            this.$refs.dialog1.close();
            this.user.insId=this.formData.institutionId;
            this.submitBtn()
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      }
    }
  };
</script>

<style lang="scss">
  @import "./UserLogin.scss";
  .user-login{
    .el-form-item__content {
      line-height: 42px;
    }
    .form-container{
      width: 263px;
    }
    .lang{
      position: absolute;
      right: 96px;
      top: 40px;
      font-size: 28px;
      cursor: pointer;
      .blue{
       color: #3080fe;
      }
    }
  }
</style>
