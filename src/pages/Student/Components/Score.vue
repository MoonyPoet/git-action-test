<template lang='html'>
    <div>
        <TableSearch ref="table" :isOptions="true"
                     :colConfigs="colConfigs">
            <el-button @click="setSore" round size="small" class="add" v-if="getFourRoleArr('student/addStudent')"
                       slot="add">{{$t('score.setScore')}}
            </el-button>
            <span slot="searchBottom" class="searchBottom">{{$t('score.curScoreBalance')}}: {{score}}</span>
        </TableSearch>
        <AddScore ref="addScore" @isSubmit="getSubmitStatus"></AddScore>
    </div>
</template>
<script>
import TableSearch from "common/TableSearch";
import AddScore from "./AddScore.vue";
     export default {
        name: 'score',
        components:{
            TableSearch,
            AddScore
        },
        data () {
            return{
                 colConfigs: [
                    {type:"index"},
                    {prop:"scoreType",label:this.$t('score.scoreTypeLabel')},
                    {prop:"val",label:this.$t('score.valLabel')},
                    {prop: 'remark', label: this.$t('score.remarkLabel')},
                    {prop: 'updateBy', label: this.$t('table.updateBy')},
                    {prop: 'updateDt', label: this.$t('table.updateDt')},
                    // 模版中的元素需要对应的有 slot="opt" 属性
                ],
                score:null
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
                        url: baseURL + "student/stu_score_find_paging",
                        data: obj,
                        success: res => {
                            this.$refs.table.setTableData(res.data.rows);
                            this.$refs.table.setTotalAll(res.data.count);
                            this.$refs.table.setSearchData(res.data.search);
                            this.score=res.data.score;
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
        }
    }
</script>
<style>
.searchBottom{
    padding-bottom: 20px;
    display: block;
}
</style>