<template>
	<div class="campus">
		 <TableSearch ref="table" :colConfigs="colConfigs" @sortChange="sortChange">
			<el-button @click="add" round size="small" class="add" slot="add" v-if="getFourRoleArr('campus/addCampus')">{{$t('campus.addCampusLabel')}}</el-button>
            <el-table-column
            :label="$t('table.operations')"
            width="400"
            slot="opt"
            >
            <template slot-scope="{row}">
				<el-button @click="handleClick(row,4)" v-if="getFourRoleArr('campus/detailCampus')" size="mini">{{$t('table.viewDetail')}}</el-button>
                <el-button @click="handleClick(row,0)" v-if="getFourRoleArr('campus/editCampus')" size="mini">{{$t('table.edit')}}</el-button>
				<el-button @click="handleClick(row,1)" size="mini" v-if="getFourRoleArr('campus/stop')&&row.status==='0'">{{$t('table.startUse')}}</el-button>
                <el-button @click="handleClick(row,2)" size="mini" v-else-if="getFourRoleArr('campus/stop')&&row.status==='1'" >{{$t('table.stopUse')}}</el-button>
				<el-button type="danger" :disabled="row.status==='1'" v-if="getFourRoleArr('campus/delete')" @click="handleClick(row,3)" size="mini">{{$t('table.delete')}}</el-button>
            </template>
            </el-table-column>
        </TableSearch>
	</div>
</template>
<script>
import TableSearch from "common/TableSearch";
import {baseFn} from "assets/js/reused";
export default {
	name: 'campus',
	components:{
		TableSearch
	},
	data () {
		return{
			goodsCategoryData:[],
			colConfigs:[
				{ prop: 'campusName', label:this.$t('campus.campusNameLabel')},
				{ prop: 'contackName', label: this.$t('campus.contackNameLabel') },
				{ prop: 'contackPhone', label: this.$t('campus.contackPhoneLabel') },
				{ prop:'statusDisplay',label:this.$t('table.status')},
				{ prop:'updateBy',label:this.$t('table.updateBy')},
				{ prop:'updateDt',label:this.$t('table.updateDt')},
				// 模版中的元素需要对应的有 slot="opt" 属性
				{ slot: 'opt' }
			],
		}
	},
	methods:{
		getTableData(v) {
                //table 数据
                return new Promise((resolve, reject) => {
                    let obj = Object.assign(v == undefined ? {} : v, {
                    limit:this.$refs.table.getLimit(),
					offset:this.$refs.table.getOffset(),
				    initial:1
                    });
                    this.$axios.post({
                    url: baseURL + "campus/find_paging",
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
					this.find(row)
				}
			}
			obj[status]();
		},
		add(){
			this.$store.commit("addTabAndActive", {
				url: "/campus/addCampus"
			});
		},
		edit(row){
			this.$store.commit("addTabAndActive", {
				url: "/campus/editCampus",
				data:{
					campusId:row.campusId
				}
			});
		},
		find(row){
			this.$store.commit("addTabAndActive", {
				url: "/campus/detailCampus",
				data:{
					campusId:row.campusId
				}
			});
		},
		setStatus(row,status){
			baseFn.call(this,{
				path:"campus/edit",
				data:{
					campusId:row.campusId,
					status:status
				}
			})
		},
		delete(row){
			baseFn.call(this,{
				path:"campus/delete",
				data:{
					campusId:row.campusId
				}
			})
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
.campus {
};
</style>