<template>
	<div class="card">
		 <TableSearch ref="table" :colConfigs="colConfigs" @sortChange="sortChange">
			<el-button round size="small" @click="add" class="add" slot="add" v-if="getFourRoleArr('card/addCard')">{{$t('card.add')}}</el-button>
            <el-table-column
            label="操作"
            width="400"
            slot="opt"
            >
            <template slot-scope="{row}">
                 <el-button @click="handleClick(row,4)" v-if="getFourRoleArr('card/cardDetail')" size="mini">{{$t('table.viewDetail')}}</el-button> 
				<el-button @click="handleClick(row,0)" size="mini" v-if="getFourRoleArr('card/editCard')">{{$t('table.edit')}}</el-button>
				<el-button @click="handleClick(row,1)" size="mini" v-if="getFourRoleArr('card/stop')&&row.status==='0'">{{$t('table.startUse')}}</el-button>
                <el-button @click="handleClick(row,2)" size="mini" v-else-if="getFourRoleArr('card/stop')&&row.status==='1'" >{{$t('table.stopUse')}}</el-button>
				<el-button type="danger" :disabled="row.status==='1'" v-if="getFourRoleArr('card/delete')" @click="handleClick(row,3)" size="mini">{{$t('table.delete')}}</el-button>
            </template>
            </el-table-column>
        </TableSearch>
	</div>
</template>
<script>
import TableSearch from "common/TableSearch";
import {baseFn} from "assets/js/reused";
export default {
	name: 'card',
	components:{
		TableSearch
	},
	data () {
		return{
			searchValue:[],
			goodsCategoryData:[],
			colConfigs:[
				{ prop: 'cardName', label: this.$t('card.cardName')},
				{ prop: 'cardTypeDisplay', label: this.$t('card.cardTypeDisplay') },
				{ prop: 'salesAmount', label: this.$t('card.salesAmount') },
				{ prop: 'useDay', label: this.$t('card.useDay') },
                { prop:'statusDisplay',label:this.$t('card.statusDisplay')},
				{ prop:'updateBy',label:this.$t('card.updateBy')},
				{ prop:'updateDt',label:this.$t('card.updateDt')},
				// 模版中的元素需要对应的有 slot="opt" 属性
				{ slot: 'opt'}
			],
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
					initial:1,
                    ...this.searchData
                    });
                    this.$axios.post({
                    url: baseURL + "card/find_paging",
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
					this.viewDetail(row)
				}
			}
			obj[status]();
		},
		add(){
			this.$store.commit("addTabAndActive", {
				url: "/card/addCard"
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
		},
		edit(row){
			this.$store.commit("addTabAndActive", {
				url: "/card/editCard",
				data:{
					cardId:row.cardId
				}
			});
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
.coupon {
};
</style>