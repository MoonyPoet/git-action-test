<template>
  <div class="fixed-table">
      <div style="margin-bottom:20px;">
      </div>
     <TableSearch ref="table" :colConfigs="colConfigs" @sortChange="sortChange">
        <el-button @click="addTrainLevel" class="add" slot="add" round size="small">{{$t('train.levelAdd')}}</el-button>
          <el-table-column
        :label="$t('train.levelLogImg')"
        width="100px"
        slot="img"
        >
            <template slot-scope="{row}">
               <img width="80" height="80" :src="row.logImg" style="border-radius:50%;" alt="">
            </template>
        </el-table-column>
        <el-table-column
        :label="$t('table.operations')"
        width="150px"
        slot="opt"
        >
            <template slot-scope="{row}">
                <el-button @click="eitdTrainLevel(row)" size="mini">{{$t('table.edit')}}</el-button>
                <el-button type="danger" @click="handleClick(row,1)" size="mini">{{$t('table.delete')}}</el-button>
            </template>
        </el-table-column>
     </TableSearch>
   

    <el-dialog
      :title="$t('form.add')"
      :visible.sync="dialogVisible1"
      width="600px"
      center
      >
      <el-form ref="formData1" :rules="rules" :model="formData1" label-width="200px" label-position="left">
          <el-form-item :label="$t('train.levelLogImg')" ref="logImg" prop="logImg">
              <UploadImg v-model="formData1.logImg"></UploadImg>
          </el-form-item>
          <el-form-item :label="$t('train.levelName')" prop="trainLevelName">
              <el-input  class="levelName" rows="4" v-model="formData1.trainLevelName" :placeholder="$t('train.levelName')" :title="$t('train.levelName')"></el-input>
          </el-form-item>
          <el-form-item :label="$t('train.level')" ref="trainLevel" prop="trainLevel">
               <SelectOpt v-model="formData2.trainLevel" :required="false" :data="levelArray" val='v' id='v' :placeholder="$t('train.level')"></SelectOpt>
          </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible1 = false">{{$t('form.cancel')}}</el-button>
        <el-button type="primary" @click="addForm">{{$t('form.submit')}}</el-button>
      </span>
    </el-dialog>
      <el-dialog
      :title="$t('form.edit')"
      :visible.sync="dialogVisible2"
      width="600px"
      center
      >
      <el-form ref="formData2" :rules="rules" :model="formData2" label-width="200px" label-position="left">
          <el-form-item :label="$t('train.levelLogImg')" ref="logImg" prop="logImg">
              <UploadImg v-model="formData2.logImg"></UploadImg>
          </el-form-item>
          <el-form-item :label="$t('train.levelName')" prop="trainLevelName">
              <el-input  class="levelName" rows="4" v-model="formData2.trainLevelName" :placeholder="$t('train.levelName')" :title="$t('train.levelName')"></el-input>
          </el-form-item>
          <el-form-item :label="$t('train.level')" ref="trainLevel" prop="trainLevel">
              <SelectOpt v-model="formData2.trainLevel" :required="false" :data="levelArray" val='v' id='v' :placeholder="$t('train.level')"></SelectOpt>
          </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible2 = false">{{$t('form.cancel')}}</el-button>
        <el-button type="primary" @click="editForm">{{$t('form.submit')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import TableSearch from "common/TableSearch";
import SelectOpt from "common/SelectOpt";
import UploadImg from "common/UploadImg";
import {clone,bindData} from 'assets/js/reused';
import {baseFn} from "assets/js/reused";
  export default {
  components: {TableSearch,SelectOpt,UploadImg},
  name: 'trainLevel',
  props:{
    newObj:Object,
    searchLike:String
  },
  data() {
    return {
        colConfigs:[
            { slot: 'img' },
            { prop: 'trainLevelName', label:this.$t('train.levelName')},
            { prop: 'trainLevel', label:this.$t('train.level')},
            { prop: 'updateDt',label:this.$t('table.updateDt')},
            // 模版中的元素需要对应的有 slot="opt" 属性
            { slot: 'opt' },
        ],
        formData1:{
            logImg:null,
            trainLevelName:null,
            trainLevel:null
        },
        formData2:{
            trainLevelId:null,
            logImg:null,
            trainLevelName:null,
            trainLevel:null
        },
        rules:{
            trainLevelName:[
              {required:true,trigger:"blur",message:this.$t("form.required")}
            ],
            trainLevel:[
              {required:true,trigger:"blur",message:this.$t("form.required")}
            ]
        },
        dialogVisible2:false,
        dialogVisible1:false,
        levelArray:[{v:1},{v:2},{v:3},{v:4},{v:5},{v:6},{v:7},{v:8},{v:9},{v:10},{v:11},{v:12},{v:13},{v:14},{v:15}],
        offset: 0,
        limit: 10,
        totalAll: 10,
        count: 0
    };
  },
  created(){
  },

  methods: { 
    addTrainLevel(){
      this.formData1={};
      this.dialogVisible1=true;
    },
    eitdTrainLevel(row){
      this.dialogVisible2=true;
      this.$nextTick(()=>{
        bindData({
            formData:this.formData2,
            res:row
        })
      })
    },
    handleClick(row,status){
			let obj={
				0:()=>{
					this.edit(row)
				},
				1:()=>{
					this.delete(row)
				},
				2:()=>{
					this.find(row)
				}
			}
			obj[status]();
    },
    delete(row){
			baseFn.call(this,{
				path:"train_level/delete",
				data:{
					trainLevelId:row.trainLevelId,
				}
			})
		},
    addForm(){
      let formData=clone(this.formData1);
      formData.trainId=this.$route.query.trainId;
      this.$refs["formData1"].validate((valid) => {
          if (valid) {
            this.$axios.post({
              url:baseURL+"train_level/add",
              data:{
                ...formData
              },
              success:(res)=>{
                this.$message({
                  message: res.message,
                  type: 'success'
                });
                this.formData1={};
                this.getTableData()
                this.dialogVisible1=false;
              }
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
    },
    editForm(){
      let formData=clone(this.formData2);
      this.$refs["formData2"].validate((valid) => {
          if (valid) {
            this.$axios.post({
              url:baseURL+"train_level/edit",
              data:{
                ...formData
              },
              success:(res)=>{
                this.$message({
                  message: res.message,
                  type: 'success'
                });
                this.getTableData()
                this.dialogVisible2=false;
              }
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
    },
    getTableData(v) {
      //table 数据
      return new Promise((resolve, reject) => {
        let obj = Object.assign(v == undefined ? {} : v, {
          offset:this.$refs.table.getOffset(),
          limit:this.$refs.table.getLimit(),
          trainId:this.$route.query.trainId,
          initial:1,
          ...this.searchData
        });
        this.$axios.post({
            url: baseURL + "train_level/find_paging",
            data: obj,
            success: res => {
              this.$refs.table.setTableData(res.data.rows);
              this.$refs.table.setTotalAll(res.data.count);
              this.$refs.table.setSearchData(res.data.search);
              resolve();
            }
        });
      });
    },
     getCurrentPage(v) {
      //切换页码时会触发
      this.offset = v == 1 ? 0 : (v - 1) * this.limit;
      this.getTableData();
    },
    getCurrentPageSize(v) {
      this.limit = v;
      this.getTableData();
    },
    sortChange(obj){
        if(obj.order==="descending"){
            // this.getTableData({
            //     sort:
            // })
        }else{
            //  this.getTableData({
            //     sort:sort
            // })
        }
        console.log(v)
    },
    
  }
}
</script>

<style lang="scss" scope>
</style>
