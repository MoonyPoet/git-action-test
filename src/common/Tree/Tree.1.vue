<template lang='html'>
    <div class='container'>
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
         <div @click="open(element)">
             <div :style="{paddingLeft:element.list&&element.list.length>0?0:20+'px'}">
                <span v-show="showIcon(element.list)">
                    <i class="el-icon-caret-bottom" v-if="element.isClicked"></i>
                    <i class="el-icon-caret-top" v-else></i>
                </span>
                 {{ element.name }}
            </div>
         </div>
           <!-- group="people1" -->
         <draggable 
                :list="element.list"
                :disabled="!enabled"
                class="list-group"
                ghost-class="ghost1"
                :group="{name:'people1'}"
                @change="(evt)=>log(evt,list1)">
                <div
                 v-if="element.isClicked"
                class="list-group-item"
                v-for="(item,index) in element.list"
                :key="index"
                >
                    <div @click="open(item)" style="padding-left:20px;">
                         <div :style="{paddingLeft:item.list&&item.list.length>0?0:20+'px'}">
                            <span v-show="showIcon(item.list)">
                                <i class="el-icon-caret-bottom" v-if="item.isClicked"></i>
                                <i class="el-icon-caret-top" v-else></i>
                            </span>
                            {{ item.name }}
                        </div>
                    </div>
                    
                    <!-- group="people1" -->
                    <draggable 
                            :list="item.list"
                            :disabled="!enabled"
                            class="list-group"
                            ghost-class="ghost2"
                            :group="{name:'people2'}"
                            @change="(evt)=>log(evt,element.list)">
                            <div
                            v-if="item.isClicked"
                            class="list-group-item"
                            v-for="(label,index) in item.list"
                            :key="index"
                            >
                            <div style="padding-left:60px">
                               {{ label.name }}
                            </div>
                            </div>
                        </draggable>
                </div>
            </draggable>
          
        </div>
      </draggable>
      <treeItem></treeItem>
      <div>

      </div>
      <pre>{{ JSON.stringify(list1, null, 2) }}</pre>
    </div>
    
</template>
<script>
    import draggable from 'vuedraggable';
     export default {
        name: 'Tree',
        components:{
            draggable,
            treeItem:{
              data(){
                return {}
              },
              render(h){
                return (
                  <span>Hello</span>
                );
              },
              methods:{

              }
            }
        },
        data () {
            return{
                 list1: [
                    { name: "John1", id: 1,
                     isClicked:false,
                     list:[
                         { name: "tree1", id: 4,
                          isClicked:false,
                           list:[
                            { name: "tree5", id: 8 },
                            { name: "tree6", id: 9 },
                            { name: "tree7", id: 10 },
                            { name: "tree8", id: 11 },
                           ]
                         },
                         { name: "tree2", id: 5 ,
                          isClicked:false,
                             list:[
                            { name: "tree5", id: 12 },
                            { name: "tree6", id:13 },
                            { name: "tree7", id: 14 },
                            { name: "tree8", id: 15 },
                           ]
                         },
                         { name: "tree3", id: 6 ,
                          isClicked:false,
                            list:[
                            { name: "tree5", id: 16 },
                            { name: "tree6", id: 17 },
                            { name: "tree7", id: 18 },
                            { name: "tree8", id: 19 },
                           ]
                         },
                         { name: "tree4", id: 7 ,
                          isClicked:false,
                            list:[
                            { name: "tree5", id: 20 },
                            { name: "tree6", id: 21 },
                            { name: "tree7", id: 22 },
                            { name: "tree8", id: 23 },
                           ]
                         },
                     ]}
                    ,
                    { name: "Joa1o", id: 2 ,
                    isClicked:false,
                    list:[
                         { name: "tree5", id: 24 },
                         { name: "tree6", id: 25 },
                         { name: "tree7", id: 26 },
                         { name: "tree8", id: 27 },
                     ]},
                    { name: "Jean1", id: 3,
                     isClicked:false,
                     list:[]
                    }
                ],
                enabled:true
            }
        },
        methods:{
            open(element){
                element.isClicked=!element.isClicked;
            },
            showIcon(list){
                if(list&&list.length>0){
                    return true
                }
            },
            pullFunction(){

            },
            log(evt,list){
              if(evt.added){
                list.map((element)=>{
                    element.list.map((item)=>{
                        if(item.id===evt.added.element.id){
                            element.isClicked=true;
                        }
                    })
                })
              }
            }
        }
    }
</script>
<style scoped>
pre {
  text-align: start;
}
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
.ghost1 {
  opacity: 0.5;
  background: red;
}
</style>