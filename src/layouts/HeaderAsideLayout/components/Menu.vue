<template>
  <div class="navmenu">
    <!-- <div v-for="(item,index) in asideMenuConfig" :key="item.id" :style="{display:index==6?'block':'inline-block'}" class="nav_div"> -->
    <div v-for="item in asideMenuConfig" :key="item.id"  class="nav_div">
      <div >
        <div class="nav_title" :style="{backgroundColor:item.color}">{{item.name}}</div>
        <ul>
          <li v-for="(element) in item.children" :key="element.id" @click="go(element.path)" @mouseover="liBackgroundColor($event,item.color)" @mouseout="liBackgroundColorOut($event)">
            {{element.name}}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
// import navMenu from "./navMenu.js"
import { asideMenuConfig } from "@/menuConfig";
// console.log(asideMenuConfig)
export default {
  name: "Menu",
  data() {
    return {
      asideMenuConfig,
      color: ""
    };
  },
  create() {},
  methods: {
    go(link) {
      this.$emit("go", true);
      this.$router.push(link);
    },
    liBackgroundColor(item, color) {
      item.target.style.backgroundColor = "#161616";
      item.target.style.color = color;
    },
    liBackgroundColorOut(item) {
      item.target.style.backgroundColor = "#2e2e2e";
      item.target.style.color = "white";
    }
  }
};
</script>
<style lang="scss" scoped>
.navmenu {
  overflow-x: auto;
    white-space: nowrap;
  height: calc(100% - 65px);
  /*滚动条样式*/
  &::-webkit-scrollbar {
    height: 20px;
  }
  //滚动条
  &::-webkit-scrollbar-thumb {
    background: #d7e0e7;
  }
  //滚动栏
  &::-webkit-scrollbar-track {
    border-radius: 0;
    background: #3c3c3c;
  }

  // overflow-x: auto;
  .nav_div {
    width: 9rem;
    display: inline-block;
    vertical-align: top;
    // float: left;
    // background: #f0f0f0;
    box-sizing: border-box;
    margin: 30px 7px;
    // padding: 10px 0;
    .nav_title {
      color: #000000;
      font-size: 18px;
      text-align: center;
      background-color: #95e2d6;
      height: 3rem;
      line-height: 3rem;
    }
    ul {
      list-style: none;
      padding: 0;
      margin: 0;
      text-align: center;
      li {
        height: 3rem;
        color: #ffffff;
        background-color: #2e2e2e;
        margin-bottom: 1px;
        line-height: 3rem;
        cursor: pointer;
      }
    }
  }
  // @media screen and (max-width: 1400px) {
  //   .nav_div {
  //     margin: 20px;
  //   }
  // }
}
</style>

