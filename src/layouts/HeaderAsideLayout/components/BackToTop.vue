<template lang='html'>
    <div class='back_to_top' v-show="isShow">
        <div v-show="showTop" @click="backToTop">
            <i class="el-icon-arrow-up"></i>
             <span style="margin-top: -38px;">顶部</span>
        </div>
        <div v-show="!showTop" @click="backToBottom">
            <span>底部</span>
            <i class="el-icon-arrow-down"></i>
        </div>
    </div>
</template>
<script>
export default {
  name: "backToTop",
  data() {
    return {
      showTop: false,
      isShow: false
    };
  },
  mounted() {
    document.querySelector(".app-main").addEventListener("scroll", () => {
      this.scroll();
    });
    //根据页面高度动态判断回到顶部是否显示
    if (
      document.querySelector(".app-wrap").offsetHeight >
      document.querySelector(".app-main").offsetHeight
    ) {
      this.isShow = true;
    } else {
      this.isShow = false;
    }
  },
  watch: {
    $route(newV, oldV) {
      //根据页面高度动态判断回到顶部是否显示
      if (
        document.querySelector(".app-wrap").offsetHeight >
        document.querySelector(".app-main").offsetHeight
      ) {
        this.isShow = true;
      } else {
        this.isShow = false;
      }
    }
  },
  methods: {
    scroll() {
      //超过一页显示回到顶部
      if (
        document.querySelector(".app-main").scrollTop >
        document.querySelector(".app-main").offsetHeight
      ) {
        this.showTop = true;
      } else {
        this.showTop = false;
      }
    },
    backToTop() {
      document.querySelector(".app-main").scrollTop = 0;
    },
    backToBottom() {
      document.querySelector(".app-main").scrollTop = document.querySelector(
        ".app-wrap"
      ).offsetHeight;
    }
  }
};
</script>
<style lang="scss" scoped>
.back_to_top {
  background: #e4dbdb;
  width: 60px;
  height: 60px;
  position: fixed;
  line-height: 52px;
  bottom: 20px;
  right: 0;
  & > div {
    width: 100%;
    height: 100%;
    text-align: center;
    &>span{
        height: 20%;
        display: block;
    }
    &>i{
        font-size: 15px;
    }
  }
  cursor: pointer;
}
</style>