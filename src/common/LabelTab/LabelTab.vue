<template lang='html'>
    <div class='container'>
    <el-tabs class="shadow" v-model="activeName"  type="border-card" @tab-click="changeTab">
        <el-tab-pane  name="student">
            <span slot="label">学员上课统计</span>
            <Student v-if="activeName==='student'" class="basic-container"  ></Student>
        </el-tab-pane>
         <el-tab-pane  name="teacher">
            <span slot="label">老师/教练上课统计</span>
            <Teacher v-if="activeName==='teacher'"  class="basic-container"  ></Teacher>
        </el-tab-pane>
        <el-tab-pane  name="comment">
            <span slot="label">点评统计</span>
            <RemarkOn v-if="activeName==='comment'"  class="basic-container"   ></RemarkOn>
        </el-tab-pane>
    </el-tabs>
    </div>
</template>
<script>
     export default {
        name: 'labelTab',
        data () {
            return{
                activeName: "student"
            }
        },
        watch: {
           activeName(newV, oldV) {
                this.$router.push({
                    path: this.$route.path,
                    query: { activeName: this.activeName }
                });
            }
        },
        created(){
            this.activeName =
                this.$route.query.activeName == undefined
                ? "student"
                : this.$route.query.activeName;
            this.$router.push({
                path: this.$route.path,
                query: { activeName: this.activeName }
            });
        },
        methods:{
            changeTab(v) {
                this.index=v.index;
            }
        }
    }
</script>
<style scoped>
    
</style>