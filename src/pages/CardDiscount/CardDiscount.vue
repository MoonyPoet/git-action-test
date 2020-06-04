<template>
	<div class="coupon">
		 <TableSearch ref="table" :colConfigs="colConfigs" @sortChange="sortChange">
			<el-button round size="small" @click="add" class="add" slot="add" v-if="getFourRoleArr('cardDiscount/addCardDiscount')">{{$t('cardDiscount.add')}}</el-button>
            <el-table-column
            :label="$t('table.operations')"
            width="400px"
            slot="opt"
            >
            <template slot-scope="{row}">
				<el-button @click="handleClick(row,4)" v-if="getFourRoleArr('cardDiscount/cardDiscountDetail')" size="mini">{{$t('table.viewDetail')}}</el-button> 
				<el-button @click="handleClick(row,1)" size="mini" v-if="getFourRoleArr('cardDiscount/stop')&&row.status==='0'">{{$t('table.startUse')}}</el-button>
                <el-button @click="handleClick(row,2)" size="mini" v-else-if="getFourRoleArr('cardDiscount/stop')&&row.status==='1'" >{{$t('table.stopUse')}}</el-button>
				<el-button type="danger" :disabled="row.status==='1'" v-if="getFourRoleArr('cardDiscount/delete')" @click="handleClick(row,3)" size="mini">{{$t('table.delete')}}</el-button>
            </template>
            </el-table-column>
        </TableSearch>
	</div>
</template>
<script>
import TableSearch from "common/TableSearch";
import {baseFn} from "assets/js/reused";
export default {
	name: 'CardDiscount',
	components:{
		TableSearch
	},
	data () {
		return{
			searchValue:[],
			goodsCategoryData:[],
			colConfigs:[
				{ prop: 'cardDiscountName', label: this.$t('cardDiscount.cardDiscountName')},
				{ prop: 'startDt', label: this.$t('cardDiscount.startTime') },
				{ prop: 'endDt', label: this.$t('cardDiscount.endTime') },
				{ prop:'statusDisplay',label: this.$t('table.status')},
				{ prop:'updateBy',label: this.$t('table.updateBy')},
				{ prop:'updateDt',label: this.$t('table.updateDt')},
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
                    url: baseURL + "card_discount/find_paging",
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
				},
				4:()=>{
					this.detail(row)
				}
			}
			obj[status]();
		},
		add(){
			this.$store.commit("addTabAndActive", {
				url: "/cardDiscount/addCardDiscount"
			});
		},
		detail(row){
			this.$store.commit("addTabAndActive", {
				url: "/cardDiscount/cardDiscountDetail",
				data:{
					cardDiscountId:row.cardDiscountId,
				}
			});
		},
		edit(row){
			this.$store.commit("addTabAndActive", {
				url: "/cardDiscount/editCardDiscount",
				data:{
					cardDiscountId:row.cardId
				}
			});
		},
		setStatus(row,status){
			baseFn.call(this,{
				path:"card_discount/edit",
				data:{
					cardDiscountId:row.cardDiscountId,
					status:status
				}
			})
		},
		delete(row){
			baseFn.call(this,{
				path:"card_discount/delete",
				data:{
					cardDiscountId:row.cardDiscountId
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
</style>