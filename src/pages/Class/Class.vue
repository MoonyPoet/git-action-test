<template>
    <div class="class">
        <TableSearch ref="table"
                     :colConfigs="colConfigs"
                     @sortChange="sortChange"
                     @downLoadExcel="downLoadExcel"
                     @selectionChange="handleSelectionChange"
                     uploadExcelUrl="student/pot_stu_import"
                     :isOptions="false"
                     :exportAuth="false">
            <el-button @click="add" round size="small" class="add" v-if="getFourRoleArr('class/addClass')"
                       slot="add">{{$t('class.addClass')}}
            </el-button>
            <!-- <el-button @click="stopAllAndStartClass" round size="small" class="add"
                       v-if="getFourRoleArr('class/addClass')" slot="other">{{$t('class.stopAllAndStartClass')}}
            </el-button> -->
            <template slot="upload">
                <div class="row">
                    <div class="title pull_left"><span>{{$t('class.cityLabel')}}:</span></div>
                    <div class="pull_left">
                        <SelectOpt :width="150" size="mini" v-model="formData.areaId"
                                   @change="(v)=>getAreaId(v,'campusIds')" ref="areaId" :data="codeData.area"
                                   :placeholder="$t('class.city')"></SelectOpt>
                    </div>
                </div>
                <div class="row">
                    <div class="title pull_left"><span>{{$t('class.campusIdLabel')}}:</span></div>
                    <div class="pull_left">
                        <SelectOpt :width="150" size="mini" v-if="formData.areaId!==''" v-model="formData.campusId"
                                   ref="campusIds" :data="campusData" :placeholder="$t('class.campusId')"></SelectOpt>
                    </div>
                </div>
            </template>
            <el-table-column
                    :label="$t('class.clasTimesLabel')"
                    width="250px"
                    slot="clasTimeVos"
            >
                <template slot-scope="{row}">
                  
                  <el-tooltip placement="right">
                    <div slot="content">
                        <div v-for="(item,index) in row.clasTimeVos" class="mb_10" :key="item.id">
                            <span>{{item.week}}</span>&nbsp;&nbsp;&nbsp;&nbsp;<span>{{item.startTime+'-'+item.endTime}}&nbsp;&nbsp;&nbsp;&nbsp;</span>
                        </div>
                    </div>
                    <div>
                         <div v-for="(item,index) in row.clasTimeVos" class="mb_10" v-if="index<2" :key="item.id">
                            <span>{{item.week}}</span>&nbsp;&nbsp;&nbsp;&nbsp;<span>{{item.startTime+'-'+item.endTime}}&nbsp;&nbsp;&nbsp;&nbsp;</span>
                        </div>
                        <div v-if="row.clasTimeVos.length>2" class="text_center">
                            ...
                        </div>
                    </div>
                  </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column
                    :label="$t('table.operations')"
                    width="300px"
                    slot="opt"
            >
                <template slot-scope="{row}">
                    <el-button @click="handleClick(row,4)" size="mini" v-if="getFourRoleArr('class/detailClass')">
                        {{$t('table.viewDetail')}}
                    </el-button>
                    <el-button @click="handleClick(row,0)"
                               v-if="getFourRoleArr('class/stopClass')" size="mini">
                        {{row.clasStatus==="0"?$t('class.stopClass'):$t('class.restartClass')}}
                    </el-button>
                    <el-button @click="handleClick(row,1)" size="mini" v-if="getFourRoleArr('class/stop')&&row.status==='0'">{{$t('table.startUse')}}</el-button>
                     <el-button @click="handleClick(row,2)" size="mini" v-else-if="getFourRoleArr('class/stop')&&row.status==='1'" >{{$t('table.stopUse')}}</el-button>
                     <el-button @click="handleClick(row,3)" size="mini" type="danger" v-if="getFourRoleArr('class/delete')" :disabled="row.status==='1'">{{$t('table.delete')}}</el-button>
                </template>
            </el-table-column>
        </TableSearch>
        <Dialog ref="dialog1" :title="$t('class.stopAllAndStartClass')" @submit="submit1"
                :submitText="!isStopClass?$t('class.stopClass'):$t('class.restartClass')">
            <template slot="content">
                <el-form :model="formData1" :rules="rules" size="medium" ref="formData1" label-width="100px"
                         label-position="left" :validate-on-rule-change="false">
                    <el-row v-if="!isStopClass">
                        <el-form-item :label="$t('class.timeLabel')" ref="date" required>
                            <el-col :span="12">
                                <FormItem prop="startDt"
                                          :rules="[{ required: true, message: $t('form.required'), trigger: 'change' }]"
                                          :label="$t('class.startDt')" :isShowLabel="false">
                                    <DatePickerStart v-model="formData1" :width="200" keyName="startDt"
                                                     otherKeyName="endDt"
                                                     :placeholder="$t('class.startDt')"></DatePickerStart>
                                </FormItem>
                            </el-col>
                            <el-col :span="12">
                                <FormItem prop="endDt"
                                          :rules="[{ required: true, message: $t('form.required'), trigger: 'change' }]"
                                          :label="$t('class.endDt')" :isShowLabel="false">
                                    <DatePickerEnd v-model="formData1" :width="200" keyName="endDt"
                                                   otherKeyName="startDt"
                                                   :placeholder="$t('class.endDt')"></DatePickerEnd>
                                </FormItem>
                            </el-col>
                        </el-form-item>
                    </el-row>
                    <el-row style="padding-top:10px;" v-if="!isStopClass">
                        <el-form-item :label="$t('class.remarkLabel')" ref="date" required>
                            <el-input v-model="formData1.remark" class="textarea" rows="4" type="textarea"
                                      :placeholder="$t('class.remark')"
                                      :title="$t('class.remark')"></el-input>
                        </el-form-item>
                    </el-row>
                    <hr style="margin-top:20px;margin-bottom: 0px;" v-if="!isStopClass">
                    <el-row style="padding-top:20px;">
                        {{$t('class.targetClass')}}
                    </el-row>
                    <el-row style="padding-top:10px;">
                        <!-- <TableBar size="mini" height="250" :colConfigs="colConfigs1" :data="classData"></TableBar> -->
                        {{filterTable(classData)}}
                    </el-row>
                </el-form>
            </template>
        </Dialog>
    </div>
</template>
<script>
    import TableSearch from "common/TableSearch";
    import {baseFn, getCode, getCookie, clone, getTableSectionData, validateForm, isEmpty} from "assets/js/reused";
    import SelectOpt from "common/SelectOpt";
    import {campusFind1} from "assets/js/mixin";
    import Dialog from "common/Dialog";
    import SearchBar from "common/SearchBar";
    import TableBar from "common/TableBar";
    import FormItem from "common/FormItem";
    import DatePickerStart from "common/DatePickerStart";
    import DatePickerEnd from "common/DatePickerEnd";
    export default {
        name: 'class',
        mixins: [campusFind1],
        components: {
            TableSearch,
            SelectOpt,
            SearchBar,
            Dialog,
            TableBar,
            FormItem,
            DatePickerStart,
            DatePickerEnd
        },
        data() {
            return {
                colConfigs: [
                    // {type: "selection", width: "55"},
                    {prop: 'clasName', label: this.$t('class.clasNameLabel')},
                    {prop: 'campusName', label: this.$t('class.campusIdLabel')},
                    {slot: 'clasTimeVos'},
                    {prop: 'clasStatusDisplay', label: this.$t('table.status')},
                    {prop: 'updateBy', label: this.$t('table.updateBy')},
                    {prop: 'updateDt', label: this.$t('table.updateDt')},
                    // 模版中的元素需要对应的有 slot="opt" 属性
                    {slot: 'opt'}
                ],
                // colConfigs1: [
                //     { prop: 'clasName', label: this.$t('class.clasNameLabel')},
                // ],
                isStopClass: false,
                classData: [],
                uploadFormat: {
                    "学员名称": {
                        key: "studentName"
                    },
                    "性别": {
                        key: "sex"
                    },
                    "联系电话": {
                        key: "tel"
                    },
                    "出生日期": {
                        key: "birthDate"
                    },
                    "客户来源": {
                        key: "sourceCrmtagName"
                    },
                    "销售": {
                        key: "saleMemberName"
                    },
                    "错误信息": {
                        key: "errMsg"
                    }
                },
                rules: {
                    startDt: [
                        {
                            required: true,
                            message: this.$t('form.required'),
                            trigger: "change"
                        },
                    ],
                    stopClassEndDt: [
                        {
                            required: true,
                            message: this.$t('form.required'),
                            trigger: "change"
                        },
                    ],
                    stopClasRemark: [
                        {
                            required: true,
                            message: this.$t('form.required'),
                            trigger: "blur"
                        },
                    ]
                },
                codeData: {},
                formData: {
                    memberName: "",
                    followMemberId: null
                },
                formData1: {
                    startDt: null,
                    endDt: null,
                    remark: null
                }
            }
        },
        created() {
            // this.init()
        },
        methods: {
            async init() {
                this.codeData = await getCode("campus,_sex,_crm_stage,_crm_source");
            },
            getTableData(v) {
                //table 数据
                return new Promise((resolve, reject) => {
                    let obj = Object.assign(v == undefined ? {} : v, {
                        limit: this.$refs.table.getLimit(),
                        offset: this.$refs.table.getOffset(),
                        initial: 1
                    });
                    this.$axios.post({
                        url: baseURL + "clas/find_paging",
                        data: obj,
                        success: res => {
                            this.$refs.table.setTableData(res.data.rows);
                            this.$refs.table.setTotalAll(res.data.count);
                            this.$refs.table.setSearchData(res.data.search);
                            resolve();
                        }
                    });
                });
            },
            handleClick(row, status) {
                let obj = {
                    0: () => {
                        this.classData = [row];
                        this.stopAllAndStartClass(row)
                    },
                    1: () => {
                       this.setStatus(row,1)
                    },
                    2: () => {
                       this.setStatus(row,0)
                    },
                    3: () => {
                        this.$confirm("确认删除班级?", '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                            }).then(() => {
                             this.delete(row)
                        });
                    },
                    4:()=>{
                         this.$store.commit("addTabAndActive", {
                            url: "/class/detailClass",
                            data: {
                                clasId: row.clasId
                            }
                        });
                    }
                }
                obj[status]();
            },
            add() {
                this.$store.commit("addTabAndActive", {
                    url: "/class/addClass"
                });
            },
            setStatus(row, status) {
                baseFn.call(this, {
                    path: "clas/edit",
                    data: {
                        clasId: row.clasId,
                        status: status
                    }
                })
            },
            delete(row) {
                baseFn.call(this, {
                    path: "clas/delete",
                    data: {
                        clasId: row.clasId
                    }
                })
            },
            filterTable(data){
               let clasNameArr=getTableSectionData({tableData:data,getArr:true,itemName:["clasName"]});
               return clasNameArr.toString();
            },
            stopAllAndStartClass() {
                //批量停/复课
                if (this.classData.length === 0) {
                    this.$alert(this.$t("class.msg3"));
                    return
                }
                this.formData1.startDt = null;
                this.formData1.endDt = null;
                this.formData1.remark = null;
                let clasStatusArr = getTableSectionData({
                    tableData: this.classData,
                    itemName: ["clasStatus"],
                    filter: (row) => {
                        return Number(row.clasStatus);
                    }
                })
                if (!(clasStatusArr.every((item) => item === 0) || clasStatusArr.every((item) => item === 1))) {
                    this.$alert(this.$t("class.msg4"));
                    return
                }
                //全部正常,处理成停课
                if (clasStatusArr.every((item) => item === 0)) {
                    this.isStopClass = false;
                }
                //全部已经停课,处理成复课
                if (clasStatusArr.every((item) => item === 1)) {
                    this.isStopClass = true;
                }
                this.$refs.dialog1.show()
            },
            async downLoadExcel(down) {
                // let obj={
                //   "校区":{
                //     key: "campusName"
                //   }
                // };
                // obj={...obj,...this.uploadFormatData};
                let excelData = await post("student/generateexcelforpotstu");
                down(exportData)
            },
            upload(data, call) {
                if (this.formData.campusId === '') {
                    this.$alert("校区必选", "错误提示", {
                        confirmButtonText: "确定"
                    });
                    return
                }
                call({
                    students: data,
                    campusId: this.formData.campusId
                })
            },
            uploadCall(v, download, close) {
                if (v.status === '1') {
                    if (v.data.data.length === 0) {
                        this.$message({
                            message: v.message,
                            type: "success"
                        });
                        close();
                    } else {
                        this.$confirm(v.data.message, this.$t("components.tips"), {
                            confirmButtonText: this.$t("components.confirm"),
                            cancelButtonText: this.$t("components.cancel"),
                            type: 'warning'
                        }).then(() => {
                            download(Object.keys(this.uploadFormat), v.data.data)
                        }).catch(() => {
                            this.$message({
                                type: 'info',
                                message: this.$t('components.cancel')
                            });
                        });
                    }
                } else if (v.status === '0') {
                    this.$alert(v.message, this.$t("components.errTips"), {
                        confirmButtonText: this.$t("components.confirm"),
                        callback: action => {
                        }
                    });
                }
            },
            pushCallbackFn(element) {
                return {
                    value: element.display,//显示需要的
                    id: element.value
                }
            },
            searchOptFn(v) {
                return {"keyword": "member", "insId": getCookie("insId"), "assVal": v}
            },
            handleSelectionChange(v) {
                this.classData = v;
            },
            sortChange(obj) {
                if (obj.order === "descending") {
                    // this.getTableData({
                    //     sort:
                    // })
                } else {
                    //  this.getTableData({
                    //     sort:sort
                    // })
                }
                console.log(v)
            },
            submit1() {
                let url = "";
                if (this.isStopClass) {
                    url = "clas/start_clas";
                } else {
                    url = "clas/stop_clas";
                }
                let formData = clone(this.formData1);
                formData.clasIds = getTableSectionData({tableData: this.classData, itemName: ["clasId"]});
                validateForm({
                    form: this.$refs["formData1"],
                    formData: formData,
                    url: url,
                    success: (res) => {
                        this.$message({
                            message: res.message,
                            type: 'success'
                        })
                        this.$refs.dialog1.close()
                        this.getTableData()
                    }
                });

            }
        }
    };
</script>
<style lang="scss" scoped>
    .class {
        .title {
            padding-top: 8px;
            margin-right: 10px;
        }

        .title + .pull_left > span {
            line-height: 32px;
        }

        .btn_left {
            .el-button + .el-button {
                margin-left: 0;
            }
        }

        .row {
            display: block;
            height: 34px;
        }

        /deep/ .el-autocomplete {
            float: left;
            width: 88%;
        }
    }
</style>