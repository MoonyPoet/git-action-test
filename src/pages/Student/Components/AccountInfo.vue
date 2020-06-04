<template lang='html'>
    <div>
        <TableBar size="mini" :colConfigs="colConfigs" :data="accountData"></TableBar>
    </div>
</template>
<script>
    import TableBar from "common/TableBar";
     export default {
        components:{
            TableBar
        },
        name: 'accountInfo',
        data () {
            return{
                colConfigs:[
                    { type:"index"},
                    { prop: 'trainName', label: this.$t('accountInfo.trainLabel')},
                    { prop: 'remainVal',label:this.$t('accountInfo.remainValLabel')},
                    { prop: 'arrearStatus',label:'账户状态'},
                    { prop:'createDt',label:this.$t('accountInfo.startDt')},
                    { prop:'endDt',label:this.$t('accountInfo.endDt')},
                    // 模版中的元素需要对应的有 slot="opt" 属性
                    { slot: 'opt' }
                ],
                accountData:[]
            }
        },
        created(){
            this.getTableData()
        },
        methods:{
            getTableData(v) {
                //table 数据
                return new Promise((resolve, reject) => {
                    let obj ={
                        stuId:this.$route.query.stuId
                    };
                    this.$axios.post({
                        url: baseURL + "student/stu_act_find_paging",
                        data: obj,
                        success: res => {
                            this.accountData=res.data.rows;
                            resolve();
                        }
                    });
                });
                
            },
        }
    }
</script>
<style scoped>
    
</style>