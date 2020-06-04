<template>
  <div class="fixed-table">
      <div style="margin-bottom:20px;">
      </div>
     <TableSearch ref="table" :colConfigs="colConfigs" @sortChange="sortChange">
        <el-button @click="addCampusAnt" class="add" slot="add" round size="small">新增校区手环</el-button>
            <el-table-column
            :label="$t('table.operations')"
            width="400"
            slot="opt"
            >
            <template slot-scope="{row}">
                <el-button @click="handleClick(row,0)" size="mini">{{$t('table.edit')}}</el-button>
			        	<el-button @click="handleClick(row,1)" size="mini" v-if="row.status==='0'">{{$t('table.startUse')}}</el-button>
                <el-button @click="handleClick(row,2)" size="mini" v-else >{{$t('table.stopUse')}}</el-button>
			        	<el-button type="danger" :disabled="row.status==='1'" @click="handleClick(row,3)" size="mini">{{$t('table.delete')}}</el-button>
            </template>
            </el-table-column>
        </TableSearch>
      <el-dialog
      :title="$t('form.edit')"
      :visible.sync="dialogVisible2"
      width="600px"
      center
      >
      <el-form ref="formData2" :rules="rules" :model="formData2" label-width="100px" label-position="left">
        <el-form-item label="校区" prop="campusId">
             <SelectOpt v-model="formData2.campusId" ref="campusId" :data="codeData.campusId"></SelectOpt>
            </el-form-item>
         <el-form-item label="手环包" prop="antboxsn">
              <el-input v-model="formData2.antboxsn" placeholder="请输入手环包"></el-input>
            </el-form-item>
            <el-form-item label="手环ID" prop="antsn">
                <el-input v-model="formData2.antsn" placeholder="请输入手环ID"></el-input>
            </el-form-item>
            <el-form-item label="手环编号" prop="antno">
                <el-input v-model="formData2.antno" placeholder="请输入手环编号"></el-input>
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
import {debounce,getCodeData,selectDefaultData,isEmpty,clone,getCookie,getCode,bindData} from 'assets/js/reused';
import {baseFn} from "assets/js/reused";
import SelectOpt from "common/SelectOpt";
  export default {
  components: {TableSearch,SelectOpt},
  name: 'campusAnt',
  props:{
    newObj:Object,
    searchLike:String
  },
  data() {
    return {
        searchValue:[],
			goodsCategoryData:[],
			colConfigs:[
        { prop: 'antboxsn', label:"手环包"},
        { prop: 'antsn', label:"手环ID"},
        { prop: 'antno', label:"手环编号"},
        { prop:'statusDisplay',label:this.$t('table.status')},
				{ prop:'updateDt',label:this.$t('table.updateDt')},
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
        fieldName:"",
      },
      formData2:{
        campusAntId:null,
        campusId:null,
        antboxsn:null,
        antsn:null,
        antno:null
      },
      codeData:{},
     dialogVisible2:false,
     dialogVisible1:false,
     rules:{
        campusId:[
          {required:true,trigger:"change",message:this.$t("form.required")}
        ],
        antboxsn:[
          {required:true,trigger:"blur",message:this.$t("form.required")}
        ],
        antsn:[
          {required:true,trigger:"blur",message:this.$t("form.required")}
        ],
        antno:[{required:true,trigger:"blur",message:this.$t("form.required")}]
      },
    }
  },
  created(){
  },

  methods: {
    addCampusAnt(){
      this.$store.commit("addTabAndActive", {
				url: "/campus/addCampusAnt"
			});
    },
    async find(campusAntId){
      return await post("campus_ant/find",{
        campusAntId
      });
    },
    async edit(row){
      this.codeData=await getCode("campus");
      let data=await this.find(row.campusAntId);
      this.dialogVisible2=true;
       bindData({
        formData:this.formData2,
        res:data
      });
    },
    handleClick(row,status){
			let obj={
				0:()=>{
					this.edit(row);
				},
				1:()=>{
					this.setStatus(row,1);
				},
				2:()=>{
					this.setStatus(row,0);
				},
				3:()=>{
					this.delete(row);
				},
				4:()=>{
					this.find(row);
				}
			}
			obj[status]();
    },
    setStatus(row,status){
			baseFn.call(this,{
				path:"campus_ant/edit",
				data:{
					campusAntId:row.campusAntId,
					status:status
				}
			})
    },
    delete(row){
			baseFn.call(this,{
				path:"campus_ant/delete",
				data:{
					campusAntId:row.campusAntId,
				}
			})
		},
    editForm(){
      let formData=clone(this.formData2);
      this.$refs["formData2"].validate((valid) => {
          if (valid) {
            this.$axios.post({
              url:baseURL+"campus_ant/edit",
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
            url: baseURL + "campus_ant/find_paging",
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
