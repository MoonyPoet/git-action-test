<template>
    <div class="edit_member">
        <el-form :model="formData" size="medium" ref="formData" label-width="200px" label-position="left"
                 class="base_form" :validate-on-rule-change="false">
            <el-row style="margin:10px 0px;">
                <el-col :span="1" style="height:1px;">
                </el-col>
                <el-col :span="2" class="linear">
                    {{$t('member.personalInfoLabel')}}
                </el-col>
                <el-col :span="21"><span class="linear_span"></span></el-col>
            </el-row>
            <el-form-item :label="$t('member.campusNameLabel')" prop="campusIds">
                {{formData.areaCampus}}
            </el-form-item>
            <el-row>
                <el-col :span="8">
                    <el-form-item :label="$t('member.roleIdsLabel')" ref="roleIds" prop="roleIds">
                        {{formData.roleNames}}
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item :label="$t('member.positionIdLabel')" ref="positionId" prop="positionId">
                        {{formData.positionName}}
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item :label="$t('member.memberNameLabel')" ref="memberName">
                        {{formData.memberName}}
                    </el-form-item>
                    <el-form-item :label="$t('member.sexLabel')" ref="sex" prop="sex">
                        {{formData.sexDisplay}}
                    </el-form-item>
                    <el-form-item :label="$t('member.accountLabel')" ref="sex" prop="sex">
                        {{formData.account}}
                    </el-form-item>
                    <el-form-item :label="$t('member.passwordLabel')" ref="sex" prop="sex">
                        <el-button type="primary" @click="resetPassword">{{$t('member.resetPassword')}}</el-button>
                    </el-form-item>
                </el-col>
                <el-col :span="16">
                    <el-form-item :label="$t('member.headImgLabel')" ref="headImg" prop="headImg">
                        <ImageBar :load="formData.headImg" :fail='failIcon' width="200" height="200"></ImageBar>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item :label="$t('member.telLabel')" ref="tel" prop="tel">
                        {{formData.tel}}
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item :label="$t('member.majorLabel')" ref="major" prop="major">
                        {{formData.major}}
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item :label="$t('member.nationLabel')" ref="nation" prop="nation">
                        {{formData.nation}}
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item :label="$t('member.nativePlaceLabel')" ref="nativePlace" prop="nativePlace">
                        {{formData.nativePlace}}
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item :label="$t('member.birthDtLabel')" ref="birthDt" prop="birthDt">
                        {{formData.birthDt}}
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item :label="$t('member.idCardLabel')" ref="idCard" prop="idCard">
                        {{formData.idCard}}
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item :label="$t('member.politicalOutlookLabel')" ref="politicalOutlook"
                                  prop="politicalOutlook">
                        {{formData.politicalOutlookDisplay}}
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item :label="$t('member.marriageStatusLabel')" ref="marriageStatus" prop="marriageStatus">
                        {{formData.marriageStatusDisplay}}
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item :label="$t('member.educationLabel')" ref="education" prop="education">
                        {{formData.education}}
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item :label="$t('member.gradSchoolLabel')" ref="gradSchool" prop="gradSchool">
                        {{formData.gradSchool}}
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row style="margin:10px 0px;">
                <el-col :span="1" style="height:1px;">
                </el-col>
                <el-col :span="2" class="linear">
                    {{$t('member.personnelMattersLabel')}}
                </el-col>
                <el-col :span="16"><span class="linear_span"></span></el-col>
                <el-col :span="4" :offset="1">
                    <el-button @click="showMore">
                        {{showPlane===false?$t('form.launchMoreLabel'):$t('form.packUpLabel')}}
                    </el-button>
                </el-col>
            </el-row>
            <el-row v-show="showPlane">
                <el-row>
                    <el-col :span="8">
                        <el-form-item :label="$t('member.positionStatusLabel')" ref="positionStatus"
                                      prop="positionStatus">
                            {{formData.positionStatusDisplay}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item :label="$t('member.entryDtLabel')" ref="entryDt" prop="entryDt">
                            {{formData.entryDt}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item :label="$t('member.contractStatusLabel')" ref="contractStatus"
                                      prop="contractStatus">
                            {{formData.contractStatusDisplay}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item :label="$t('member.contractNumLabel')" ref="contractNum" prop="contractNum">
                            {{formData.contractNum}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item :label="$t('member.contractDateLabel')">
                            {{formData.contractStartDt}}-{{formData.contractEndDt}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item :label="$t('member.contractRelationsLabel')" ref="contractRelations"
                                      prop="contractRelations">
                            {{formData.contractRelationsDisplay}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item :label="$t('member.socialSecurityStatusLabel')" ref="socialSecurityStatus"
                                      prop="socialSecurityStatus">
                            {{formData.socialSecurityStatusDisplay}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item :label="$t('member.salaryNameLabel')" ref="salaryName" prop="salaryName">
                            {{formData.salaryName}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item :label="$t('member.salaryBankLabel')" ref="salaryOpeningBank"
                                      prop="salaryOpeningBank">
                            {{formData.salaryOpeningBank}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item :label="$t('member.salaryNumLabel')" ref="salaryNum" prop="salaryNum">
                            {{formData.salaryNum}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item :label="$t('member.remarkLabel')" ref="remark" prop="remark">
                            {{formData.remark}}
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-row>
            <el-row>
                <el-form-item>
                    <BackButton></BackButton>
                </el-form-item>
            </el-row>
        </el-form>
    </div>
</template>
<script>
    import {
        clone,
        getCookie,
        validateForm,
        getCode,
        bindData,
        isEmpty,
        reEmphasis,
        getTableSectionData
    } from "assets/js/reused";
    import BackButton from "common/BackButton";
    import failIcon from "assets/img/student.png";
    import ImageBar from 'common/ImageBar';

    export default {
        components: {BackButton, ImageBar},
        name: 'memberDetail',
        data() {
            return {
                formData: {
                    account: null,
                    areaCampus: null,
                    birthDt: null,
                    campusIds: null,
                    contractEndDt: null,
                    contractNum: null,
                    contractRelations: null,
                    contractRelationsDisplay:null,
                    contractStartDt: null,
                    contractStatus: null,
                    contractStatusDisplay:null,
                    createBy: null,
                    createDt: null,
                    education: null,
                    entryDt: null,
                    gradSchool: null,
                    headImg: null,
                    idCard: null,
                    major: null,
                    marriageStatus: null,
                    marriageStatusDisplay:null,
                    memberId: null,
                    memberName: null,
                    memberNamePy: null,
                    memberNamePysx: null,
                    nation: null,
                    nativePlace: null,
                    politicalOutlook: null,
                    politicalOutlookDisplay:null,
                    positionId: null,
                    positionName: null,
                    positionStatus: null,
                    positionStatusDisplay:null,
                    remark: null,
                    roleIds: null,
                    roleNames: null,
                    salaryBank: null,
                    salaryName: null,
                    salaryNum: null,
                    sexDisplay: null,
                    socialSecurityStatus: null,
                    statusDisplay: null,
                    tel: null,
                    contractStatusDisplay:null,
                    socialSecurityStatusDisplay:null
                },
                showPlane: false,
                failIcon: failIcon
            };
        },
        created() {
            this.init()
        },
        methods: {
            async init() {
                let pageData = await post("member/details", {
                    memberId: this.$route.query.memberId
                })
                bindData({formData: this.formData, res: pageData});
            },
            showMore() {
                this.showPlane = !this.showPlane;
            },
            resetPassword() {
                this.$confirm(this.$t("member.resetPasswordMsg"), this.$t("components.tips"), {
                    confirmButtonText: this.$t("components.confirm"),
                    cancelButtonText: this.$t("components.cancel"),
                    type: 'warning'
                }).then(() => {
                    this.resetPasswordFn()
                })
            },
            resetPasswordFn() {
                this.$axios.post({
                    url: baseURL + "member/reset_password",
                    data: {
                        memberId: this.$route.query.memberId
                    },
                    success: (res) => {
                        this.$message({
                            type: 'success',
                            message: res.message
                        });
                    }
                })
            }
        }
    };

</script>