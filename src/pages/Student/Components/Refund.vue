<template lang='html'>
    <Dialog ref="dialog" title="退费" @submit="submit">
         <el-form
         slot="content"
        ref="formData"
        :rules="rules"
        :model="formData"
        label-width="150px"
        label-position="left"
      >
        <el-form-item
          label="目前剩余"
        >
          {{formData.remain}}
        </el-form-item>
        <el-form-item
          label="退费金额"
          prop="receivedAmount"
        >
          <el-input
            class="des"
            v-model="formData.receivedAmount"
            placeholder="请输入退费金额"
          ></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            class="des"
            type="textarea"
            rows="3"
            v-model="formData.remark"
          ></el-input>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="close">取 消</el-button>
        <el-button
          type="primary"
          @click="submit();"
        >确 定</el-button>
      </span>
    </Dialog>
</template>
<script>
    import {
    clone,
    getCookie,
    debounce,
    deleteForArr,
    selectDefaultData,
    isEmpty,
    getCode,
    validateForm,
    getCodeDisplay,
    resetObj
  } from "assets/js/reused";
    import {
    validateHasDecimal
  } from "assets/js/vuelidate";
    import Day from "common/Day";
    import Dialog from "common/Dialog";
    import SearchBar from "common/SearchBar";
    import SelectOpt from "common/SelectOpt";
     export default {
        name: 'makeup',
        props:{
            shopId:{
                type:Number
            }
        },
        components:{
            Day,
            SearchBar,
            Dialog,
            SelectOpt
        },
        data () {
            return{
                formData: {
                    //补费
                    stuCardId: null,
                    receivedAmount: null,
                    remark: null,
                    remain:null
                },
                cardData:{},
                pickerOptions:{
                    disabledDate(time) {
                        return time.getTime() > Date.now();
                    }
                },
                rules:{
                    receivedAmount:[{
                        required: true,
                        message:"必填",
                        trigger: "blur"
                    },{
                      trigger: "blur",
                      validator: validateHasDecimal
                    }],
                    remark:[{
                        required: true,
                        message:"必填",
                        trigger: "blur"
                    }]
                }
            }
        },
        created(){
            
        },
        methods:{
            async show(v){
                resetObj(this.formData);
                this.cardData=await this.find(v);
                this.formData.stuCardId=this.cardData.stuCardId;
                this.$refs.dialog.show();
                //欠费金额等于应收减去实收
                this.formData.remain=(parseFloat(this.cardData.cardUnitAmount)*parseFloat(this.cardData.cardVal)).toFixed(2);
            },
            close(){
              this.$refs.dialog.close();
            },
            async find(v={}){
              return await post("stu/refund",v);
            },
            submit(){
                let formData = clone(this.formData);
                formData.userId=this.$route.query.userId;
                delete formData.remain;
                validateForm({
                    form: this.$refs["formData"],
                    formData: formData,
                    url: "stu/refund_add",
                    success:(res)=>{
                        this.$message({
                        message:res.message,
                        type: 'success'
                        })
                       this.$refs.dialog.close()
                       this.$emit("isSubmit",true)
                    }
                });
            }
        }
    }
</script>
<style scoped>
    
</style>