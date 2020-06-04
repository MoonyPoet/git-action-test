<template lang='html'>
    <el-button @click="back">返回</el-button>
</template>
<script>
     export default {
        name: 'BackButton',
        methods:{
            back(){
                this.$store.commit("deleteTabAndGo")
            }
        }
    }
</script>
<style scoped>
    
</style>