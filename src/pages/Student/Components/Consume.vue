<template lang='html'>
    <TableSearch ref="table" :isHasSearch="false"
                     :colConfigs="colConfigs">
        </TableSearch>
</template>
<script>
import TableSearch from "common/TableSearch";
     export default {
        name: 'consume',
        components:{
            TableSearch
        },
        data () {
            return{
                 colConfigs: [
                    {type:"index"},
                    {prop: 'eclsFromTypeDisplay', label: this.$t('consume.eclsFromTypeLabel')},
                    {prop: 'changeVal', label: this.$t('consume.changeVal')},
                    {prop: 'remainVal', label: this.$t('consume.remainVal')},
                    {prop: 'createDt', label: this.$t('consume.createDt')}
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
                        url: baseURL + "record/ecls_find_paging",
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