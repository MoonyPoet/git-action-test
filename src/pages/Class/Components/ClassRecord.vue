<template>
	<div class="class_record">
		 <TableSearch ref="table" :colConfigs="colConfigs" :isOptions="true" :isHasSearch="false">
			  <!-- <el-table-column
                    :label="$t('classRecord.stuNum')"
                    width="250px"
                    slot="stuNum"
            >
                <template slot-scope="{row}"> 
					<el-popover
					    v-if="row.clasHourStuActs.length>0"
						placement="right"
						title="缺课学员"
						width="200"
						trigger="hover"
						>
						<el-row>
							<el-row v-for="item in row.clasHourStuActs" :key="item.id">
								<el-col :span="7"> <ImageBar :load="item.headImg" :fail='classImg' width="50" height="50" class="student_avatar"></ImageBar></el-col>
								<el-col :span="7" style="line-height:50px;">{{item.stuName}}</el-col>
								<el-col :span="10" style="line-height:50px;">{{item.remainVal}}{{$t('unit.cardVal')}}</el-col>
							</el-row>
						</el-row>
						<i class="el-icon-warning icon" slot="reference"></i>
					</el-popover>
				
                </template>
            </el-table-column> -->
			<el-table-column
                    label="上课日期"
                    width="250px"
                    slot="day"
            >
                <template slot-scope="{row}">
					{{row.day}} {{row.stuTime}}-{{row.endTime}}
                </template>
            </el-table-column>
        </TableSearch>
	</div>
</template>
<script>
import TableSearch from "common/TableSearch";
import {baseFn} from "assets/js/reused";
import ImageBar from 'common/ImageBar';
import classImg from "assets/img/student.png"
export default {
	name: 'card',
	components:{
		TableSearch,
		ImageBar
	},
	data () {
		return{
			searchValue:[],
			goodsCategoryData:[],
			colConfigs:[
				{ slot: 'day'},
				{ prop: 'fieldName', label: this.$t('class.campusFieldIdLabel')},
				{ prop:'tryclsNum',label:'试课人数'},
				{ prop:'csmclsNum',label:'消课人数'},
				{ prop:'csmclsVal',label:'消课数'},
				{ prop:'deductVal',label:'扣课数'},
				{ prop:'csmclsAmount',label:'消课金额'},
				{prop:'clasHourStatusDisplay',label:'排课状态'},
				{ prop:'startTime',label:'上课数量'}
				// 模版中的元素需要对应的有 slot="opt" 属性
			],
			classImg:classImg,
		    formData:{}
		}
	},
	methods:{
		getTableData(v) {
				//table 数据
                return new Promise((resolve, reject) => {
                    let obj = Object.assign(v == undefined ? {} : v, {
                    limit:this.$refs.table.getLimit(),
					offset:this.$refs.table.getOffset(),
					dayLte:Date.parse(new Date())/1000,
					clasId:this.$route.query.clasId,
					initial:1,
                    ...this.searchData
                    });
                    this.$axios.post({
                    url: baseURL + "clashour/find_paging",
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
					this.viewDetail(row)
				}
			}
			obj[status]();
		},
		add(){
			this.$store.commit("addTabAndActive", {
				url: "/card/add"
			});
		},
		viewDetail(row){
			this.$store.commit("addTabAndActive", {
				url: "/card/cardDetail",
				data:{
					cardId:row.cardId
				}
			});
		},
		setStatus(row,status){
			baseFn.call(this,{
				path:"card/edit",
				data:{
					cardId:row.cardId,
					status:status
				}
			})
		},
		delete(row){
			baseFn.call(this,{
				path:"card/delete",
				data:{
					cardId:row.cardId
				}
			})
		}
	}
};
</script>
<style lang="scss" scoped>
.icon{
	color: red;
}
</style>