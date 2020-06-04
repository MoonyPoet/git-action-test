<template>
	<div class="potentialStudent">
		 <TableSearch ref="table" 
		 	:colConfigs="colConfigs" 
		 	:upLoadAuth="true"
			:uploadFormat="uploadFormat"
			@uploadCall="uploadCall"
			@upload="upload"
			@sortChange="sortChange"
			@downLoadExcel="downLoadExcel"
			downloadHref="/manage/download/importPotentialStudent.xlsx"
			uploadExcelUrl="student/pot_stu_import"
			:exportAuth="true">
			<el-button @click="add" round size="small" class="add"  v-if="getFourRoleArr('potentialStudent/addPotentialStudent')" slot="add">{{$t('student.addStudent')}}</el-button>
			<template slot="upload">
				<div class="row">
                      <div class="title pull_left"><span>{{$t('student.cityLabel')}}:</span></div>
                      <div class="pull_left">
                       <SelectOpt :width="150" size="mini" v-model="formData.areaId" @change="(v)=>getAreaId(v,'campusIds')" ref="areaId" :data="codeData.area" :placeholder="$t('student.city')"></SelectOpt>
                      </div>
                </div>
				<div class="row">
                      <div class="title pull_left"><span>{{$t('student.campusIdLabel')}}:</span></div>
                      <div class="pull_left">
                        <SelectOpt :width="150" size="mini" v-if="formData.areaId!==''" v-model="formData.campusId" ref="campusIds" :data="campusData" :placeholder="$t('student.campusId')"></SelectOpt>
                      </div>
                </div>
			</template>
			<el-table-column
            :label="$t('table.operations')"
            width="400px"
            slot="opt"
            >
            <template slot-scope="{row}">
				<el-button @click="handleClick(row,4)" v-if="getFourRoleArr('potentialStudent/detailPotentialStudent')" size="mini">{{$t('table.viewDetail')}}</el-button>
                <el-button @click="handleClick(row,0)" v-if="getFourRoleArr('potentialStudent/editPotentialStudent')" size="mini">{{$t('table.edit')}}</el-button>
				<el-button @click="handleClick(row,1)" size="mini" v-if="getFourRoleArr('potentialStudent/stop')&&row.status==='0'">{{$t('table.startUse')}}</el-button>
                <el-button @click="handleClick(row,2)" size="mini" v-else-if="getFourRoleArr('potentialStudent/stop')&&row.status==='1'" >{{$t('table.stopUse')}}</el-button>
				<el-button type="danger" :disabled="row.status==='1'" v-if="getFourRoleArr('potentialStudent/delete')" @click="handleClick(row,3)" size="mini">{{$t('table.delete')}}</el-button>
            </template>
            </el-table-column>
        </TableSearch>
	</div>
</template>
<script>
import TableSearch from "common/TableSearch";
import {baseFn,getCode} from "assets/js/reused";
import SelectOpt from "common/SelectOpt";
import {campusFind1} from "assets/js/mixin";
export default {
	name: 'addPotentialStudent',
	mixins:[campusFind1],
	components:{
		TableSearch,
		SelectOpt
	},
	data () {
		return{
			colConfigs:[
				{ prop: 'stuName', label:this.$t('student.stuNameLabel')},
				{ prop: 'tel', label: this.$t('student.telLabel')},
				{ prop: 'crmStageDisplay',label:this.$t('student.crmStageLabel')},
				{ prop: 'crmSourceDisplay',label:this.$t('student.crmSourceLabel')},
				{ prop: 'followMemberName',label:this.$t('student.followMemberIdLabel')},
				{ prop: 'statusDisplay',label:this.$t('table.status')},
				{ prop: 'followDt',label:this.$t('student.followDtLabel')},
				{ prop:'updateBy',label:this.$t('table.updateBy')},
				{ prop:'updateDt',label:this.$t('table.updateDt')},
				// 模版中的元素需要对应的有 slot="opt" 属性
				{ slot: 'opt' }
			],
			uploadFormat:{
				"学员名称": {
					key: "studentName"
				},
				"性别": {
					key: "sex"
				},
				"联系电话": {
					key: "tel"
				},
				"出生日期": {
					key: "birthDate"
				},
				"客户来源": {
					key: "sourceCrmtagName"
				},
				"销售": {
					key: "saleMemberName"
				},
				"错误信息":{
					key:"errMsg"
				}
			},
			codeData:{},
			formData:{}
		}
	},
	created(){
		this.init()
	},
	methods:{
		async init(){
			this.codeData=await getCode("campus,_sex,_crm_stage,_crm_source")
		},
		getTableData(v) {
                //table 数据
			return new Promise((resolve, reject) => {
				let obj = Object.assign(v == undefined ? {} : v, {
				limit:this.$refs.table.getLimit(),
				offset:this.$refs.table.getOffset(),
				initial:1
				});
				this.$axios.post({
				url: baseURL + "student/pot_stu_find_paging",
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
					this.$store.commit("addTabAndActive", {
						url: "/potentialStudent/detailPotentialStudent",
						data:{
							stuId:row.stuId
						}
					});
				}
			}
			obj[status]();
		},
		add(){
			this.$store.commit("addTabAndActive", {
				url: "/potentialStudent/addPotentialStudent"
			});
		},
		edit(row){
			this.$store.commit("addTabAndActive", {
				url: "/potentialStudent/editPotentialStudent",
				data:{
					stuId:row.stuId
				}
			});
		},
		setStatus(row,status){
			baseFn.call(this,{
				path:"student/stu_status",
				data:{
					stuId:row.stuId,
					status:status
				}
			})
		},
		delete(row){
			baseFn.call(this,{
				path:"student/delete",
				data:{
					stuId:row.stuId
				}
			})
		},
		async downLoadExcel(down){
			let excelData=await post("student/generateexcelforpotstu");
			down(excelData)
		},
		upload(data,call){
			 if(this.formData.campusId===''){
				this.$alert("校区必选", "错误提示", {
				confirmButtonText: "确定"
				});
				return
			}
			call({
				students:data,
				campusId:this.formData.campusId
			})
		},
		uploadCall(v,download,close) {
			if (v.status === '1') {
				if(v.data.data.length===0){
				this.$message({
					message: v.message,
					type: "success"
				});
				close();
				}else{
				this.$confirm(v.data.message, this.$t("components.tips"), {
					confirmButtonText:this.$t("components.confirm"),
					cancelButtonText: this.$t("components.cancel"),
					type: 'warning'
				}).then(() => {
					download(Object.keys(this.uploadFormat),v.data.data)
				}).catch(() => {
					this.$message({
					type: 'info',
					message: this.$t('components.cancel')
					});          
				});
				}
			} else if (v.status === '0') {
				this.$alert(v.message,this.$t("components.errTips"), {
				confirmButtonText: this.$t("components.confirm"),
				callback: action => {}
				});
			}
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
            }
	}
};
</script>
<style lang="scss" scoped>
.potentialStudent{
	.title{
		padding-top: 8px;
		margin-right:10px;
	}
	.title+.pull_left>span{
		line-height: 32px;
	}
	.row{
		display: block;
		height: 34px;
	}
}
</style>