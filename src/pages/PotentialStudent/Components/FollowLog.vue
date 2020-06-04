<template>
  <div class="fixed-table">
       <TableSearch ref="table" :colConfigs="colConfigs">
            <el-button @click="addFollow" class="add" slot="add" round size="small">{{$t('followLog.addFollowLable')}}</el-button>
			<el-table-column
            :label="$t('table.operations')"
            width="100px"
            slot="opt"
            >
            <template slot-scope="scope">
                <el-button size="mini" @click="viewContent(scope.row)" round>{{$t('followLog.viewContentLabel')}}</el-button>
            </template>
            </el-table-column>
        </TableSearch>
    <el-dialog
      :title="$t('components.tips')"
      :visible.sync="dialogVisible"
      width="600px"
      center
      >
      <el-form ref="formData" :model="formData2" label-width="200px" label-position="left" class="base_form">
         <el-form-item :label="$t('followLog.followDtLabel')">
             {{formData2.followDt}}
          </el-form-item>
          <el-form-item :label="$t('followLog.titleLabel')">
             {{formData2.title}}
          </el-form-item>
          <el-form-item :label="$t('followLog.followTypeLabel')">
            {{formData2.followTypeDisplay}}
          </el-form-item>
          <el-form-item :label="$t('followLog.desLabel')">
              {{formData2.des}}
          </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">{{$t('form.close')}}</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :title="$t('form.add')"
      :visible.sync="dialogVisible1"
      width="600px"
      center
      >
      <el-form ref="formData1" :rules="rules" :model="formData1" label-width="200px" label-position="left" class="base_form">
          <el-form-item :label="$t('followLog.followDtLabel')" prop="followDt">
             <Day v-model="formData1.followDt" :placeholder="$t('followLog.followDt')" :title="$t('followLog.followDt')"></Day>
          </el-form-item>
          <el-form-item :label="$t('followLog.titleLabel')" prop="title">
              <el-input v-model="formData1.title" :placeholder="$t('followLog.title')" :title="$t('followLog.title')"></el-input>
          </el-form-item>
          <el-form-item :label="$t('followLog.followTypeLabel')" prop="followType">
            <RadioOpt v-model="formData1.followType" :data="codeData.followType"></RadioOpt>
          </el-form-item>
          <el-form-item :label="$t('followLog.desLabel')" prop="des">
              <el-input type="textarea" class="des" rows="4" v-model="formData1.des" :placeholder="$t('followLog.des')" :title="$t('followLog.des')"></el-input>
          </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible1 = false">{{$t('form.cancel')}}</el-button>
        <el-button type="primary" @click="submitForm1">{{$t('form.submit')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Day from 'common/Day';
import RadioOpt from 'common/RadioOpt';
import TableSearch from 'common/TableSearch';
import {bindData,getCode,selectDefaultData,isEmpty,clone,getCookie,validateForm} from 'assets/js/reused';
  export default {
  components: {Day,TableSearch,RadioOpt},
  name: 'followLog',
  props:{
    newObj:Object,
    searchLike:String
  },
  data() {
    return {
      colConfigs:[
            { prop:'title', label:this.$t('followLog.titleLabel')},
            { prop:'followDt',label:this.$t('followLog.followDtLabel')},
            { prop:'followMemberId',label:this.$t('followLog.followMemberIdLabel')},
            { prop:'followTypeDisplay',label:this.$t('followLog.followTypeLabel')},
            { prop:'statusDisplay',label:this.$t('table.status')},
            { prop:'updateBy',label:this.$t('table.updateBy')},
            { prop:'updateDt',label:this.$t('table.updateDt')},
            // 模版中的元素需要对应的有 slot="opt" 属性
            { slot: 'opt' }
        ],
      formData1:{
        followDt:null,
        followType:null,
        des:null,
        title:null
      },
      formData2:{
        followTypeDisplay:null,
        followDt:null,
        des:null,
        title:null
      },
      codeData:{},
      rules:{
       followDt:[
           {required:true,trigger:"change",message:this.$t('form.required')}
       ],
        title:[
            {required:true,trigger:"blur",message:this.$t('form.required')}
        ],
        followType:[
            {required:true,trigger:"change",message:this.$t('form.required')}
        ],
        des:[
          {required:true,trigger:"blur",message:this.$t('form.required')}
        ]
      },
      dialogVisible:false,
      dialogVisible1:false,
      followType:[]
    }
  },
  created(){
    this.init()
  },
  methods: {
    async init(){
        this.codeData=await getCode("_follow_type");
    },
    addFollow(){
      this.dialogVisible1=true;
      this.formData1={
          followDt:null,
          followType:1,
          des:null,
          title:null
        }
    },
    submitForm1(){
      let formData=clone(this.formData1);
      formData.stuId=this.$route.query.stuId;
    //   formData.memberId=getCookie("baseInfo").memberId;
      validateForm({
        form: this.$refs["formData1"], 
        url:"studentfollow/add",
        formData:formData,
        success:(res)=>{
            this.$message({
                message:res.message,
                type: 'success'
            })
            this.dialogVisible1=false;
        }
      })
    },
    async viewContent(row){
      this.dialogVisible=true;
    //   let followData=await post("studentfollow/find",{
    //       stuFollowId:row.stuFollowId
    //   })
      bindData({
          formData:this.formData2,
          res:row
      })
    },
    getTableData(v) {
      //table 数据
      return new Promise((resolve, reject) => {
            let obj = Object.assign(v == undefined ? {} : v, {
                limit:this.$refs.table.getLimit(),
                offset:this.$refs.table.getOffset()
            });
            this.$axios.post({
                url: baseURL + "studentfollow/find_paging",
                data: obj,
                success: res => {
                    this.$refs.table.setTableData(res.data.rows);
                    this.$refs.table.setTotalAll(res.data.count);
                    resolve();
                }
            });
        });
    }
  }
}
</script>
