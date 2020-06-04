<template>
    <div class="add_card_discount">
        <el-form :model="formData" :rules="rules" size="medium" ref="formData" label-width="200px" label-position="left" class="base_form">
            <el-form-item :label="$t('addCardDiscount.cardDiscountNameLabel')" prop="cardDiscountName">
            <el-input v-model="formData.cardDiscountName" :placeholder="$t('addCardDiscount.cardDiscountName')"></el-input>
            </el-form-item>
            <el-form-item :label="$t('addCardDiscount.timeLabel')" ref="date" required>
              <el-col>
                 <FormItem>
                   <RadioOpt v-model="formData.isLimite" @change="isLimeChange" :data="options"></RadioOpt>
                 </FormItem>
                
              </el-col>
              <el-row v-if="formData.isLimite" style="margin-top:20px;">
                  <el-col :span="12">
                    <FormItem prop="startDt" :rules="[{ required: true, message: $t('form.required'), trigger: 'change' }]" :label="$t('addCardDiscount.startTime')" :isShowLabel="false">
                      <DatePickerStart v-model="formData" :width="140" keyName="startDt" otherKeyName="endDt" :placeholder="$t('addCardDiscount.startTime')"></DatePickerStart>
                    </FormItem>
                  </el-col>
                  <el-col :span="12">
                    <FormItem prop="startDt" :rules="[{ required: true, message: $t('form.required'), trigger: 'change' }]" :label="$t('addCardDiscount.endTime')" :isShowLabel="false">
                        <DatePickerEnd  v-model="formData" :width="140" keyName="endDt" otherKeyName="startDt" :placeholder="$t('addCardDiscount.endTime')"></DatePickerEnd>
                    </FormItem>
                  </el-col>
              </el-row>
           </el-form-item>
            <el-form-item :label="$t('addCardDiscount.desLabel')" prop="des">
              <el-input v-model="formData.des" class="textarea"  rows="4" type="textarea" :placeholder="$t('addCardDiscount.des')"></el-input>
            </el-form-item>
            <el-form-item :label="$t('addCardDiscount.cityLabel')" prop="areaId">
              <SelectOpt v-model="formData.areaId" @change="getAreaId" ref="areaId" :data="areaData" :placeholder="$t('addCardDiscount.city')"></SelectOpt>
            </el-form-item>
            <el-form-item :label="$t('addCardDiscount.campusLabel')" prop="campusIds">
              <CheckBox v-if="formData.areaId!==''" @change="getCampusId" v-model="formData.campusIds" ref="campusIds" :data="campusData" :placeholder="$t('addCardDiscount.campus')"></CheckBox>
              <span v-else>{{$t('addCardDiscount.city')}}</span>
            </el-form-item>
            <FormItem :label="$t('addCardDiscount.cardDiscountDetailLabel')" required :width="900" required>
                  <el-table
                    v-if="formData.cardDiscountItems.length>0"
                    :data="formData.cardDiscountItems"
                    ref="multipleTable"
                    border
                      @selection-change="handleSelectionChange"
                    >
                    <el-table-column
                        type="selection"
                        width="55">
                    </el-table-column>
                    <el-table-column
                    :label="$t('addCardDiscount.cardName')" width="80">
                    <template slot-scope="scope">
                        <span>{{ scope.row.cardName }}</span>
                    </template>
                    </el-table-column>
                    <el-table-column
                    :label="$t('addCardDiscount.salesAmount')">
                    <template slot-scope="scope">
                    <span>{{ scope.row.salesAmount}}</span>
                    </template>
                    </el-table-column>
                      <el-table-column
                   :label="$t('addCardDiscount.cardVal')">
                    <template slot-scope="scope">
                      <span v-if="scope.row.cardType==='1'">{{ scope.row.cardVal}}</span>
                      <span v-else>/</span>
                    </template>
                    </el-table-column>
                    <el-table-column
                    :label="$t('addCardDiscount.discount')">
                    <template slot-scope="scope">
                      <span>
                        <FormItem :width="120" :label="$t('addCardDiscount.discount')" :prop="'cardDiscountItems.' + scope.row.index + '.discount'" :rules="[
                          {validator: validateHasTwoDecimal}
                          ]"
                          :isShowLabel="false"
                          >
                          <el-input v-model="formData.cardDiscountItems[scope.row.index].discount"></el-input>
                        </FormItem>
                      </span>
                    </template>
                    </el-table-column>
                    <el-table-column
                   :label="$t('addCardDiscount.giveVal')">
                    <template slot-scope="scope">
                      <span><el-input v-model="formData.cardDiscountItems[scope.row.index].giveVal"></el-input></span>
                    </template>
                    </el-table-column>
                    <el-table-column
                    :label="$t('addCardDiscount.giveOther')">
                    <template slot-scope="scope">
                    <span><el-input v-model="formData.cardDiscountItems[scope.row.index].giveOther"></el-input></span>
                    </template>
                    </el-table-column>             
                </el-table>
                <span v-else>{{$t('addCardDiscount.noCard')}}</span>
            </FormItem>
            <el-form-item>
            <el-button type="primary" @click="submitForm('formData')" class="submit_button">{{$t('form.submit')}}</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
import {clone,getCookie,validateForm,getCode,reEmphasis,isEmpty,getTableSectionData} from "assets/js/reused";
import {validateHasTwoDecimal} from "assets/js/vuelidate";
import DatePickerStart from "common/DatePickerStart";
import DatePickerEnd from "common/DatePickerEnd";
import {campusFind1} from "assets/js/mixin";
import couponMixin from "./mixin";
import {getCampusVos} from "assets/js/common";
import FormItem from "common/FormItem";
import SelectOpt from "common/SelectOpt";
import CheckBox from "common/CheckBox";
import RadioOpt from "common/RadioOpt";
export default {
  components: {DatePickerStart,DatePickerEnd,FormItem,SelectOpt,CheckBox,RadioOpt},
  name: 'addCardDisCount',
  mixins:[campusFind1,couponMixin],
  data() {
    return {
      formData: {
        cardDiscountName:"",
        startDt:null,
        endDt:null,
        des:null,
        areaId:null,
        campusIds:[],
        isLimite:1,
        cardDiscountItems:[]
      },
      options:[{value:1,display:this.$t('cardDiscount.limitedPeriod')},{value:0,display:this.$t('cardDiscount.indefinite')}],
      codeData:{},
      multipleSelection:[],
      rules:{
        cardDiscountName:[
          { required: true, message: this.$t("form.required"), trigger: 'blur' },
        ],
        startDt:[
          { required: true, message: this.$t('form.required'), trigger: 'change' },
        ],
        endDt:[
          { required: true, message: this.$t('form.required'), trigger: 'change' },
        ],
        des:[
          { required: true, message: this.$t("form.required"), trigger: 'blur' },
        ],
        province:[
          { required: true, message: this.$t('form.required'), trigger: 'change' }
        ],
        campusIds:[
          { required: true, message: this.$t('form.required'), trigger: 'change' }
        ]
      }
    };
  },
  created(){
    this.init()
  },
  methods: {
    async init(){
      this.codeData=await getCode("campus");
      this.areaData=this.codeData.area;
      this.$nextTick(()=>{
        this.$refs.areaId.selectDefaultData();
      })
    },
    isLimeChange(){
      this.formData.startDt=null;
      this.formData.endDt=null;
    }, 
    validateHasTwoDecimal(){
      let argu=Array.prototype.slice.apply(arguments);
      return validateHasTwoDecimal.apply(null,argu);
    },
    getCampusId(v){
      this.cardFind(v)
    },
    async cardFind(v){
      //查卡
      this.formData.cardDiscountItems=[];
      let cardData=await post("card/find_campus_card",{
        campusIds:v.toString()
      })
      cardData.map((item,index)=>{
        this.formData.cardDiscountItems.push({
           cardId:item.value,
           cardName:item.display,
           salesAmount:item.salesAmount,
           cardType:item.cardType,
           cardVal:item.cardVal,
           checked:false,
           index:index,
           discount: "",
           giveVal: "",
           giveOther: ""
        })
      })
    },
    handleSelectionChange(val) {
      let cardIds=getTableSectionData({tableData:val,itemName:["cardId"],getArr:true});
      this.formData.cardDiscountItems.map((item)=>{item.checked=false})
      this.formData.cardDiscountItems.map((item,index)=>{
        // this.rules["cardDiscountItems."+index+".discount"]=[{validator: validateHasTwoDecimal}];
        if(cardIds.some((cardId)=>cardId===item.cardId)){
          item.checked=true;
        }
      })
    },
    submitForm(formName) {
      let formData=clone(this.formData);
      //按照城市分组得到对应的校区的length;
      if(isEmpty(this.campusData)){
        this.$alert(this.$t("cardDiscount.msg1"))
        return
      }
      formData.cardDiscountItems=formData.cardDiscountItems.filter((item)=>item.checked===true);
      if(isEmpty(formData.cardDiscountItems)){
        this.$alert(this.$t("cardDiscount.msg2"))
        return
      }
      formData.cardDiscountItems.map((item)=>{
        if(isEmpty(item.discount)){
          item.discount=10;
        }
        if(isEmpty(item.giveVal)){
          item.giveVal=0;
        }
        if(isEmpty(item.giveOther)){
          item.giveOther="";
        }
        delete item.checked;
        delete item.index;
        delete item.cardName;
        delete item.salesAmount;
        delete item.cardVal;
        delete item.cardType;
      })
      //处理成后端需要的数据
      delete formData["campusIds"];
      delete formData["areaId"];
      if(formData.isLimite===0){
        formData.startDt=0;
        formData.endDt=0;
      }
      delete formData.isLimite;
      validateForm({
        form: this.$refs["formData"],
        formData: formData,
        url: "card_discount/add",
        success:(res)=>{
            this.$message({
              message:res.message,
              type: 'success'
            })
            this.$store.commit("deleteTabAndGo")
        }
      });
    },
  },
};

</script>
<style lang="scss" scoped>
/deep/.el-checkbox-group{
  width: 600px;
}
</style>
