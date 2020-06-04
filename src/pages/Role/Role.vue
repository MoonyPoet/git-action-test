<template lang='html'>
    <div class='role'>
      <el-container>
        <el-aside width="200px" class="addRoleContentTo">
              <el-button @click="openDailog" class="add addRole" round size="small">{{$t('role.addRoleLabel')}}</el-button>
              <el-row class="item">
                <el-col :span="24" >
                   <el-menu
                  :default-active="active"
                  ref="menu"
                  class="el-menu-vertical-demo">
                       <el-menu-item v-for="(item,index) in roleData"
                                :key="item.roleId"  @click="roleChange(item.roleId)" :index="index.toString()"  >
                          <span slot="title">{{item.roleName}}</span>
                    </el-menu-item>
                  </el-menu>
                  </el-col>
              </el-row>
        </el-aside>
        <el-main :style="{padding:'0px'}">
              <div v-show="dialogVisible" class="addRoleContent"  v-loading.lock="fullscreenLoading">
                  <el-form :model="formData" :rules="rules" size="medium" ref="formData" label-width="200px" label-position="left" class="demo-ruleForm" :validate-on-rule-change="false">
                      <el-button class="delete" v-if="showDelBtn" size="small" round type="danger" @click="deleteRole">{{$t('role.deleteRole')}}</el-button>
                      <el-form-item :label="$t('role.roleNameLabel')" ref="roleName" prop="roleName">
                          <el-input v-model="formData.roleName" class="des" :placeholder="$t('role.roleName')"></el-input>
                      </el-form-item>
                      <el-form-item :label="$t('role.managementSystemPower')">
                          <el-row v-for="element in formData.manageAuth" :key="element.id">
                              <!-- {{element}} -->
                              <el-col :span="24">
                                  <!-- <el-collapse accordion> -->
                                  <div><el-checkbox v-model="element.checked" @change="((v)=>handleCheckAllRoleChange(v,element))">{{element.name}}<div class="san"></div></el-checkbox></div>
                                  <div style="padding-left:40px;">
                                      <el-checkbox v-for="item in element.optList" :label="item.val" :key="item.val" v-model="item.checked" @change="((v)=>handleCheckOptItemChange(v,element,item))" >{{item.name}}</el-checkbox>
                                  </div>
                                <!-- 二级判断 -->
                                  <div v-if="element.checked">
                                    <div v-if="element.childrenModules&&element.childrenModules.length>0" v-for="item in element.childrenModules" :key="item.id">
                                        <div v-if="item.childrenModules&&item.childrenModules.length==0">
                                            <div style="padding-left:40px;" >
                                                <el-checkbox v-model="item.checked" @change="((v)=>handleCheckAllRoleElementChange(v,element,item))">{{item.name}}</el-checkbox>
                                            </div>
                                            <!-- 三级判断 -->
                                           <div v-if="item.checked" >

                                            <div style="padding-left:80px;">
                                                <el-checkbox v-for="optItem in item.optList" :label="optItem.val" :key="optItem.val" v-model="optItem.checked" @change="((v)=>handleCheckOptItemChange(v,element,item))" >{{optItem.name}}</el-checkbox>
                                            </div>
                                            </div>
                                        </div>
                                        <div v-else>
                                            <div style="padding-left:40px;">
                                                <el-checkbox v-model="item.checked" @change="((v)=>handleCheckAllRoleElementChange(v,element,item))">{{item.name}}</el-checkbox>
                                            </div>
                                            <!-- 三级判断 -->
                                           <div v-if="item.checked" >
                                              <div v-if="item.optList&&item.optList.length>0"  style="padding-left:80px;">
                                                <el-checkbox v-for="noteItem in item.optList" :label="noteItem.val" :key="noteItem.val" v-model="noteItem.checked" @change="((v)=>handleCheckAllRoleNoteItemChange(v,element,item,noteItem))" >{{noteItem.name}}</el-checkbox>
                                              </div>
                                              <div v-else>
                                                <div  style="padding-left:80px;"  v-for="noteItem in item.childrenModules" :key="noteItem.id">
                                                    <div>
                                                        <el-checkbox v-model="noteItem.checked" @change="((v)=>handleCheckAllRoleNoteItemChange(v,element,item,noteItem))">{{noteItem.name}}</el-checkbox>
                                                    </div>
                                                    <!-- 四级判断 -->
                                                    <div v-if="noteItem.checked" >
                                                    <div style="padding-left:40px;"  >
                                                        <el-checkbox v-for="optItem in noteItem.optList" :label="optItem.val" :key="optItem.val" v-model="optItem.checked" @change="((v)=>handleCheckOptItemChange(v,element,item,noteItem))" >{{optItem.name}}</el-checkbox>
                                                    </div>
                                                    </div>

                                                </div>
                                              </div>
                                              
                                            </div>
                                        </div>
                                    </div>
                                    
                                  </div> 
                                
                                  <!-- </el-collapse> -->
                              </el-col>
                            
                          </el-row>
                          <hr>
                 
                      </el-form-item>
                      <el-form-item :label="$t('role.miniprogramPower')">
                          <el-row v-for="element in formData.wechatAuth" :key="element.id">
                              <el-col :span="24">
                                  <div><el-checkbox v-model="element.checked" @change="((v)=>handleCheckAllRoleChange(v,element))">{{element.name}}</el-checkbox></div>
                                  <!-- 二级判断 -->
                                  <div v-if="element.checked">
                                  <div v-if="element.childrenModules&&element.childrenModules.length>0" v-for="item in element.childrenModules" :key="item.id">
                                    <div v-if="item.childrenModules&&item.childrenModules.length==0">
                                          <div style="padding-left:40px;">
                                              <el-checkbox v-model="item.checked" @change="((v)=>handleCheckAllRoleElementChange(v,element,item))">{{item.name}}</el-checkbox>
                                          </div>
                                          <!-- 三级判断 -->
                                           <div v-if="item.checked">
                                            <div style="padding-left:80px;">
                                                <el-checkbox v-for="optItem in item.optList" :label="optItem.val" :key="optItem.val" v-model="optItem.checked" @change="((v)=>handleCheckOptItemChange(v,element,item))" >{{optItem.name}}</el-checkbox>
                                            </div>
                                          </div>
                                      </div>
                                      <div v-else>
                                          <div style="padding-left:40px;">
                                              <el-checkbox v-model="item.checked" @change="((v)=>handleCheckAllRoleElementChange(v,element,item))">{{item.name}}</el-checkbox>
                                          </div>
                                          <!-- 三级判断 -->
                                           <div v-if="item.checked">
                                              <div v-if="item.childrenModules&&item.childrenModules.length>0">
                                                 <div  style="padding-left:80px;" v-for="noteItem in item.childrenModules" :key="noteItem.id">
                                                    <div>
                                                        <el-checkbox v-model="noteItem.checked" @change="((v)=>handleCheckAllRoleNoteItemChange(v,element,item,noteItem))">{{noteItem.name}}1</el-checkbox>
                                                    </div>
                                                    <!-- 四级判断 -->
                                                    <div v-if="noteItem.checked">
                                                      <div style="padding-left:40px;">
                                                          <el-checkbox v-for="optItem in noteItem.optList" :label="optItem.val" :key="optItem.val" v-model="optItem.checked" @change="((v)=>handleCheckOptItemChange(v,element,item,noteItem))" >{{optItem.name}}</el-checkbox>
                                                      </div>
                                                    </div>
                                                </div>
                                              </div>
                                              <div style="padding-left:80px;">
                                                <el-checkbox v-for="noteItem in item.optList" :label="noteItem.val" :key="noteItem.val" v-model="noteItem.checked" @change="((v)=>handleCheckOptItemChange(v,element,item,noteItem))" >{{noteItem.name}}</el-checkbox>
                                              </div>
                                             
                                          </div>

                                      </div>
                                  </div> 
                                  </div> 
                              </el-col>
                          </el-row>
                      </el-form-item>

                  </el-form>
                  <el-button @click="editRole" v-if="editStatus==1?true:false" type="primary">修改角色</el-button>
                  <el-button @click="addRole" v-else-if="editStatus==1?false:true" type="primary">添加角色</el-button>
              </div>
        </el-main>
      </el-container>
    </div>
</template>
<script>
import {
  clone,
  debounce,
  getCookie,
  isEmpty,
  getRoleArr,
  getFourRoleArr,
  selectDefaultData,
  setCookie,
  setLocal,
  getCode,
  getAsso
} from "assets/js/reused";
export default {
  name: "role",
  data() {
    return {
      value: "",
      rolaData: [],
      campusData: [],
      dialogVisible: true,
      fullscreenLoading: false,
      checkAll: false,
      formData: {
        roleName: "",
        manageAuth: [],
        wechatAuth: []
      },
      selectData: {
        role: ""
      },
      active:"0",
      roles: [],
      editStatus: 1,
      roleData: [],
      roleArr: [],
      role: "",
      isIndeterminate: false,
      rules: {
        name: [{ required: true, message: this.$t("form.required"), trigger: "blur" }],
        campusIds: [{ required: true, message: this.$t("form.required"), trigger: "change" }]
      }
    };
  },
  computed:{
    showDelBtn(){
      //如果当前角色跟删除角色id相同不允许执行删除
      if(this.selectData.role===getCookie("baseInfo").roleIds||isEmpty(this.selectData.role)){
        return false;
      }else{
        return true;
      }
    }
  },
  created() {
    this.init();
  },
  methods: {
    getRoleArrs(roterStr) {
      return getRoleArr(roterStr);
    },
    async init() {
      let res = await this.getRoleData();
      this.roleData =res;
      this.selectData.role = selectDefaultData( res, "roleId");
      this.formData.roleName=selectDefaultData( res, "roleName");
      let res1 = await this.findAuth({ roleId: this.selectData.role });
      this.formData.manageAuth = [...res1.manageAuth];
      this.formData.wechatAuth = [...res1.wechatAuth];
    },
    async getRoleData(){
      return await post("role/find_all")
    },
    async openDailog() {
      this.active="";
      this.$refs.menu.activeIndex="";
      setTimeout(() => {
        this.$refs.formData.resetFields();
      });
      this.dialogVisible = true;
      this.editStatus = 0;
      for (let key in this.formData) {
        if (key != "authVos") {
          this.formData[key] = "";
        } else {
          this.formData[key] = [];
        }
      }
      let res1 = await this.findAuth({ roleId: "" });
      this.formData.manageAuth = [...res1.manageAuth];
      this.formData.wechatAuth = [...res1.wechatAuth];
      this.isIndeterminate = false;
      this.checkAll = false;
      this.selectData.role = "";
    },
    addRole() {
      let formData=clone(this.formData);
      let submitData={};
      submitData=this.getFormData([...formData.manageAuth,...formData.wechatAuth]);
      submitData.roleName=formData.roleName;
      return new Promise((resolve, reject) => {
        this.$refs.formData.validate(valid => {
          if (valid) {
            this.$axios.post({
              url: baseURL + "role/save",
              isSubmit: true,
              data: submitData,
              success: res => {
                this.$message({
                  message: res.message || "修改成功",
                  type: "success"
                });
                this.getRoleData().then(res => {
                  this.roleData = [].concat(res);
                  this.selectData.role = selectDefaultData(res, "roleId");
                  this.active="0";
                  this.roleChange(this.selectData.role)
                });
                resolve();
              }
            });
          } else {
            return false;
          }
        });
      });
    },
    getFormData(formData){
      var authIds = new Array();
      var authNoteIds = new Array();
      function getAuthId(datas){
        for(let data of datas){
          if(data.checked){
          authIds.push(data.id);
          if(data.optList&&data.optList.length>0){
            for(let opt of data.optList){
            if(opt.checked){
              authNoteIds.push(opt.id)
            }
            }
          }
          if(data.childrenModules&&data.childrenModules.length>0){
            getAuthId(data.childrenModules)
          }
          }
        }
        }
      getAuthId(formData);
      return {
        authIds:JSON.stringify(authIds),
        authNoteIds:JSON.stringify(authNoteIds)
      }
    },
    deleteRole(){
      let formData={};
      formData.roleId=this.selectData.role;
      this.$confirm('确定删除该角色, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$axios.post({
            url: baseURL + "role/delete",
            isSubmit: true,
            data: formData,
            success: res => {
              //修改角色等于当前登录角色时,超级管理员待确定  -1为最高权限
              if (getCookie("baseInfo").roleIds == formData.roleId) {
                this.logout();
              } else {
                this.$message({
                  message: res.message || "修改成功",
                  type: "success"
                });
                this.getRoleData().then(res => {
                  this.roleData = [].concat(res);
                  this.selectData.role = selectDefaultData(res, "roleId");
                  this.$refs.menu.activeIndex="0";
                  this.active="0";
                  this.roleChange(this.selectData.role);
                });
              }
            }
        });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
    editRole() {
      let formData = clone(this.formData);
      formData.roleId = this.selectData.role;
      let submitData={};
      submitData=this.getFormData([...formData.manageAuth,...formData.wechatAuth]);
      submitData.roleName=formData.roleName;
      submitData.roleId= formData.roleId;
      return new Promise((resolve, reject) => {
        this.$refs.formData.validate(valid => {
          if (valid) {
            this.$axios.post({
              url: baseURL + "role/save",
              isSubmit: true,
              data: submitData,
              success: res => {
                //修改角色等于当前登录角色时,超级管理员待确定  -1为最高权限
                if (getCookie("baseInfo").roleIds == formData.roleId) {
                  this.logout();
                } else {
                  this.$message({
                    message: res.message || "修改成功",
                    type: "success"
                  });
                  this.getRoleData().then(res => {
                    this.roleData = [].concat(res);
                    // this.selectData.role = selectDefaultData(res, "roleId");
                    // this.formData.roleName=selectDefaultData(res, "roleName");
                  });
                  resolve();
                }
              }
            });
          } else {
            return false;
          }
        });
      });
    },
    logout() {
      //退出登录
      this.$axios.post({
        url: baseURL + "member/logout",
        success: res => {
          this.$message({
            message: "请重新登陆",
            type: "success"
          });
          //清空登录用户信息,并且回到登录页
          setCookie("baseInfo", "");
          setCookie("merchantInfo", "");
          setLocal("auths", "");
          setLocal("authArr", "");
          this.$store.commit("setBaseInfo", "");
          this.$store.commit("setMerchantInfo", "");
          this.$router.push({ path: "/login" });
          this.$store.commit("clearOption");
        }
      });
    },
    getRoleCampus() {
      return new Promise(async (resolve, reject) => {
          resolve(await getAsso({
            keyword:"role",
            insId:getCookie("insId")
          }))
      });
    },
    findAuth(data = {}) {
      return new Promise((resolve, reject) => {
        this.$axios.post({
          url: baseURL + "role/detail",
          data: {
            ...data
          },
          success: res => {
            resolve(res.data);
          }
        });
      });
    },
    handleCheckAllRoleChange(val, element) {
      //全选
      if (val) {
        if (element.childrenModules && element.childrenModules.length > 0) {
          element.childrenModules.forEach(item => {
            item.checked = true;
            this.handleCheckAllRoleChange(val, item);
          });
        } else {
          if (!isEmpty(element.optList)) {
            element.optList.forEach(child => {
              child.checked = true;
            });
          }
        }
      } else {
        if (element.childrenModules && element.childrenModules.length > 0) {
          element.childrenModules.forEach(item => {
            item.checked = false;
            this.handleCheckAllRoleChange(val, item);
          });
        } else {
          if (!isEmpty(element.optList)) {
            element.optList.forEach(child => {
              child.checked = false;
            });
          }
        }
      }
    },
    handleCheckAllRoleElementChange(val, elememt, item) {
      if (val) {
        elememt.checked = true;
        // item.checked=true;
        if (item.childrenModules && item.childrenModules.length > 0) {
          item.childrenModules.forEach(noteItem => {
            noteItem.checked = true;
            this.handleCheckAllRoleElementChange(val, elememt, noteItem);
          });
        } else {
          if (!isEmpty(item.optList)) {
            item.optList.forEach(child => {
              child.checked = true;
            });
          }
        }
      } else {
        //子模块中只要勾选了一个父模块就勾中,否则不勾
        let checkedArr = [];
        elememt.childrenModules.forEach(childItem => {
          checkedArr.push(childItem.checked);
        });
        if (checkedArr.some(v => v == true)) {
          elememt.checked = true;
        } else {
          elememt.checked = false;
        }
        // item.checked=false;
        if (item.childrenModules && item.childrenModules.length > 0) {
          item.childrenModules.forEach(noteItem => {
            noteItem.checked = false;
            this.handleCheckAllRoleElementChange(val, elememt, noteItem);
          });
        } else {
          if (!isEmpty(item.optList)) {
            item.optList.forEach(child => {
              child.checked = false;
            });
          }
        }
      }
    },
    handleCheckAllRoleNoteItemChange(val, elememt, item, noteItem) {
      if (val) {
        elememt.checked = true;
        item.checked = true;
        if (noteItem.childrenModules && noteItem.childrenModules.length > 0) {
          noteItem.childrenModules.forEach(optItem => {
            optItem.checked = true;
            this.handleCheckAllRoleElementChange(val, elememt, optItem);
          });
        } else {
          if (!isEmpty(noteItem.optList)) {
            noteItem.optList.forEach(child => {
              child.checked = true;
            });
          }
        }
      } else {
        //子模块中只要勾选了一个父模块就勾中,否则不勾
        let checkedArr = [],
          checkedArr1 = [];
        if(item.childrenModules){
          item.childrenModules.forEach(childItem => {
            checkedArr1.push(childItem.checked);
          });
          if (checkedArr1.some(v => v == true)) {
            item.checked = true;
          } else {
            item.checked = false;
          }
        }
        
        elememt.childrenModules.forEach(childItem => {
          checkedArr.push(childItem.checked);
        });
        if (checkedArr.some(v => v == true)) {
          elememt.checked = true;
        } else {
          elememt.checked = false;
        }
        // item.checked=false;
        if (noteItem.childrenModules && noteItem.childrenModules.length > 0) {
          noteItem.childrenModules.forEach(optItem => {
            optItem.checked = false;
            this.handleCheckAllRoleElementChange(val, elememt, optItem);
          });
        } else {
          if (!isEmpty(noteItem.optList)) {
            noteItem.optList.forEach(child => {
              child.checked = false;
            });
          }
        }
      }
    },
    handleCheckOptItemChange(val, element, item, noteItem) {
      if (val) {
        element.checked = true;
        item.checked = true;
        if (noteItem) {
          noteItem.checked = true;
        }
      }
    },
    handleCheckAllChange(val) {
      //全选
      if (val) {
        this.campusData.forEach(element => {
          this.formData.campusIds.push(element.campusId);
        });
      } else {
        this.formData.campusIds = [];
      }
      this.isIndeterminate = false;
    },
    handleCheckedCitiesChange(value) {
      //选择单个
      // console.log(value);
      // let checkedCount = value.length;
      // this.checkAll = checkedCount === this.campusData.length;
      // this.isIndeterminate =
      //   checkedCount > 0 && checkedCount < this.campusData.length;
      // this.isIndeterminate = false;
    },
    async roleChange(v) {
      this.fullscreenLoading = true;
      this.checkAll = false;
      //切换角色
      this.editStatus = 1;
      for (let key in this.formData) {
        if (key != "authVos") {
          this.formData[key] = "";
        } else {
          this.formData[key] = [];
        }
      }
      let res = await this.getRoleData({ roleId: v });
      if (res[0]) {
        for (let key in this.formData) {
          if (key != "campusIds") {
            this.formData[key] = res[0][key];
          } else {
            this.formData[key] = res[0][key].split(",").map(v => parseInt(v));
          }
        }
        // this.handleCheckedCitiesChange(this.formData["campusIds"]);
      }
      let res1 = await this.findAuth({ roleId: v});
       this.selectData.role = res1.roleId;
      this.formData.roleName=res1.roleName;
      this.formData.manageAuth = [...res1.manageAuth];
      this.formData.wechatAuth = [...res1.wechatAuth];
      this.fullscreenLoading = false;
    }
  }
};
</script>
<style lang="scss" scoped>
.role {
  background: #f3f3f3;
  position: relative;
  width: 100%;
  height: 800px;
  .delete{
    position: absolute;
    right: 40px;
    z-index: 1;
  }
  .el-container {
    background: #fff;
    width: 100%;
    height: 100%;
  }
  .el-checkbox + .el-checkbox {
    margin: 0;
    margin-right: 50px;
  }
  .el-checkbox {
    margin-right: 50px;
  }
  .role_select {
    margin-left: 20px;
  }
  .addRoleContent {
    padding: 27px;
  }
  .addRoleContentTo {
    border-right: 1px solid #dcdfe6;
    padding: 0px;
  }
  .el-form-item span {
    font-size: 1.2em;
  }
  .addRole {
    display: inherit;
    margin: 30px auto;
  }
  .active {
    background: #f3f3f3;
  }
  .item {
    text-align: center;
  }
}
</style>