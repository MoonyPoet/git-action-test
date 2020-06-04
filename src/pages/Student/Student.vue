<template>
    <div class="student">
        <TableSearch ref="table"
                     :colConfigs="colConfigs"
                     :upLoadAuth="false"
                     :uploadFormat="uploadFormat"
                     @uploadCall="uploadCall"
                     @upload="upload"
                     @sortChange="sortChange"
                     @downLoadExcel="downLoadExcel"
                     @selectionChange="handleSelectionChange"
                     uploadExcelUrl="student/pot_stu_import"
                     :isOptions="false"
                     :exportAuth="false">
            <el-button @click="add" round size="small" class="add" v-if="getFourRoleArr('student/addStudent')"
                       slot="add">{{$t('student.addStudent')}}
            </el-button>
            <!-- <el-button @click="setFollowBy" round size="small" class="add" v-if="getFourRoleArr('student/addStudent')"
                       slot="other">{{$t('student.setAllFollowBy')}}
            </el-button>
            <el-button @click="stopAllAndStartClass" round size="small" class="add"
                       v-if="getFourRoleArr('student/addStudent')" slot="other">{{$t('student.stopAllAndStartClass')}}
            </el-button> -->
            <template slot="upload">
                <div class="row">
                    <div class="title pull_left"><span>{{$t('student.cityLabel')}}:</span></div>
                    <div class="pull_left">
                        <SelectOpt :width="150" size="mini" v-model="formData.areaId"
                                   @change="(v)=>getAreaId(v,'campusIds')" ref="areaId" :data="codeData.area"
                                   :placeholder="$t('student.city')"></SelectOpt>
                    </div>
                </div>
                <div class="row">
                    <div class="title pull_left"><span>{{$t('student.campusIdLabel')}}:</span></div>
                    <div class="pull_left">
                        <SelectOpt :width="150" size="mini" v-if="formData.areaId!==''" v-model="formData.campusId"
                                   ref="campusIds" :data="campusData" :placeholder="$t('student.campusId')"></SelectOpt>
                    </div>
                </div>
            </template>
            <el-table-column
                    :label="$t('table.operations')"
                    width="300px"
                    slot="opt"
            >
                <template slot-scope="{row}">
                    <!-- <el-button @click="handleClick(row,0)"
                               v-if="getFourRoleArr('potentialStudent/editPotentialStudent')" size="mini">
                        {{row.clasStatus==="0"?$t('student.stopClass'):$t('student.restartClass')}}
                    </el-button>
                    <el-button @click="handleClick(row,1)" size="mini">{{$t('student.groupOfClass')}}</el-button> -->
                    <el-button @click="handleClick(row,0)" size="mini" v-if="getFourRoleArr('student/detailStudent')">
                        {{$t('table.viewDetail')}}
                    </el-button>
                    <el-button @click="handleClick(row,1)" size="mini" v-if="getFourRoleArr('student/stop')&&row.status==='0'">{{$t('table.startUse')}}</el-button>
                    <el-button @click="handleClick(row,2)" size="mini" v-else-if="getFourRoleArr('student/stop')&&row.status==='1'" >{{$t('table.stopUse')}}</el-button>
                    <el-button @click="handleClick(row,3)" size="mini" type="danger" v-if="getFourRoleArr('student/delete')" :disabled="row.status==='1'">{{$t('table.delete')}}</el-button>
                    <!-- <el-button @click="handleClick(row,3)"
                               v-if="getFourRoleArr('potentialStudent/detailPotentialStudent')" size="mini">
                        {{$t('student.placeOnfile')}}
                    </el-button> -->
                </template>
            </el-table-column>
        </TableSearch>
        <Dialog ref="dialog" :title="$t('student.setAllFollowBy')" @submit="submit">
            <template slot="content">
                <el-row>
                    <SearchBar width="100%" link="system/associative" :placeholder="$t('student.inputFollowBy')"
                               :title="$t('student.inputFollowBy')" v-model="formData.followMemberId"
                               :nameLike="formData.memberName" :pushCallback="pushCallbackFn" :searchOpt="searchOptFn"
                               :editSearchOpt="true"></SearchBar>
                </el-row>
                <hr style="margin-top:20px;margin-bottom: 0px;">
                <el-row style="padding-top:20px;">
                    {{$t('student.targetStudent')}}
                </el-row>
                <el-row style="padding-top:10px;">
                    <TableBar size="mini" height="250" :colConfigs="colConfigs1" :data="studentData"></TableBar>
                </el-row>
            </template>
        </Dialog>
        <Dialog ref="dialog1" :title="$t('student.stopAllAndStartClass')" @submit="submit1"
                :submitText="!isStopClass?$t('student.stopClass'):$t('student.restartClass')">
            <template slot="content">
                <el-form :model="formData1" :rules="rules" size="medium" ref="formData1" label-width="100px"
                         label-position="left" :validate-on-rule-change="false">
                    <el-row v-if="!isStopClass">
                        <el-form-item :label="$t('student.timeLabel')" ref="date" required>
                            <el-col :span="12">
                                <FormItem prop="stopClasStartDt"
                                          :rules="[{ required: true, message: $t('form.required'), trigger: 'change' }]"
                                          :label="$t('student.stopClasStartDt')" :isShowLabel="false">
                                    <DatePickerStart v-model="formData1" :width="200" keyName="stopClasStartDt"
                                                     otherKeyName="stopClasEndDt"
                                                     :placeholder="$t('student.stopClasStartDt')"></DatePickerStart>
                                </FormItem>
                            </el-col>
                            <el-col :span="12">
                                <FormItem prop="stopClasEndDt"
                                          :rules="[{ required: true, message: $t('form.required'), trigger: 'change' }]"
                                          :label="$t('student.stopClasEndDt')" :isShowLabel="false">
                                    <DatePickerEnd v-model="formData1" :width="200" keyName="stopClasEndDt"
                                                   otherKeyName="stopClasStartDt"
                                                   :placeholder="$t('student.stopClasEndDt')"></DatePickerEnd>
                                </FormItem>
                            </el-col>
                        </el-form-item>
                    </el-row>
                    <el-row style="padding-top:10px;" v-if="!isStopClass">
                        <el-form-item :label="$t('student.stopClasRemarkLabel')" ref="date" required>
                            <el-input v-model="formData1.stopClasRemark" class="textarea" rows="4" type="textarea"
                                      :placeholder="$t('student.stopClasRemark')"
                                      :title="$t('student.stopClasRemark')"></el-input>
                        </el-form-item>
                    </el-row>
                    <hr style="margin-top:20px;margin-bottom: 0px;" v-if="!isStopClass">
                    <el-row style="padding-top:20px;">
                        {{$t('student.targetStudent')}}
                    </el-row>
                    <el-row style="padding-top:10px;">
                        <TableBar size="mini" height="250" :colConfigs="colConfigs1" :data="studentData"></TableBar>
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
        name: 'student',
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
                    {prop: 'stuName', label: this.$t('student.stuNameLabel')},
                    {prop:'campusName',label:this.$t('student.campusIdLabel')},
                    {prop:'sexDisplay',label:this.$t('student.sexLabel')},
                    {prop: 'tel', label: this.$t('student.telLabel')},
                    {prop: 'clasNames', label: this.$t('student.clasNamesLabel')},
                    {prop:'stuTypeDisplay',label:this.$t('student.stuTypeLabel')},
                    {prop: 'clasStatusDisplay', label: this.$t('student.clasStatusLabel')},
                    {prop: 'updateBy', label: this.$t('table.updateBy')},
                    {prop: 'updateDt', label: this.$t('table.updateDt')},
                    // 模版中的元素需要对应的有 slot="opt" 属性
                    {slot: 'opt'}
                ],
                colConfigs1: [
                    {prop: 'stuName', label: this.$t('student.stuNameLabel')},
                    {prop: 'clasNames', label: this.$t('student.clasNamesLabel')},
                    {prop: 'followMemberName', label: this.$t('student.followMemberNameLabel')},
                ],
                isStopClass: false,
                studentData: [],
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
                    stopClasStartDt: [
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
                    stopClasStartDt: null,
                    stopClasEndDt: null,
                    stopClasRemark: null
                }
            }
        },
        created() {
            this.init()
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
                        url: baseURL + "stu/find_paging",
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
                        // this.studentData = [row];
                        // this.stopAllAndStartClass(row)
                        this.$store.commit("addTabAndActive", {
                            url: "/student/detailStudent",
                            data: {
                                stuId: row.stuId
                            }
                        });
                    },
                    // 1: () => {
                    //     this.$store.commit("addTabAndActive", {
                    //         url: "/student/groupOfClass",
                    //         data: {
                    //             stuId: row.stuId
                    //         }
                    //     });
                    // },
                    1: () => {
                       this.setStatus(row,1)
                    },
                    2: () => {
                       this.setStatus(row,0)
                    },
                    3: () => {
                        this.$confirm(this.$t("student.msg6",{name:row.stuName}), '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                            }).then(() => {
                             this.delete(row)
                        })
                       
                    }
                }
                obj[status]();
            },
            file(row){
                this.$axios.post({
                    url:baseURL+"student/studentfile",
                    data:{
                        studentIn:row.stuId
                    },
                    success:(res)=>{
                        this.getTableData()
                    }
                })
            },
            add() {
                this.$store.commit("addTabAndActive", {
                    url: "/student/addStudent"
                });
            },
            setStatus(row, status) {
                baseFn.call(this, {
                    path: "stu/edit",
                    data: {
                        stuId: row.stuId,
                        status: status
                    }
                })
            },
            delete(row) {
                baseFn.call(this, {
                    path: "stu/delete",
                    data: {
                        stuId: row.stuId
                    }
                })
            },
            setFollowBy() {
                //设置跟进人
                if (this.studentData.length === 0) {
                    this.$alert(this.$t("student.msg2"));
                    return
                }
                this.formData.memberName = "";
                this.formData.followMemberId = null;
                this.$refs.dialog.show()
            },
            stopAllAndStartClass() {
                //批量停/复课
                if (this.studentData.length === 0) {
                    this.$alert(this.$t("student.msg2"));
                    return
                }
                this.formData1.stopClasStartDt = null;
                this.formData1.stopClasEndDt = null;
                this.formData1.stopClasRemark = null;
                let clasStatusArr = getTableSectionData({
                    tableData: this.studentData,
                    itemName: ["clasStatus"],
                    filter: (row) => {
                        return Number(row.clasStatus);
                    }
                })
                if (!(clasStatusArr.every((item) => item === 0) || clasStatusArr.every((item) => item === 1))) {
                    this.$alert(this.$t("student.msg3"));
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
                this.studentData = v;
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
            submit() {
                let formData = clone(this.formData);
                if (this.formData.followMemberId === 0 || isEmpty(this.formData.followMemberId)) {
                    this.$alert(this.$t('student.msg4'))
                    return
                }
                formData.stuIds = getTableSectionData({tableData: this.studentData, itemName: ["stuId"]});
                delete formData["memberName"]
                this.$axios.post({
                    url: baseURL + "student/charge_member",
                    data: formData,
                    success: (res) => {
                        this.$message({
                            message: res.message,
                            type: 'success'
                        })
                        this.$refs.dialog.close()
                        this.getTableData()
                    }
                })
            },
            submit1() {
                let url = "";
                if (this.isStopClass) {
                    url = "student/start_clas";
                } else {
                    url = "student/stop_clas";
                }
                let formData = clone(this.formData1);
                formData.stuIds = getTableSectionData({tableData: this.studentData, itemName: ["stuId"]});
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
    .student {
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