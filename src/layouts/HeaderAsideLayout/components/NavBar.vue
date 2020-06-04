<template>
  <el-menu class="navbar">
    <div class="logo">
      <router-link to="/index">
        <ImageBar
          style="float:left;width:100%;height:73%"
          :load="merchantPic"
        ></ImageBar>
        <br>
      </router-link>
    </div>
    <div class="navbar_center">
      <router-link to="/index"><span class="site-name" :title="merchantName">{{merchantName}}</span></router-link>
    </div>
    <div class="item">
      <a href="/manage/download/动宝培训管理系统用户操作手册.pdf"  target="_blank">
        <span style="color:#fff">{{$t("layouts.help")}}</span>
      </a>
    </div>
    <div class="item">
      <!-- <el-badge
        :value="0"
        :max="10"
        class="item_email"
      >
        <span style="font-size:18px;"><i class="el-icon-message"></i></span>
      </el-badge> -->
    </div>
    <div class="user-profile-container">
      <div class="user-profile-content">
        <el-dropdown trigger="click">
          <div class="user-profile-body">
            <ImageBar
              :load="avatar"
              :fail="imgLoadFail"
              className="user-avatar"
            ></ImageBar>
            <span class="user-name">{{name}}</span><i class="el-icon-caret-bottom"></i>
          </div>
          <el-dropdown-menu
            class="user-dropdown"
            slot="dropdown"
          >
            <!-- <router-link to="/">
                <el-dropdown-item>
                  我的主页
                </el-dropdown-item>
              </router-link>
              <router-link to="/">
                <el-dropdown-item>
                  个人设置
                </el-dropdown-item>
              </router-link> -->
            <el-dropdown-item @click.native="editPassword">
                {{$t("layouts.editPassword")}}
            </el-dropdown-item>
            <el-dropdown-item @click.native="logout">
              <span
                style="display:block;"
              >{{$t("layouts.signOut")}}</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </el-menu>
</template>

<script>
import {
  setCookie,
  getCookie,
  getCleanCacheData,
  setLocal,
  isEmpty,
  watchObj
} from "assets/js/reused";
import ImageBar from "common/ImageBar";
import navigation from "assets/img/navigation.png";
import Menu from "./Menu";
import {logout,dialog } from "./store";
export default {
  name: "NavBar",
  data() {
    return {
      imgLoadFail:
        "https://img.alicdn.com/tfs/TB1ONhloamWBuNjy1XaXXXCbXXa-200-200.png",
      menuDisplay: false,
      navigation: navigation
    };
  },
  components: {
    ImageBar,
    Menu
  },
  computed: {
    name() {
      if (this.$store.getters && this.$store.getters.memberInfo) {
        return this.$store.getters.memberInfo.memberName;
      }
    },
    avatar: {
      cathe: false,
      get() {
        if (this.$store.getters && this.$store.getters.memberInfo) {
          return this.$store.getters.memberInfo.avatar;
        }
      }
    },
    // slogan() {
    //   if (this.$store.getters && this.$store.getters.merchantInfo) {
    //     if (this.$store.getters.merchantInfo[0].slogan == "") {
    //       return "动宝智能化培训整体解决方案，开启培训服务3.0时代！";
    //     } else {
    //       return this.$store.getters.merchantInfo[0].slogan;
    //     }
    //   }
    // },
    merchantName() {
      if (this.$store.getters && this.$store.getters.merchantInfo) {
        return this.$store.getters.merchantInfo.institutionName;
      }
    },
    merchantPic() {
      if (this.$store.getters && this.$store.getters.merchantInfo) {
        return this.$store.getters.merchantInfo.logImg;
      }
    },
    navIsShow() {
      if (getCookie("baseInfo").roleIds === "-1") {
        return true;
      } else {
        return false;
      }
    }
  },
  watch: {
    menuDisplay(newV, oldV) {
      if (newV) {
        document.getElementsByClassName("app-wrapper")[0].style.overflow =
          "hidden";
      } else {
        document.getElementsByClassName("app-wrapper")[0].style.overflow =
          "visible";
      }
    }
  },
  created() {
    this.init()
    let merchantInfo=getCookie("merchantInfo");
    if(isEmpty(merchantInfo)){
      this.getMerchantInfo();
    }else{
      this.$store.commit("setMerchantInfo", merchantInfo);
    }
  },
  methods: {
    init(){
        watchObj({ 
        obj:logout, 
        prop:"isLogout",
        isDefault:false,
        callback:(v)=>{
         if(v){
           this.logout()
         }
      }})
    },
    logout() {
      //退出登录
      this.$axios.post({
        url: baseURL + "operator/logout",
        success: res => {
          this.$message({
            message: res.message,
            type: "success"
          });
          //清空登录用户信息,并且回到登录页
          setCookie("baseInfo", "");
          setCookie("merchantInfo", "");
          setLocal("auths", "");
          setLocal("authArr", "");
          this.$store.commit("setBaseInfo", "");
          this.$store.commit("setMerchantInfo", "");
          setLocal("authTabs","");
          setLocal("authArr", "");
          setLocal("routerArr","");
          this.$store.commit("setAuthArr", "");
          this.$store.commit("setAuthData", "");
          this.$store.commit("setImgOrVideo","");
          setCookie("insId", "");
          setCookie("imgOrVideo", "");
          this.$router.push({
            path: "/login"
          });
          this.$store.commit("clearOption");
        }
      });
    },
    isDisplay() {
      this.menuDisplay = false;
    },
    editPassword(){
      dialog.openDialog();
    },
    getMerchantInfo() {
      //获取商家信息
      let institutionId=getCookie("insId");
      this.$axios.post({
        url: baseURL + "institution/find",
        data: {
          institutionId: institutionId
        },
        success: res => {
          setCookie("merchantInfo", res.data);
          this.$store.commit("setMerchantInfo", res.data);
        }
      });
    }
  }
};
</script>

<style lang="scss">
.el-submenu__icon-arrow {
  top: 55%;
}
.navbar {
  height: 65px;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  background-color: #2d323f;
  display: flex;
  position: relative;
  -moz-user-select: none;
  -o-user-select: none;
  -khtml-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
  border-right-width: 0;
  .logo {
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    background: #2d323f;
    color: #fff;
    text-align: center;
    font-size: 16px;
    overflow: hidden;
    width: 11vw;
    height: 64px;
    min-width: 20px;
    display: inline-block;
    border-bottom:1px solid #000;
    .ass {
      width: 78%;
      height: 100%;
      margin: auto;
      margin-top: 4px;
      margin-bottom: 4px;
      img {
        // width: 80%;
        border-radius: 2px;
        height: 100%;
      }
    }
    .site-name {
      color: white;
      display: inline-block;
      width: 80%;
          margin-top: 3%;
      font-size: 0.6rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .slogan {
    vertical-align: middle;
    line-height: 64px;
    color: #c4c4c4;
    text-align: center;
    font-size: 20px;
    padding-left: 15px;
  }
  .item {
    cursor: pointer;
    font-family: MicrosoftYaHei;
    font-size: 0.8rem;
    font-weight: normal;
    font-stretch: normal;
    letter-spacing: 0rem;
    line-height: 65px;
    color: #666;
    height: 100%;
    margin-right: 17px;
  }
  .el-badge__content {
    border: 0px;
  }
  .item_email {
    line-height: 70px;
  }
  .item_email sup {
    background-color: #71d072;
    margin-top: 21px;
  }
  .item_guide sup {
    margin-top: 20px;
  }
  .navbar_center {
    flex: 16;
    .site-name{
      line-height: 65px;
      font-size: 18px;
      padding-left: 20px;
      color: #fff;
    }
    .navbar_menu {
      // width: 200px;
      float: right;
      margin-right: 15px;
      text-align: center; // margin-left: 49px;
      // background-color: #3c3c3c;
      .title {
        line-height: 64px;
        cursor: pointer;
        img {
          width: 16px;
          vertical-align: middle;
          height: 11px;
        }
        span {
          width: 67px;
          height: 16px;
          line-height: 64px;
          font-family: MicrosoftYaHei;
          font-size: 0.8rem;
          // font-weight: 700;
          margin-left: 15px;
          font-stretch: normal;
          line-height: 30px;
          vertical-align: middle;
          letter-spacing: 1px;
          color: #ffffff;
        }
      }
      .menubar {
        position: absolute;
        background: #3c3c3c;
        right: 0;
        height: 100vh;
        left: 0px; // top: 65px;
        z-index: 6;
      }
      @media screen and (min-width: 1800px) {
        .menubar {
          height: 100vh;
        }
      }
    }
    .menu-icons {
      background: #fff;
      text-align: right;
      width: 500px;
      line-height: 64px;
      height: 64px;
      float: right;
      .menu-icon {
        padding: 0 12px;
        .icon {
          display: inline-block;
          font-size: 18px;
          text-align: center;
        }
        sup {
          top: 23px;
        }
      }
    }
  }
  .user-profile-container {
    flex: 1;
    cursor: pointer; // background: #fff;
    .user-profile-content {
      display: flex;
      padding: 20px 0;
      .el-dropdown {
        margin-right: 2rem;
      }
    }
    .user-profile-body {
      position: relative;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      text-align: center;
      color: #ffffff;
      padding-right: 14px;
      .user-name {
        color: #fff;
        white-space: nowrap;
        overflow: hidden;
      }
    }
    .user-avatar {
      width: 24px;
      height: 24px;
      margin: 0 8px 0 12px;
      border-radius: 50%;
      background: #f3f3f3;
      border: 1px solid #ddd;
    }
    .user-department {
      font-size: 12px;
      color: rgba(102, 102, 102, 0.65);
    }
    .el-icon-caret-bottom {
      position: absolute;
      right: 0;
      top: 9px;
      font-size: 12px;
    }
  }
}
</style>

