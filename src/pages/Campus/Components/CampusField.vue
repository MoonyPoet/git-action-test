<template>
  <div class="fixed-table">
      <div style="margin-bottom:20px;">
      </div>
     <TableSearch ref="table" :colConfigs="colConfigs" @sortChange="sortChange">
        <el-button @click="addCampusField" class="add" slot="add" round size="small">{{$t('campus.addField')}}</el-button>
            <el-table-column
            :label="$t('table.operations')"
            width="400"
            slot="opt"
            >
            <template slot-scope="{row}">
                <el-button @click="editCampusField(row)" size="mini">{{$t('table.edit')}}</el-button>
			        	<el-button @click="handleClick(row,1)" size="mini" v-if="row.status==='0'">{{$t('table.startUse')}}</el-button>
                <el-button @click="handleClick(row,2)" size="mini" v-else >{{$t('table.stopUse')}}</el-button>
			        	<el-button type="danger" :disabled="row.status==='1'" @click="handleClick(row,3)" size="mini">{{$t('table.delete')}}</el-button>
            </template>
            </el-table-column>
        </TableSearch>
   

    <el-dialog
      :title="$t('form.add')"
      :visible.sync="dialogVisible1"
      width="600px"
      center
      >
      <el-form ref="formData1" :rules="rules" :model="formData1" label-width="100px" label-position="left">
          <el-form-item :label="$t('campus.fieldNameLabel')" prop="fieldName">
              <el-input style="width:90%;"  class="fieldName" rows="4" v-model="formData1.fieldName" :placeholder="$t('campus.fieldName')" :title="$t('campus.fieldName')"></el-input>
          </el-form-item>
          <el-form-item label="hub编号" v-for="(item,index) in formData1.hubsn" :key="item.id" :prop="'hubsn.'+index" :rules="[{
            required:true,message:'必填',trggier:'blur'
          }]">
              <el-input style="width:90%;" v-model="formData1.hubsn[index]" placeholder="请输入hub编号"></el-input>
              <i class="addIcon" @click="addHubsn" v-if="index===0"></i>
              <i class="removeIcon" @click="removeHubsn(index)" v-else></i>
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
      <el-form ref="formData2" :rules="rules" :model="formData2" label-width="100px" label-position="left">
          <el-form-item :label="$t('campus.fieldNameLabel')" prop="fieldName">
              <el-input style="width:90%;" class="fieldName" rows="4" v-model="formData2.fieldName" :placeholder="$t('campus.fieldName')" :title="$t('campus.fieldName')"></el-input>
          </el-form-item>
          <el-form-item label="hub编号" v-for="(item,index) in formData2.hubsn" :key="item.id" :prop="'hubsn.'+index" :rules="[{
            required:true,message:'必填',trggier:'blur'
          }]">
              <el-input style="width:90%;" v-model="formData2.hubsn[index]" placeholder="请输入hub编号"></el-input>
              <i class="addIcon" @click="addHubsn1" v-if="index===0"></i>
              <i class="removeIcon" @click="removeHubsn1(index)" v-else></i>
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
import {debounce,getCodeData,selectDefaultData,isEmpty,clone,getCookie} from 'assets/js/reused';
import {baseFn} from "assets/js/reused";
  export default {
  components: {TableSearch},
  name: 'campusField',
  props:{
    newObj:Object,
    searchLike:String
  },
  data() {
    return {
        searchValue:[],
			goodsCategoryData:[],
			colConfigs:[
				{ prop: 'fieldName', label:this.$t('campus.fieldNameLabel')},
                { prop:'statusDisplay',label:this.$t('table.status')},
        { prop:'updateDt',label:this.$t('table.updateDt')},
        { 
          prop:'hubsn',label:"hub编号"
        },
				// 模版中的元素需要对应的有 slot="opt" 属性
				{ slot: 'opt' }
			],

      formData2:{
      },
      tableData: [],
      offset: 0,
      limit: 10,
      totalAll: 10,
      count: 0,
      formData1:{
        fieldName:null,
        hubsn:[""]
      },
      formData2:{
        fieldName:null,
        hubsn:[""]
      },
     dialogVisible2:false,
     dialogVisible1:false,
     rules:{
        fieldName:[
          {required:true,trigger:"blur",message:this.$t("form.required")}
        ]
      },
    }
  },
  created(){
  },

  methods: {
    addHubsn(){
      this.formData1.hubsn.push("");
    },
    removeHubsn(index){
      this.formData1.hubsn.splice(index,1)
    },
    addHubsn1(){
      this.formData2.hubsn.push("");
    },
    removeHubsn1(index){
      this.formData2.hubsn.splice(index,1);
    },
    addCampusField(){
      this.dialogVisible1=true;
      this.formData1={
        fieldName:null,
        hubsn:[""]
      };
    },
     editCampusField(row){
      this.dialogVisible2=true;
      this.formData2.fieldName=row.fieldName;
      this.formData2.campusFieldId=row.campusFieldId;
      this.formData2.hubsn=row.hubsn.split(",");
    },
    handleClick(row,status){
			let obj={
				0:()=>{
					this.edit(row)
				},
				1:()=>{
					this.setStatus(row,1)
				},
				2:()=>{
					this.setStatus(row,0)
				},
				3:()=>{
					this.delete(row)
				},
				4:()=>{
					this.find(row)
				}
			}
			obj[status]();
    },
    setStatus(row,status){
			baseFn.call(this,{
				path:"campus_field/edit",
				data:{
					campusFieldId:row.campusFieldId,
					status:status
				}
			})
    },
    delete(row){
			baseFn.call(this,{
				path:"campus_field/delete",
				data:{
					campusFieldId:row.campusFieldId,
				}
			})
		},
    addForm(){
      let formData=clone(this.formData1);
      formData.campusId=this.$route.query.campusId;
      formData.hubsn=formData.hubsn.toString();
      this.$refs["formData1"].validate((valid) => {
          if (valid) {
            this.$axios.post({
              url:baseURL+"campus_field/add",
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
      formData.hubsn=formData.hubsn.toString();
      this.$refs["formData2"].validate((valid) => {
          if (valid) {
            this.$axios.post({
              url:baseURL+"campus_field/edit",
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
          campusId:this.$route.query.campusId,
          initial:1,
          ...this.searchData
        });
        this.$axios.post({
            url: baseURL + "campus_field/find_paging",
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

<style lang="scss" scoped>
  .textarea{
    width: 300px;
  }
</style>
