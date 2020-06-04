<template lang='html'>
    <TableSearch ref="table" :isOptions="true"
                     :colConfigs="colConfigs">
        </TableSearch>
</template>
<script>
import TableSearch from "common/TableSearch";
     export default {
        name: 'followRecord',
        components:{
            TableSearch
        },
        data () {
            return{
                 colConfigs: [
                    {type: "index"},
                    {prop: 'followDt', label: this.$t('followRecord.followDt')},
                    {prop: 'memberName', label: this.$t('followRecord.memberName')},
                    {prop: 'des', label: this.$t('followRecord.des')},
                    {prop: 'updateBy', label: this.$t('table.updateBy')}
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
                        initial: 1
                    });
                    this.$axios.post({
                        url: baseURL + "studentfollow/find_paging",
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