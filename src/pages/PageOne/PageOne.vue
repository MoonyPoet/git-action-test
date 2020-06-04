<template lang='html'>
    <TableSearch ref="table"
                     :colConfigs="colConfigs"
                     :upLoadAuth="false"
                     :isOptions="false"
                     :exportAuth="false">
            <el-table-column
                    :label="$t('table.operations')"
                    width="400px"
                    slot="opt"
            >
                <template slot-scope="{row}">
                    <el-button @click="handleClick(row,0)"
                               v-if="getFourRoleArr('potentialStudent/editPotentialStudent')" size="mini">
                        {{row.clasStatus==="0"?$t('student.stopClass'):$t('student.restartClass')}}
                    </el-button>
                    <el-button @click="handleClick(row,1)" size="mini">{{$t('student.groupOfClass')}}</el-button>
                    <el-button @click="handleClick(row,2)" size="mini" v-if="getFourRoleArr('student/detailStudent')">
                        {{$t('table.viewDetail')}}
                    </el-button>
                    <el-button @click="handleClick(row,3)"
                               v-if="getFourRoleArr('potentialStudent/detailPotentialStudent')" size="mini">
                        {{$t('student.placeOnfile')}}
                    </el-button>
                </template>
            </el-table-column>
        </TableSearch>
</template>
<script>
import TableSearch from "common/TableSearch";
     export default {
        name: 'cardPurchaseRecord',
        components:{
            TableSearch
        },
        data () {
            return{
                 colConfigs: [
                    {type:"index"},
                    {prop: 'cardName', label: this.$t('cardPurchaseRecord.cardName')},
                    {prop: 'receivableAmount', label: this.$t('cardPurchaseRecord.receivableAmount')},
                    {prop: 'cardTypeDisplay', label: this.$t('cardPurchaseRecord.cardType')},
                    {prop: 'receivedAmount', label: this.$t('cardPurchaseRecord.receivedAmount')},
                    {prop: 'receivedVal', label: this.$t('cardPurchaseRecord.receivedVal')},
                    {prop:'stuCardStatusDisplay',label:this.$t('cardPurchaseRecord.stuCardStatus')},
                    {prop: 'remark', label: this.$t('cardPurchaseRecord.remark')},
                    {prop:'opt'}
                    // 模版中的元素需要对应的有 slot="opt" 属性
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
                        url: baseURL + "record/card_find_paging",
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
        }
    }
</script>