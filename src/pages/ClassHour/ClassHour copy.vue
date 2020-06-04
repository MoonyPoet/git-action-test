<template lang='html'>
    <div class='container'>
        <FullCalendarBar :data="data.time">
            <template v-slot:top>
                <!-- <div class="pull_left" v-for="element in data.search" :key="element.id">
                    <el-select v-model="element.value" placeholder="请选择">
                        <el-option
                        v-for="item in element.options"
                        :key="item.value"
                        :label="item.display"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </div> -->
                <div class="filterBarDiv">
                    <template v-for="(element,index) in data.search">
                        <div class="pull_left element" v-if="element.type==='select'">
                            <el-col :span="6" class="title">
                                {{element.title}}
                            </el-col>
                            <el-col :span="18">
                                <el-select v-model="element.value" :title="element.placeholder" :style="{width:200+'px'}":placeholder="element.placeholder" @change="(v)=>selectChange(v,element)">
                                    <el-option
                                        v-for="item in element.options"
                                        :key="item.value"
                                        :label="item.display"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-col>
                        </div>
                    </template>
                     <div class="right">
                        <div v-for="item in data.classHourStatus" :key="item.id" class="cycle_right">
                            <span class="cycle" :style="{background:item.color}"></span>
                            <span class="cycle_text">{{item.text}}</span>
                        </div>
                    </div>
                </div>
            </template>
            <template v-slot:title="row">
                {{row.left}}
            </template>

            <template v-slot:content="row">
                <el-row style="margin-bottom:10px">
                    <el-col :span="8">
                        {{row.list.clasName}}
                    </el-col>
                     <el-col :span="8" class="pull_right">{{row.list.trainName}}</el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        学员数 · 20/20
                    </el-col>
                    <el-col :span="8">场地 · 1号厅</el-col>
                    <el-col :span="8">教练 · 王富贵</el-col>
                </el-row>
            </template>
        </FullCalendarBar>
    </div>
</template>
<script>
    import FullCalendarBar from "common/FullCalendarBar";
     export default {
        name: 'classHour',
        components:{
            FullCalendarBar
        },
        data () {
            return{
                data:{
                    search:[
                          {
                            "id": "trainId",
                            "type": "select",
                            "title": "培训项目",
                            
                            "options": [
                            {
                                "value": "",
                                "display": "全部"
                            },
                            {
                                "value": 1,
                                "display": "舞蹈"
                            },
                            {
                                "value": 22,
                                "display": "健美操"
                            },
                            {
                                "value": 33,
                                "display": "跆拳道"
                            }
                            ],
                            "value": ""
                        },
                    ],
                    "classHourStatus":[
                        {
                            color:"blue",
                            text:"上课中",
                        },
                        {
                            color:"green",
                            text:"未上课",
                        },
                        {
                            color:"gray",
                            text:"已结课",
                        }
                    ],
                    day:"1567063780",
                    time:{
                    "09:00-10:00":{
                        "color":"blue",
                        "classHours":[
                            {
                                classHourId:1,
                                clasName:"精英一班",
                                color:"blue",
                                nowNum:20,
                                timeNum:20,
                                fieldName:"第一个场地",
                                memberName:"王富贵",
                                trainName:"跆拳道",
                                day:"2019-07-02",
                                weekName:"星期一",
                                startDt:"09:00",
                                endDt:"10:00"
                            },
                            {
                                classHourId:1,
                                clasName:"精英一班",
                                color:"blue",
                                nowNum:20,
                                timeNum:20,
                                fieldName:"第一个场地",
                                memberName:"王富贵",
                                trainName:"跆拳道"
                            },
                            {
                                classHourId:1,
                                clasName:"精英一班",
                                color:"blue",
                                nowNum:20,
                                timeNum:20,
                                fieldName:"第一个场地",
                                memberName:"王富贵",
                                trainName:"跆拳道"
                            },
                            {
                                classHourId:1,
                                clasName:"精英一班",
                                color:"blue",
                                nowNum:20,
                                timeNum:20,
                                fieldName:"第一个场地",
                                memberName:"王富贵",
                                trainName:"跆拳道"
                            },
                            {
                                classHourId:1,
                                clasName:"精英一班",
                                color:"blue",
                                nowNum:20,
                                timeNum:20,
                                fieldName:"第一个场地",
                                memberName:"王富贵",
                                trainName:"跆拳道"
                            },
                            {
                                classHourId:1,
                                clasName:"精英一班",
                                color:"blue",
                                nowNum:20,
                                timeNum:20,
                                fieldName:"第一个场地",
                                memberName:"王富贵",
                                trainName:"跆拳道"
                            },
                            {
                                classHourId:1,
                                clasName:"精英一班",
                                color:"blue",
                                nowNum:20,
                                timeNum:20,
                                fieldName:"第一个场地",
                                memberName:"王富贵",
                                trainName:"跆拳道"
                            },
                            {
                                classHourId:1,
                                clasName:"精英一班",
                                color:"blue",
                                nowNum:20,
                                timeNum:20,
                                fieldName:"第一个场地",
                                memberName:"王富贵",
                                trainName:"跆拳道"
                            },
                             {
                                classHourId:1,
                                clasName:"精英一班",
                                color:"blue",
                                nowNum:20,
                                timeNum:20,
                                fieldName:"第一个场地",
                                memberName:"王富贵",
                                trainName:"跆拳道"
                            },
                        ]
                        
                    },
                    "11:00-12:00":{
                        "color":"blue",
                        "classHours":[
                            {
                                classHourId:1,
                                clasName:"精英一班",
                                color:"blue",
                                nowNum:20,
                                timeNum:20,
                                fieldName:"第一个场地",
                                memberName:"王富贵",
                                trainName:"跆拳道"
                            }
                        ]    
                    },
                    "13:00-14:00":{
                        "color":"blue",
                        "classHours":[
                            {
                                classHourId:1,
                                clasName:"精英一班",
                                color:"blue",
                                nowNum:20,
                                timeNum:20,
                                fieldName:"第一个场地",
                                memberName:"王富贵",
                                trainName:"跆拳道"
                            },
                            {
                                classHourId:1,
                                clasName:"精英一班",
                                color:"blue",
                                nowNum:20,
                                timeNum:20,
                                fieldName:"第一个场地",
                                memberName:"王富贵",
                                trainName:"跆拳道"
                            }
                        ]    
                    },
                 }
                }
            }
        },
        created(){

        },
        methods:{
            init(){

            },
            async find(){
                 return await post()
            }
        }
    }
</script>
<style lang="scss" scoped>
    .filterBarDiv {
        display: inline-block;
        margin-right: 10px;
        margin-top: 33px;
        width: 87%;
        padding:0px 84px;
        .title{
            line-height: 33px;
        }
        .element {
            width: 300px;
            margin-right: 25px;
            margin-bottom: 10px;
        }
        /deep/.search .el-input__inner{
            border-radius: 50px;
            height: 33px;
        }
        .el-select /deep/ .el-input__inner{
            border-radius: 50px;
            height: 33px;
        }
        
    }
    .right{
            float: right;
            .cycle_right{
                float: left;
                height: 33px;
                margin-right: 20px;
                .cycle{
                    width: 20px;
                    height: 20px;
                    display: inline-block;
                    border-radius: 50%;
                    margin-top: 7px;
                }
                .cycle_text{
                    margin-left: 10px;
                    display: inline-block;
                    vertical-align: top;
                    line-height: 33px;
                }
            }
        }
</style>