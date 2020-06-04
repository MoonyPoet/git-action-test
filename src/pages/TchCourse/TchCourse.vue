<template lang='html'>
    <div>
        <TableSearch ref="table"
                     :colConfigs="colConfigs">
            <el-button @click="add" round size="small" class="add" v-if="getFourRoleArr('student/addStudent')"
                       slot="add">{{$t('tchCourse.addCourse')}}
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
                    {prop:"courseName",label:this.$t('tchCourse.courseNameLabel')},
                    {prop:"trainName",label:this.$t('tchCourse.trainNameLabel')},
                    {prop: 'trainLevelName', label: this.$t('tchCourse.trainLevelNameLabel')},
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
                        url: baseURL + "tch_course/find_paging",
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
                            url: "/tchCourse/detailTchCourse",
                            data:{
                                tchCourseId:row.tchCourseId
                            }
                        });
                    }
                }
                obj[status]();
            },
            add(){
                this.$store.commit("addTabAndActive", {
                    url: "/tchCourse/addTchCourse"
                });
            },
            edit(row){
                this.$store.commit("addTabAndActive", {
                    url: "/tchCourse/editTchCourse",
                    data:{
                        tchCourseId:row.tchCourseId
                    }
                });
            },
            setStatus(row,status){
                baseFn.call(this,{
                    path:"tch_course/edit",
                    data:{
                        tchCourseId:row.tchCourseId,
                        status:status
                    }
                })
            },
            delete(row){
                baseFn.call(this,{
                    path:"tch_course/delete",
                    data:{
                        stuId:row.stuId
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