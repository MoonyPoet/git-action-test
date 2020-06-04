<template lang='html'>
  <SearchBar
    :link="url" 
    :placeholder="placeholder" 
    :title="placeholder" 
    :nameLike.sync="name"
    :value="value"
    @value="setParentValue"
    @change="getSearchId"
  :pushCallback="pushCallbackFn"
  :searchOpt="searchOptFn"  
  :editSearchOpt="true" 
  :isRequired="false">
  </SearchBar>
</template>
<script>
    import SearchBar from "common/SearchBar";
     export default {
      name:"SearchItem",
      components:{
        SearchBar
      },
      props:{
        url:{
          type:String,
          default:""
        },
        placeholder:{
          type:String,
          default:""
        },
        value:{
          type:Number,
          default:null
        },
        searchKey:{
            type:String,
            default:"assVal"
        },
        display:{
            type:String,
            default:"display"
        },
        val:{
            type:String,
            default:"value"
        },
        nameLike:{
            type:String,
            default:""
        },
        otherSearchOpt:{
            type:Object,
            default:()=>{
              return {};
            }
        }
      },
      data(){
        return {
          name:""
        }
      },
      watch:{
         nameLike: {
                handler(newV, oldV) {
                  this.name=newV;
                },
                immediate: true,
                deep:true
            },
      },
      methods:{
        pushCallbackFn(note){
          return {
            value:note[this.display] ,//显示需要的
            id: note[this.val]
          }
        },
        searchOptFn(v){
          return {[this.searchKey]:v,...this.otherSearchOpt}
        },
        getSearchId(v){
          this.$emit("input",v);
          this.$emit("change",v);
          this.$nextTick(()=>{
            this.$emit("update:nameLike",this.name)
          })
        },
        setParentValue(v){
          this.$emit("input",v)
        }
      }
    }
</script>
<style scoped>
    
</style>