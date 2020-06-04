<template lang='html'>
     <el-button class="add" size="small" round @click="addType()"><solt></solt></el-button>
</template>
<script>
export default {
  name: "AddButton",
  props:{
    url:{
        type:String,
        default:""
    },
    data:{
        type:Object,
        default:{}
    }
  },
  methods:{
    addType(){
        this.$store.commit("addTabAndActive", {
            url: this.url,
            data:this.data
        });
    }
  }
};
</script>