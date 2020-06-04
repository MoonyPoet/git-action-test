<template>
    <div class="campus">
        <TableSearch ref="table" :colConfigs="colConfigs" @sortChange="sortChange">
            <el-button round size="small" @click="add" class="add" slot="add" v-if="getFourRoleArr('member/addMember')">{{$t('member.addMemberLabel')}}</el-button>
           <el-table-column
            :label="$t('table.operations')"
            width="350px"
            slot="opt"
            >
            <template slot-scope="{row}">
                <el-button @click="handleClick(row,4)" v-if="getFourRoleArr('member/memberDetail')" size="mini">{{$t('table.viewDetail')}}</el-button> 
                <el-button @click="handleClick(row,0)" v-if="getFourRoleArr('member/editMember')" size="mini">{{$t('table.edit')}}</el-button>
                <el-button @click="handleClick(row,1)" size="mini" v-if="getFourRoleArr('member/stop')&&row.status==='0'">{{$t('table.startUse')}}</el-button>
                <el-button @click="handleClick(row,2)" size="mini" v-else-if="getFourRoleArr('member/stop')&&row.status==='1'">{{$t('table.stopUse')}}</el-button>
                <el-button @click="handleClick(row,3)" size="mini" type="danger"   v-if="getFourRoleArr('member/delete')" :disabled="row.status==='1'">{{$t('table.delete')}}</el-button>
            </template>
            </el-table-column>
        </TableSearch>
    </div>
</template>
<script>
    import TableSearch from "common/TableSearch";
    import {baseFn} from "assets/js/reused";

    export default {
        name: 'member',
        components: {
            TableSearch
        },
        data() {
            return {
                searchValue: [],
                goodsCategoryData: [],
                colConfigs: [
                    {prop: 'memberName',width:"150px", label: this.$t('member.memberNameLabel')},
                    {prop: 'sexDisplay', label: this.$t('member.sexLabel')},
                    {prop: 'tel', label: this.$t('member.telLabel')},
                    {prop: 'campusName', label: this.$t('member.campusNameLabel')},
                    {prop:'roleName',label:this.$t('member.roleIdLabel')},
                    {prop: 'birthDt', label:this.$t('member.birthDtLabel')},
                    {prop: 'statusDisplay', label:this.$t('table.status')},
                    {prop: 'updateBy', label: this.$t('table.updateBy')},
                    {prop: 'updateDt', label: this.$t('table.updateDt')},
                    // 模版中的元素需要对应的有 slot="opt" 属性
                    {slot: 'opt'}
                ],
            }
        },
        methods: {
            getTableData(v) {
                //table 数据
                return new Promise((resolve, reject) => {
                    let obj = Object.assign(v == undefined ? {} : v, {
                        limit: this.$refs.table.getLimit(),
                        offset: this.$refs.table.getOffset(),
                        ...this.searchData
                    });
                    this.$axios.post({
                        url: baseURL + "member/find_paging",
                        data: obj,
                        success: res => {
                            this.$refs.table.setTableData(res.data.rows);
                            this.$refs.table.setTotalAll(res.data.count);
                            resolve();
                        }
                    });
                });
            },
            handleClick(row, status) {
                let obj = {
                    0: () => {
                        this.edit(row)
                    },
                    1: () => {
                        this.setStatus(row, 1)
                    },
                    2: () => {
                        this.setStatus(row, 0)
                    },
                    3: () => {
                        this.delete(row)
                    },
                    4: () => {
                        this.viewDetail(row)
                    }
                }
                obj[status]();
            },
            add() {
                this.$store.commit("addTabAndActive", {
                    url: "/member/addMember"
                });
            },
            viewDetail(row){
                this.$store.commit("addTabAndActive", {
                    url: "/member/memberDetail",
                    data:{
                        memberId:row.memberId
                    }
                });
            },
            edit(row) {
                this.$store.commit("addTabAndActive", {
                    url: "/member/editMember",
                    data: {
                        memberId: row.memberId
                    }
                });
            },
            setStatus(row, status) {
                baseFn.call(this, {
                    path: "member/edit",
                    data: {
                        memberId: row.memberId,
                        status:status
                    }
                })
            },
            delete(row) {
                baseFn.call(this, {
                    path: "member/delete",
                    data: {
                        memberId: row.memberId,
                        status:status
                    }
                })
            },
            sortChange(obj) {
                if (obj.order === "descending") {
                    // this.getTableData({
                    //     sort:
                    // })
                } else {
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
    .member {
    }

    ;
</style>