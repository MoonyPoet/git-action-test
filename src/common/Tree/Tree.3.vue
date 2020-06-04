<template lang='html'>
    <div class='container'>
      <treeItem :list="list1" :sourceList="list1" :enabled="enabled"></treeItem>
      <div>

      </div>
      <pre>{{ JSON.stringify(list1, null, 2) }}</pre>
    </div>
    
</template>
<script>
    import draggable from 'vuedraggable';
    import {isEmpty,clone} from "assets/js/reused";
    function checked(list,result){
      list.map((element)=>{
        element.checked=result;
        if(!isEmpty(element.list)){
          checked(element.list,result)
        }
      })
    }
    function checkedParent(list){
       list.map((element)=>{
        if(element.list&&element.list.length>0){
            console.log("TCL: checkedParent -> element.list.every((item)=>item.checked===true)", element.list.every((item)=>item.checked===true))
            console.log("TCL: checkedParent -> element.list", JSON.stringify(element.list))
          if(element.list.every((item)=>item.checked===true)){
            element.checked=true;
          }
          checkedParent(element.list)
        }
      })
    }
    function findParentId(item,sourceList){
      if(item.parentId&&sourceList&&sourceList.length>0){
        console.log(sourceList.every((element)=>element.id!==element.parentId))
        if(sourceList.every((element)=>element.id!==element.parentId)){
          sourceList.map((element)=>{
            findParentId(element,element.list);
          })
        }else{
          sourceList.map((element)=>{
            if(element.id===item.parentId){
              if(element.list.every((item)=>item.checked===true)){
                element.checked=true;
                if(element.parentId){

                }
              }
            }
          })
        }
      }
    }
     export default {
        name: 'Tree',
        components:{
            draggable,
            treeItem:{
              components:{
                draggable
              },
              name:"treeItem",
              componentName: 'treeItem',
              props:{
                list:{
                  type:Array,
                  default:function(){
                    return [];
                  }
                },
                enabled:{
                  type:Boolean,
                  default:true
                },
                isClicked:{
                  type:Boolean,
                  default:false
                },
                count:{
                  type:Number,
                  default:1
                },
                sourceList:{
                  type:Array,
                  default:function(){
                    return {}
                  }
                },
                root:{
                  type:Object,
                  default:function(){
                    return {}
                  }
                }
              },
              render(h){
                // style={{paddingLeft:element.list&&element.list.length>0?0:20+'px'}}
                // this.showIcon(element)
                if(this.count===1||this.isClicked){
                  return (
                   <draggable
                        list={this.list}
                        disabled={!this.enabled}
                        class={'list-group'}
                        ghost-class={'ghost'}
                        group={'people'+this.count}
                        onChange={(evt)=>this.log(evt,this.list)}
                      >
                      {
                        
                        this.list.map((element,index)=>{
                          return (<div class={'list-group-item'} key={index}>
                              <div onClick={() => this.open(element)}>
                                  <div style={{paddingLeft:20*(this.count-1)+'px'}}>
                                      <span v-show={(() =>this.showIcon(element.list))()}>
                                        {element.isClicked?<i class='el-icon-caret-bottom'></i>:<i class="el-icon-caret-top"></i>}&nbsp;&nbsp;
                                      </span>
                                      <span style="width:22px;display: inline-block;" v-show={(() =>!this.showIcon(element.list))()}>
                                      </span>
                                     <el-checkbox {...{
                                        model:{
                                          value:element.checked,
                                          callback:newV=>this.$nextTick(()=>element.checked=newV)
                                        }
                                      }} onChange={(v)=>this.change(v,element,this.root)}>{element.name}</el-checkbox>
                                  </div>
                                </div>
                                <treeItem list={element.list} root={element} isClicked={element.isClicked} sourceList={this.sourceList} count={this.count+1} enabled={element.enabled}></treeItem>
                              </div>
                          )
                        })
                      }
                      </draggable>
                  );
                }else{
                  return ("");
                }
                
              },
              methods:{
                open(element){
                    element.isClicked=!element.isClicked;
                },
                showIcon(list){
                  if(list&&list.length>0){
                      return true;
                  }else{
                    return false;
                  }
                },
                change(check,element,root){
                  this.$nextTick(()=>{
                    if(root&&root.list&&root.list.length>0&&root.list.some((item)=>item.checked===true)){
                      root.checked=true;
                      if(root.parentId){
                        this.sourceList.map((element)=>{
                          if(element.id===root.parentId){
                            if(element.list.some((item)=>item.checked===true)){
                              element.checked=true;
                            }
                          }
                        })
                      }
                    }else{
                      // root.checked=false;
                      // if(root.parentId){
                      //   this.sourceList.map((element)=>{
                      //     if(element.id===root.parentId){
                      //       if(element.list.some((item)=>item.checked===false)){
                      //         element.checked=false;
                      //       }
                      //     }
                      //   })
                      // }
                    }
                    if(!isEmpty(element.list)){
                      if(check){ 
                        checked(element.list,true)
                      }else{
                        checked(element.list,false)
                      }
                    }
                  })
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
        },
        data () {
            return{
                 list1: [
                    { name: "John1", id: 1,
                     checked:false,
                     isClicked:false,
                     list:[
                         { name: "tree1", id: 4,
                          isClicked:false,
                          checked:false,
                           list:[
                            { name: "tree5", id: 8 ,checked:false},
                            { name: "tree6", id: 9 ,checked:false},
                            { name: "tree7", id: 10 ,checked:false},
                            { name: "tree8", id: 11 ,checked:false},
                           ]
                         },
                         { name: "tree2", id: 5 ,
                          isClicked:false,
                          checked:false,
                             list:[
                            { name: "tree5", id: 12 ,checked:false},
                            { name: "tree6", id:13 ,checked:false},
                            { name: "tree7", id: 14 ,checked:false},
                            { name: "tree8", id: 15 ,checked:false},
                           ]
                         },
                         { name: "tree3", id: 6 ,
                          isClicked:false,
                          checked:false,
                            list:[
                            { name: "tree5", id: 16 ,checked:false},
                            { name: "tree6", id: 17 ,checked:false},
                            { name: "tree7", id: 18 ,checked:false},
                            { name: "tree8", id: 19 ,checked:false},
                           ]
                         },
                         { name: "tree4", id: 7 ,
                          isClicked:false,
                          checked:false,
                            list:[
                            { name: "tree5", id: 20 ,checked:false},
                            { name: "tree6", id: 21 ,checked:false},
                            { name: "tree7", id: 22 ,checked:false},
                            { name: "tree8", id: 23 ,checked:false},
                           ]
                         },
                     ]}
                    ,
                    { name: "Joa1o", id: 2 ,
                    isClicked:false,
                    checked:false,
                    list:[
                         { name: "tree5", id: 24 ,checked:false},
                         { name: "tree6", id: 25 ,checked:false },
                         { name: "tree7", id: 26 ,checked:false},
                         { name: "tree8", id: 27 ,checked:false},
                     ]},
                    { name: "Jean1", id: 3,
                     isClicked:false,
                     checked:false,
                     list:[]
                    }
                ],
                enabled:true
            }
        },
        created(){
            function addParentId(list,id){
              if(id===undefined){
                list.map((element)=>{
                  if(element.list&&element.list.length>0){
                    element.list.map((item)=>{
                      item.parentId=element.id;
                      if(item.list&&item.list.length>0){
                        addParentId(item.list,item.id)
                      }
                    })
                  }
                })
              }else{
                list.map((element)=>{
                  element.parentId=id;
                  if(element.list&&element.list.length>0){
                    addParentId(element,element.id)
                  }
                })
              }
              
            }
            addParentId(this.list1)
          }
    }
</script>
<style lang="scss" scoped>
pre {
  text-align: start;
}
/deep/ .ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
/deep/ .ghost1 {
  opacity: 0.5;
  background: red;
}
</style>