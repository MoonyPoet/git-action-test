<template>
	<div class="position">
		 <TableSearch ref="table" :colConfigs="colConfigs" @sortChange="sortChange">
			<el-button @click="add" round size="small" class="add" v-if="getFourRoleArr('position/addPosition')" slot="add">{{$t('position.addPosition')}}</el-button>
            <el-table-column
            :label="$t('table.operations')"
            width="300px"
            slot="opt"
            >
            <template slot-scope="{row}">
                <el-button @click="handleClick(row,0)" v-if="getFourRoleArr('position/editPosition')" :disabled="row.status==='0'" size="mini">{{$t('table.edit')}}</el-button>
				<el-button @click="handleClick(row,1)" size="mini" v-if="getFourRoleArr('position/stop')&&row.status==='0'">{{$t('table.startUse')}}</el-button>
                <el-button @click="handleClick(row,2)" size="mini" v-else-if="getFourRoleArr('position/stop')&&row.status==='1'" >{{$t('table.stopUse')}}</el-button>
				<el-button type="danger" :disabled="row.status==='1'" v-if="getFourRoleArr('position/delete')" @click="handleClick(row,3)" size="mini">{{$t('table.delete')}}</el-button>
            </template>
            </el-table-column>
        </TableSearch>
	</div>
</template>
<script>
import TableSearch from "common/TableSearch";
import {baseFn} from "assets/js/reused";
export default {
	name: 'position',
	components:{
		TableSearch
	},
	data () {
		return{
			searchValue:[],
			goodsCategoryData:[],
			colConfigs:[
				{ prop: 'positionName', label:this.$t('position.positionNameLabel'),sortable:"custom",},
				{ prop: 'positionLevel', label: this.$t('position.positionLevelLabel') },
                { prop: 'parentPositionName',label: this.$t('position.parentPositionIdLabel')},
				{ prop: 'remark', label:  this.$t('position.remarkLabel') },
				{ prop: 'memberCount', label: this.$t('position.memberCountLabel') },
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
                    ...this.searchData
                    });
                    this.$axios.post({
                    url: baseURL + "pos/find_paging",
                    data: obj,
                    success: res => {
                        this.$refs.table.setTableData(res.data.rows);
                        this.$refs.table.setTotalAll(res.data.count);
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
				}
			}
			obj[status]();
		},
		add(){
			this.$store.commit("addTabAndActive", {
				url: "/position/addPosition"
			});
		},
		edit(row){
			this.$store.commit("addTabAndActive", {
				url: "/position/editPosition",
				data:{
					positionId:row.positionId
				}
			});
		},
		setStatus(row,status){
			baseFn.call(this,{
				path:"pos/pos_status",
				data:{
					positionId:row.positionId,
					status:status
				}
			})
		},
		delete(row){
			baseFn.call(this,{
				path:"pos/delete",
				data:{
					positionId:row.positionId
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
.position {
};
</style>