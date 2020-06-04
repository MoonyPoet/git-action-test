<template lang='html'>
    <div>
        <TableSearch ref="table"
                     :colConfigs="colConfigs">
            <el-button @click="add" round size="small" class="add" v-if="getFourRoleArr('student/addStudent')"
                       slot="add">{{$t('tchTask.addTask')}}
            </el-button>
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
import {baseFn} from "assets/js/reused";
     export default {
        name: 'tchCourse',
        components:{
            TableSearch
        },
        data () {
            return{
                 colConfigs: [
                    {type:"index"},
                    {prop:"taskName",label:this.$t('tchTask.taskNameLabel')},
                    {prop:"trainName",label:this.$t('tchTask.trainNameLabel')},
                    {prop:'statusDisplay',label:this.$t('table.status')},
                    {prop: 'updateBy', label: this.$t('table.updateBy')},
                    {prop: 'updateDt', label: this.$t('table.updateDt')},
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
                        limit: this.$refs.table.getLimit(),
                        offset: this.$refs.table.getOffset(),
                        stuId:this.$route.query.stuId,
                        initial: 1
                    });
                    this.$axios.post({
                        url: baseURL + "tch_task/find_paging",
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
            setSore(){
                this.$refs.addScore.show()
            },
            getSubmitStatus(){
                this.getTableData()
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
                            url: "/tchTask/detailTchTask",
                            data:{
                                tchTaskId:row.tchTaskId
                            }
                        });
                    }
                }
                obj[status]();
            },
            add(){
                this.$store.commit("addTabAndActive", {
                    url: "/tchTask/addTchTask"
                });
            },
            edit(row){
                this.$store.commit("addTabAndActive", {
                    url: "/tchTask/editTchTask",
                    data:{
                        tchTaskId:row.tchTaskId
                    }
                });
            },
            setStatus(row,status){
                baseFn.call(this,{
                    path:"tch_task/edit",
                    data:{
                        tchTaskId:row.tchTaskId,
                        status:status
                    }
                })
            },
            delete(row){
                baseFn.call(this,{
                    path:"tch_task/delete",
                    data:{
                        tchTaskId:row.tchTaskId
                    }
                })
            },
        }
    }
</script>
<style>
.searchBottom{
    padding-bottom: 20px;
    display: block;
}
</style>