<template>
	<div class="card">
		<FilterOptions ref="filterBar"  @searchData="getTableData">
        </FilterOptions>
         <TableBar ref="table" :data="tableData" :colConfigs="colConfigs">
        </TableBar>
        <Pagination
            ref="pagination"
            :pageNum="totalAll"
            :size="limit"
            v-on:currentPage="getCurrentPage"
            v-on:currentPageSize="getCurrentPageSize"
            ></Pagination>
            </div>
</template>
<script>
import FilterOptions from "common/FilterOptions";
import Pagination from "common/Pagination";
import TableBar from "common/TableBar";
import {baseFn} from "assets/js/reused";
export default {
	name: 'tchrStatistics',
	components:{
        FilterOptions,
        TableBar,
        Pagination
	},
	data () {
		return{
			colConfigs:[
				{ prop: 'memberName', label:"教练姓名"},
                { prop: 'signStuNumSum', label: "已上课学员"},
				{ prop: 'stuNumSum', label:"学员上课率" },
				{ prop: 'csmclsValSum', label: "课次消课数" },
                { prop:'csmclsAmountSum',label:"消课数金额(元)"}
				// 模版中的元素需要对应的有 slot="opt" 属性
            ],
            offset: 0,
            limit: 10,
            totalAll: 10,
            tableData:[],
		}
    },
    created(){
        this.getTableData()
    },
	methods:{
		getTableData(v) {
				//table 数据
                return new Promise((resolve, reject) => {
                    let obj = Object.assign(v == undefined ? {} : v, {
                    limit:this.limit,
					offset:this.offset,
					initial:1,
                    ...this.searchData
                    });
                    this.$axios.post({
                    url: baseURL + "statistics/tchr_clas",
                    data: obj,
                    success: res => {
						this.sourceData=res.data.rows;
						this.$nextTick(()=>{
							this.$refs.filterBar.setSearchData(res.data.search);
                        	this.setTablePagination();
						});
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
        setTablePagination(){
            let list=this.sourceData;
            let end=this.limit+this.offset;
            this.tableData=list.slice(this.offset,end);
            this.totalAll = list.length;
        },
        getCurrentPage(v) {
            //切换页码时会触发
            this.offset = v == 1 ? 0 : (v - 1) * this.limit;
            // this.getTableData();
            this.setTablePagination();
            },
        getCurrentPageSize(v) {
            this.limit = v;
            // this.getTableData();
            this.setTablePagination();
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