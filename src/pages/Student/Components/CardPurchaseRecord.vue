<template lang='html'>
    <div>
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
                    <el-button v-if="row.stuCardStatus==='1'" @click="handleClick(row,0)"
                                size="mini">
                        {{$t('cardPurchaseRecord.makeUp')}}
                    </el-button>
                    <el-button v-if="row.stuCardStatus!=='2'" @click="handleClick(row,1)" size="mini">{{$t('cardPurchaseRecord.refund')}}</el-button>
                </template>
            </el-table-column>
        </TableSearch>
     <MakeUp ref="makeUp" @isSubmit="submit"></MakeUp>
     <Refund ref="refund" @isSubmit="submit"></refund>
    </div>
</template>
<script>

import TableSearch from "common/TableSearch";
import MakeUp from "./MakeUp";
import Refund from "./Refund";
     export default {
        name: 'cardPurchaseRecord',
        components:{
            TableSearch,
            MakeUp,
            Refund
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
                    {slot:'opt'}
                    // 模版中的元素需要对应的有 slot="opt" 属性
                ]
            }
        },
        methods:{
            submit(){
                this.getTableData();
            },
            handleClick(row, status) {
                let obj = {
                    0: () => {
                        this.$nextTick(()=>{
                            this.$refs.makeUp.show({stuCardId:row.stuCardId});
                        });
                    },
                    1: () => {
                        this.$nextTick(()=>{
                            this.$refs.refund.show({stuCardId:row.stuCardId});
                        });
                    }
                }
                obj[status]();
            },
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
            }
        }
    }
</script>