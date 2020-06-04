<template lang='html'>
    <div>
        <!-- <img src="/asstes/img/1.png" alt=""> -->
        <!-- <SearchMenu></SearchMenu> -->
        <!-- <SearchMultiple v-model="searchValue" 
            :bindOptions="{
            data:goodsCategoryData,
            key:'id',
            val:'display',
            placeholder:'选择一级分类'
        }">
        </SearchMultiple> -->
            <!-- 表格 -->
        <!-- <TableBar :data="tableData"
            :col-configs="colConfigs">
            <el-table-column slot="opt">
            <el-button size="mini" slot-scope="{ row }">查看</el-button>
            </el-table-column>
        </TableBar> -->
       <!-- <SearchBar link="ins/login_inst_find" :pushCallback="pushCallbackFn" :searchOpt="searchOptFn" :editSearchOpt="true"></SearchBar> -->
        <draggable
        :list="list"
        :disabled="true"
        class="list-group"
        ghost-class="ghost"
         :group="{ name: 'people', pull: 'clone', put: false }"
      >
        <div
          class="list-group-item"
          v-for="element in list"
          :key="element.id"
        >
          {{ element.name }}
        </div>
      </draggable>
      <br>
      <draggable
        :list="list1"
        :disabled="!enabled"
        class="list-group"
        ghost-class="ghost"
        group="people"
      >
        <div
          class="list-group-item"
          v-for="(element,index) in list1"
          :key="index"
        >
          {{ element.name }}
        </div>
      </draggable>
      <router-link to="/page/1">页面1</router-link>
      <button @click="submitForm">提交</button>
    </div>
</template>
<script>
import SearchBar from "common/SearchBar";
import draggable from 'vuedraggable'
     export default {
        name: 'PageOne',
        components:{
            SearchBar,
            draggable
        },
     
        data () {
            return{
                enabled: true,
                list: [
                    { name: "John", id: 0 },
                    { name: "Joao", id: 1 },
                    { name: "Jean", id: 2 }
                ],
                list1: [
                    { name: "John1", id: 0 },
                    { name: "Joa1o", id: 1 },
                    { name: "Jean1", id: 2 }
                ],
                dragging: false
            }
        },
         computed: {
            draggingInfo() {
            return this.dragging ? "under drag" : "";
            }
        },
        methods:{
            submitForm(){
                console.log(JSON.stringify(this.list))
                console.log(JSON.stringify(this.list1))
            }
        }
        // methods:{
        //    pushCallbackFn(element){
        //         return {
        //                 value:element.display ,//显示需要的
        //                 id: element.value
        //         }
        //    },
        //    searchOptFn(v){
        //        console.log(v)
        //        return {"keyword":"institution","instNameSuffixLike":v}
        //    }
        // }
    }
</script>
<style scoped>
    
</style>