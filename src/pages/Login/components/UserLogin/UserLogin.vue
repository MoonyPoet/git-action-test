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
      <!-- <div class="user-login-star-img">
          <img :src="star" alt="" >
        </div>
      
        <div class="user-login-halo-img" >
          <img :src="haloImg" alt="" style="width: 50%;">
        </div> -->
    </div>
    <div class="content-wrapper">
      <!-- <h5 class="slogan">
          欢迎使用 <br />
          <div class="slogan_span">
          动宝后台系统
          </div>
        </h5> -->
      <div class="form-container">
        <h4 class="form-title">登录</h4>
        <el-form ref="form" :model="user" label-width="0">
          <div class="form-items">
            <el-row class="form-item">
              <el-col>
                <el-form-item prop="suffix" :rules="[
                  { required: true, message: '机构不能为空'}]">
                  <div class="form-line">
                    <i class="el-icon-edit-outline input-icon"></i>
                     <SearchBar link="system/associative" placeholder="请输入机构简称" v-model="user.suffix" :pushCallback="pushCallbackFn" :searchOpt="searchOptFn" :editSearchOpt="true"></SearchBar>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="form-item">
              <el-col>
                <el-form-item prop="username" :rules="[
                  { required: true, message: '账号不能为空'}]">
                  <div class="form-line">
                    <i class="el-icon-edit-outline input-icon"></i>
                    <el-input placeholder="请输入账号或手机号" autocomplete="new-username" v-model="user.username"></el-input>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="form-item">
              <el-col>
                <el-form-item prop="password" :rules="[ { required: true, message: '密码不能为空'}]">
                  <div class="form-line">
                    <i class="el-icon-info input-icon"></i>
                    <el-input type="password" placeholder="请输入密码" autocomplete="new-password" v-model="user.password" @keyup.enter.native="submitBtn"></el-input>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
            <div style="height:10px;"></div>
            <!-- <VerificationCode v-on:code='getCode'></VerificationCode> -->
            <el-row class=form-item>
              <el-col>
                <el-form-item>
                  <el-checkbox class="checkbox" v-model="checked">记住账号和机构简称</el-checkbox>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="form-item">
              <el-button type="primary" class="submit-btn" size="small" @click="submitBtn">
                登 录
              </el-button>
            </el-row>
          </div>
          <!-- <el-row class="tips">
              <a href="/" class="link">
                立即注册
              </a>
              <span class="line">|</span>
              <a href="/" class="link">
                忘记密码
              </a>
            </el-row> -->
        </el-form>
      </div>
    </div>
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
    getRouterArr
  } from "assets/js/reused";
  import logo from "assets/img/logo.png";
  import background from "assets/img/background.png";
  import SearchBar from "common/SearchBar";
  const backgroundImage =
    "https://img.alicdn.com/tfs/TB1zsNhXTtYBeNjy1XdXXXXyVXa-2252-1500.png";
  export default {
    components: {
      BasicContainer,
      SearchBar
    },
    mixins:[systemSearch],
    name: "UserLogin",
    data() {
      return {
        logoImg: logo,
        background: background,
        backgroundImage,
        user: {
          suffix: "",
          username: "",
          password: ""
        },
        checked: false,
        code: false,
        rules: {
          suffix: [{
            required: true,
            message: this.$t("form.required"),
            trigger: "blur"
          }],
          username: [{
            required: true,
            message: this.$t("form.required"),
            trigger: "blur"
          }],
          password: [{
            required: true,
            message: this.$t("form.required"),
            trigger: "blur"
          }]
        }
      };
    },
    created() {
      if (
        this.$route.query.suffix &&
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
      }else if(this.$route.query.suffix){
        this.user.suffix=this.$route.query.suffix;
      }
    },
     mounted() {
      const getUserName = async() => {
        let userName = await getCleanCacheData({
          action: "local",
          keyword: "userName"
        });
        let suffix = await getCleanCacheData({
          action: "local",
          keyword: "suffix"
        });
        if (userName) {
          this.user.username = userName;
          this.checked = true;
        }
        if (suffix) {
          this.user.suffix = suffix;
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
      searchOptFn(v){
          return {"keyword":"institution","instNameSuffixLike":v}
      },
      submitBtn() {
        this.$refs.form.validate(valid => {
          //机构id,因为后端有过滤器
          if (valid) {
            this.$axios.post({
              url: baseURL + "member/login",
              isDebounce: true,
              data: {
                suffix: this.user.suffix,
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
        this.$message({
          message: res.message,
          type: "success"
        });
        //存储视频图片上传机构后缀
        setCookie("suffix", this.user.suffix);
        //清空顶部tab
        this.$store.commit("clearOption");
        //登录成功记住账号和机构
        setCookie("insId", res.data.institutionId);
        if (this.checked) {
          this.$store.commit(
            "setRecordUserName",
            setLocal("userName", this.user.username)
          );
          setLocal("suffix", this.user.suffix);
        } else {
          this.$store.commit("setRecordUserName", setLocal("userName", ""));
          setLocal("suffix", "");
        }
        setCookie("baseInfo", res.data);
        this.$store.commit("setBaseInfo", res.data);
        this.$router.push({
          path: "/index"
        });
        // this.getMemberInfo({
        //   memberId: res.data.memberId
        // }).then(member => {
        //   if (member.auths.length == 0) {
        //     this.$alert("该用户无权限，无法登陆", "错误提示", {
        //       confirmButtonText: "确定"
        //     });
        //   } else {
        //     setLocal("auths", member.auths);
        //     setLocal("authTabs", member.authTabs);
        //     setLocal("authArr", getFourRoleArr());
        //     setLocal("routerArr", getRouterArr());
        //     this.$store.commit("setAuthData", member.auths);
        //     this.$router.push({
        //       path: "/index"
        //     });
        //   }
        // });
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
  }
</style>
