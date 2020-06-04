<template lang='html'>
    <div class='fullCalenDar'>
       <div>
           <div class="btn_div">
               <span v-if="viewOptions.length>1">
                    <el-select v-model="viewId" placeholder="请选择" @change="selectView">
                        <el-option
                        v-for="item in viewOptions"
                        :key="item.viewId"
                        :label="item.label"
                        :value="item.viewId">
                        </el-option>
                    </el-select>
               </span>
                <div class="topList" :style="{marginLeft:viewOptions.length<=1?450+'px':200}">
                    <span v-for="item in fullCalenDarData.topList" :key="item.id">
                        <span :style="{background:item.eventBg}" class="circle"></span>
                        <span>
                            {{item.eventTitle}}
                        </span>
                    </span>
                </div>
               <div class="btn_group" v-if="isShowBtn">
                <button id="last-week" @click="lastWeek">上一周</button>
                <button id="next-week" @click="nextWeek">下一周</button>
                <!-- <button class="ex" @click="print">打印</button> -->
            </div>
           </div>
            <table id="monitor">
                <thead>
                    <tr>
                        <td>{{fullCalenDarData.leftTitle}}</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                </thead>
                <tbody>
                      <tr v-for="(item,index) in fullCalenDarData.tableData" :key="item.id">
                        <td>{{fullCalenDarData.leftConfig&&fullCalenDarData.leftConfig.length>0&&fullCalenDarData.leftConfig[index]&&fullCalenDarData.leftConfig[index].title}}</td>
                        <td v-for="(obj,aindex) in item">
                            <div v-if="startDt<=fullCalenDarData.startDt&&endDt>=fullCalenDarData.endDt" :style="{width:fullCalenDarData.eventDivWidth+'px'}">
                                <div v-if="showEvent(aindex)" @click="addEvent({
                                        item:item,
                                        obj:obj,
                                        aindex:aindex,
                                        index:index,
                                        $event:$event
                                    })" class="addEvent"><i>+</i></div>
                                <el-tooltip  v-for="(element,elementIndex) in listFilter(obj,index,aindex)" :key="element.id" class="event" placement="right">
                                    <div slot="content">
                                        <div>开始时间:{{element.startDt}}</div>
                                        <div>结束时间:{{element.endDt}}</div>
                                        <div>班级:{{element.title}}</div>
                                        <div>教练:{{element.memberName}}</div>
                                        <div>学员数:{{element.stuNum}}</div>
                                        <div>场地:{{element.fieldName}}</div>
                                    </div>
                                    <div @click="editEvent({
                                            item:item,
                                            element:element,
                                            obj:obj,
                                            aindex:aindex,
                                            index:index,
                                            elementIndex:elementIndex,
                                            $event:$event
                                        })"  :style="{background:bgFileter(element.bg),color:'#fff'}" class="event_div" >{{element.title}}</div>
                                </el-tooltip>
                                <div v-if="(obj.length)>(fullCalenDarData.limit)&&arrIsMore[index][aindex]==false" class="more"  @click="more(index,aindex)">更多</div>
                                <div v-else-if="(obj.length)>(fullCalenDarData.limit)" @click="shrink(index,aindex)" class="more">收缩</div>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
            <el-dialog
            :title="dialogData.title"
            :visible.sync="dialogData.dialogVisible"
            center
            width="900"
            :before-close="handleClose">
            <div v-if="editStatus==1">
                <slot name="add"></slot>
            </div>
            <div v-else-if="editStatus==2">
                <slot name="edit"></slot>
            </div>
            <span slot="footer" v-if="editStatus==1" class="dialog-footer">
                <el-button @click="dialogData.dialogVisible = false">关闭</el-button>
                <el-button type="primary" @click="submit()">确 定</el-button>
            </span>
            <span slot="footer" v-else-if="editStatus==2" class="dialog-footer">
                <div v-if="editBtnShow">
                    <el-button @click="dialogData.dialogVisible = false">关闭</el-button>
                    <el-button type="primary" @click="edit()">修改</el-button>
                </div>
                <div v-else>
                    <el-button @click="dialogData.dialogVisible = false">关闭</el-button>
                </div>
            </span>
            </el-dialog>
       </div>
    </div>
</template>
<script>
    import {setDayTime,isEmpty} from 'assets/js/reused';
     export default {
        name: 'Fullcalendar',
        props:{
            isShowBtn:{
                type:Boolean,
                default:true
            },
            fullCalendarNewData:{
                type:Object,
                default:()=>{
                    return {};
                }
            }
        },
        data () {
            return{
                arrIsMore:[],
                dialogData:{
                    dialogVisible:false,
                    title:"提示"
                },
                isMore:false,
                tipStr:"",
                editStatus:1,//'1'添加,'2'修改,
                startDt:"",//日历上的开始时间
                endDt:"",//日历上的结束时间
                viewOptions: [{
                viewId: '1',
                label: '时间'
                }],
                day:"",
                viewId: '1',
                currentFirstDate:"",
                fullCalenDarData:{
                    viewValue:"1",
                    leftTitle:"时间",
                    container:"monitor",
                    viewOptions: [
                        {
                            viewId: "1",
                            label: "时间视图"
                        }
                    ],
                    topList:{
                        1:{
                            eventBg:"red",
                            eventTitle:"已经上课"
                        },
                        2:{
                            eventBg:"green",
                            eventTitle:"正常课"
                        },
                        3:{
                            eventBg:"blue",
                            eventTitle:"我的课"
                        },
                        4:{
                            eventBg:"#e2951c",
                            eventTitle:"冲突课"
                        },
                    },
                    leftConfig:[],
                    limit:4,//td里面展开显示事件最多4个,
                    startDt:"1533484799",
                    endDt:"1532880000",
                    eventDivWidth:"173",
                    tableData:[]
                },
                editBtnShow:true
            }
        },
        watch:{
            fullCalendarNewData(newV,oldV){
                this.viewOptions=newV.viewOptions;
                this.value=newV.value;
                this.fullCalenDarData=newV.fullCalenDarData;
                this.fullCalenDarData.toDayDate=setDayTime(new Date())/1000;
                this.arrIsMore=[];
                this.fullCalenDarData&&this.fullCalenDarData.tableData.map((element)=>{
                    this.arrIsMore.push([false,false,false,false,false,false,false])
                })
                // this.$set()
            }
        },
        mounted(){
          this.init()
        },
        methods:{
            bgFileter(v){
                return this.fullCalenDarData.topList[v]&&this.fullCalenDarData.topList[v].eventBg;
            },
            init(){
                this.currentFirstDate="";
                //根据今天计算这周
                this.setWeekDate(new Date());
            },
            showEvent(aindex){
                var cells=document.querySelectorAll(`#${this.fullCalenDarData.container} thead tr td`);
                let day=Date.parse(cells[aindex+1].getAttribute("date"))/1000;
                // if(this.fullCalenDarData.toDayDate<=day){
                //     根据具体时间判断
                //     for(let i=0;i<this.fullCalenDarData.leftConfig.length;i++){
                //         console.log(i)
                //         if(new Date(new Date().toString().replace(/\d{2}\:\d{2}\:\d{2}/,`${this.fullCalenDarData.leftConfig[i].title}:00`)).getTime()/1000<new Date().getTime()/1000){
                //             return false;
                //         }else {
                //             return true;
                //         }
                //     }
                //     return true;
                // }else{
                //     return false;
                // }
                return this.fullCalenDarData.toDayDate<=day?true:false;
            },
            addDate(date,n){
                //设置某天，一月内某天
                date.setDate(date.getDate()+n); 
                return date;
            },
            moreFilter(){
               this.isMore=true;
            },
            elementFilter(obj){
                this.$emit("elementEvent",this.returnObj,obj);
                // if(this.tipStr){
                //     console.log(this.tipStr)
                //     return this.tipStr;
                // }
            },
            returnObj(v){
                this.tipStr=v;
            },
            listFilter(element,index,aindex){
                if(this.arrIsMore[index][aindex]==true){
                    return element;
                }else{
                    if(element.length>this.fullCalenDarData.limit){
                        let len=element.length-this.fullCalenDarData.limit;
                        let obj=JSON.parse(JSON.stringify(element));
                        obj.splice(this.fullCalenDarData.limit,len);
                        return obj;
                    }else{
                        return element;
                    }
                }
            },
            print(){
                // var newstr = document.getElementById("monitor").innerHTML;//得到需要打印的元素HTML
                // var oldstr = document.body.innerHTML;//保存当前页面的HTML
                // document.body.innerHTML = newstr;
                document.querySelector(".sidebar-container").style.display="none";
                document.querySelector(".navbar").style.display="none";
                document.querySelector(".template-tabs").style.display="none";
                window.print();
                // document.body.innerHTML = oldstr;
            },
            lastWeek(){
                //上一周
                this.setWeekDate(this.addDate(this.currentFirstDate,-7)); 
            },
            nextWeek(){
                //下一周
                this.setWeekDate(this.addDate(this.currentFirstDate,7));
            },
            setWeekDate(date){
                //设置一周       
                var week = date.getDay();//获取一周内某天
                date = this.addDate(date,week*-1);
                this.currentFirstDate = new Date(date);
                // var cells = document.getElementById(this.fullCalenDarData.container).getElementsByTagName('td');
                var cells = document.querySelectorAll(`#${this.fullCalenDarData.container} thead tr td`);
                var clen = cells.length;
                for(var i = 0;i<clen;i++){
                    if(i!=0){
                        let cellDate=this.addDate(date,1);
                        cells[i].innerHTML =this.formatDate(i==0 ? date :cellDate);
                        cells[i].setAttribute("date",cellDate);
                        if(i==1){
                           this.startDt=setDayTime(date)/1000;
                        }
                        if(i==clen-1){
                           this.endDt=setDayTime(date,2)/1000;
                        }
                    }
                }
                //一周的开始时间和结束时间
                this.$emit("weekTime",{
                    startDt:this.startDt,
                    endDt:this.endDt,
                 })      
            },
            formatDate(date){
                //一周时间格式化       
                var year = date.getFullYear()+'年';
                var month = (date.getMonth()+1)+'月';
                var day = date.getDate()+'日';
                var week = '('+['星期天','星期一','星期二','星期三','星期四','星期五','星期六'][date.getDay()]+')'; 
                return year+month+day+' '+week;
            },
            addEvent({
                        item:item,
                        obj:obj,
                        aindex:aindex,
                        index:index,
                        $event:$event
                    }){
                // this.dialogData.dialogVisible=true;
                var cells=document.querySelectorAll(`#${this.fullCalenDarData.container} thead tr td`);
                this.dialogData.title=cells[aindex+1].innerText+"   "+this.fullCalenDarData.leftConfig[index].title;
                this.day=Date.parse(cells[aindex+1].getAttribute("date"))/1000;
                this.editStatus=1;
                //判断当前处于什么视图
                this.$emit("startTime",this.fullCalenDarData.leftConfig[index].title);
                let str=cells[aindex+1].innerText.replace(/(\d{4})年(\d{1,2})月(\d{1,2})日 ([\s\S]*)/,($,$1,$2,$3)=>{
                    return `${$1}/${$2}/${$3} 00:00:00`;
                })
                this.$emit("viewValue",{
                    viewId:this.viewId,
                    editStatus:this.editStatus,
                    leftConfig:this.fullCalenDarData.leftConfig,
                    leftTitle:this.fullCalenDarData.leftConfig[index].title,
                    topTitle:cells[aindex+1].innerText,
                    day:Date.parse(new Date(str))/1000
                });
            },
            editEvent({
                        item,
                        element,
                        obj,
                        aindex,
                        index,
                        elementIndex,
                        $event
                    }){
                // this.dialogData.dialogVisible=true;
                var cells=document.querySelectorAll(`#${this.fullCalenDarData.container} thead tr td`);
                this.dialogData.title=cells[aindex+1].innerText+"   "+this.fullCalenDarData.leftConfig[index].title;
                this.day=Date.parse(cells[aindex+1].getAttribute("date"))/1000;
                let str=cells[aindex+1].innerText.replace(/(\d{4})年(\d{1,2})月(\d{1,2})日 ([\s\S]*)/,($,$1,$2,$3)=>{
                    return `${$1}/${$2}/${$3} 00:00:00`;
                })
                //判断当前处于什么视图
                this.editBtnShow=(element.bg!==1?true:false);
                this.editStatus=2;
                this.$emit("viewValue",{
                    viewId:this.viewId,
                    leftConfig:this.fullCalenDarData.leftConfig,
                    editStatus:this.editStatus,
                    leftTitle:this.fullCalenDarData.leftConfig[index].title,
                    topTitle:cells[aindex+1].innerText,
                    day:Date.parse(new Date(str))/1000,
                    element:element
                });
                this.$emit("pageData",element);
            },
            more(index,aindex){
                this.arrIsMore[index].splice(aindex,1,true)
            },
            shrink(index,aindex){
                this.arrIsMore[index].splice(aindex,1,false)
            },
            selectView(v){ 
                this.$emit("selectViewData",{
                    viewId:v,
                    startDt:this.startDt,
                    endDt:this.endDt,
                })
            },
            handleClose(){
                this.dialogData.dialogVisible = false
            },
            submit(){
                //点击确定按钮触发
                this.$emit("submit",this.day)
            },
            dialogHideOrShow(v){
                this.dialogData.dialogVisible = v||false;
            },
            edit(){
                //点击修改按钮触发
                this.$emit("edit",this.day);
            }
        }
    }
</script>
<style lang="scss" scoped>
    .fullCalenDar{
        .btn_div{
            width: 1436px;
            padding-bottom: 10px;
            overflow: hidden;
            margin: 0 auto;
            .topList{
                display: inline-block;
                margin-left: 200px;
                vertical-align: middle;
            }
            .circle{
                border-radius: 50%;
                width: 20px;
                height: 20px;
                display: inline-block
            }
            .circle+span{
                vertical-align: super;
                margin-right: 10px;
            }
            .btn_group{
            float: right;
                button{
                    background: #fff;
                    padding: 10px;
                    border:1px solid #dddddd;
                    cursor: pointer;
                }
                button:nth-of-type(1){
                    border-right:0;
                }
            }
           
        }
        #monitor{
            overflow: hidden;
            line-height: 25px;
            text-align: center;
            border-collapse: collapse;
            padding: 2px;
            width: 1436px;
            margin: 0 auto;
            display: block;
            td{
                border:1px solid #ddd;
                padding: 10px;
                .addEvent{
                    // background: #dedede;
                    cursor: pointer;
                    margin-bottom:10px;
                    i{
                        border-radius: 50%;
                        width: 10px;
                        height: 10px;
                        padding: 5px;
                        color: #fff;
                        background: #d5eefc;
                        font-style: normal;
                        display: inline-block;
                        line-height: 10px;
                    }
                }
                .addEvent:last-child{
                    margin: 0;
                }
                .event_div{
                    overflow: hidden;white-space: nowrap;text-overflow: ellipsis;
                }
                .event{
                    margin-bottom: 10px;
                    cursor: pointer;
                }
                .event:nth-last-child(1){
                    margin: 0;
                }
                .more{
                    cursor: pointer;
                    background: gray;
                }
            }
        }
    }
    
</style>