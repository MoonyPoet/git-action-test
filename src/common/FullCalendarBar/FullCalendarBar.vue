<template lang='html'>
    <div class='fullCalendarBar'>
        <Calendar @change="getDay"></Calendar>
        <slot name="top"></slot>
        <!-- {{time}} -->
        <div class="table_parent">
             <div v-for="(item,key,index) in data" class="table" :key="item.id">
                <div class="table_cell cell_left">
                    <div :style="{'background':item.color}">
                        <div  class="text" ><slot name="title" :left="key"></slot></div>
                    </div>
                </div>
                <div class="table_cell cell-center"></div>
                <div class="table_cell cell_right">
                    <div class="note_parent" v-for="note in item.classHours "   :key="note.id">
                        <div class="note" :style="{'background':note.color}">
                            <div class="pull_right note_right">
                               <slot name="content" :list="note"></slot>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
       
    </div>
</template>
<script>
    import Calendar from "./Calendar";
     export default {
        name: 'FullCalendarBar',
        components:{
            Calendar
        },
        props:{
            data:{
                type:Object,
                default:()=>{
                    return {};
                }
            }
        },
        data () {
            return{
            }
        },
        created(){
            this.$nextTick(()=>{
                // [...document.querySelectorAll(".cell_right")].map((item,index)=>{
                //     if(item.children.length%3!==0){
                //         let _index=item.children.length - item.children.length%3-1;
                //         [...item.children].map((note,nIndex)=>{
                //             if(nIndex>_index){
                //                 note.style.margin="0px";
                //             }
                            
                //         })
                //     }
                // });
                //  [...document.querySelectorAll(".text")].map((item)=>{
                //     item.style.minHeight="160px";
                //     console.log(item.parentNode.parentNode)
                //     item.style.height=item.parentNode.parentNode.offsetHeight+"px";
                // });
                 
            })
           
        },
        methods:{
            getDay(day){
                console.log(day)
            }
        }
    }
</script>
<style lang="scss" scoped>
.fullCalendarBar{
    overflow: hidden;
    .left_btn{
        padding-top: 20px;
        padding-left: 76px;
        text-align: left;
    }
    .right_btn{
        padding-top: 20px;
        padding-right: 76px;
        text-align: right;
    }
    .week{
        margin-bottom:10px;
    }
    .table_parent{
        width: 90%;
        margin: 0 auto;
        margin-top:20px;
    }
    .table{
        display: table;
        margin-bottom: 20px;
    }
    .cell_left{
        width: 5%;
    }
    .cell-center{
        width: 1%;
    }
    .cell_right{
        width: 94%;
    }
    
    .table_cell{
        display: table-cell;
        vertical-align: top;
    }
    .weekItem{
        display: table-cell;
        text-align: center;
    }
    .month{
        margin-left: 80px;
    }
    .day{
        border: 1px solid #ddd;
        border-radius: 17px;
        width: 80%;
        height: 30px;
        text-align: center;
        line-height: 30px;
        margin: 0 auto;
        cursor: pointer;
    }
    .day:hover{
        background: #317ffe;
        color: #fff;
    }
    .disabled{
        background: #ccc;
        color: #fff;
    }
    .table{
        width: 100%;
        display: table;
    }
    .text{
        writing-mode: tb-rl;
        -webkit-writing-mode: vertical-rl;      
        writing-mode: vertical-rl;
        height: 100%;
        color:#fff;
        text-align: center;
        margin: 0 auto;
    }
    .note_parent{
        width:30.3%;
        margin-right: 3%;
        float: left;
        margin-bottom: 20px;
    }
    .note_parent:nth-last-child(1),
    .note_parent:nth-child(3n+1):nth-last-child(2),
    .note_parent:nth-child(3n+2):nth-last-child(2),
    .note_parent:nth-child(3n+1):nth-last-child(3){
        margin-bottom: 0;
    }
    .note{
        overflow: hidden;
    }
    .note_right{
        width: 99%;
        background: #fff;
        padding: 12px;
        border:1px solid #ddd;
        box-sizing:border-box;
    }
}
</style>