import {isEmpty,debounce} from "assets/js/reused";
import {validateHasDecimal,validateNumber} from "assets/js/vuelidate";
import { getCodeDisplay } from "../../assets/js/reused";
let accountMixin={
    data(){
        return {
            trainData:[],
            trainLevels:[],
            cardDiscounts:[],//卡优惠
            curCardData:{},//当前卡种信息
            curCardDiscountData:{},//当前卡优惠信息
            cardData:[],
            actItem:{},//账户信息
            formData2: {
                trainId:null,
                cardId:null,
                unitAmount:null,
                discountAmount:null,//已优惠金额
                cardDiscountItemId:null,
                receivableAmount:null,
                receivedVal:null,
                receivedAmount:null,
                isArrears:true,
                remark:null
            },
            rules: {
                trainLevelId:[{
                    required: true,
                   message:this.$t('form.required'),
                   trigger: "change"
                 }],
                 cardId:[{
                   required: true,
                   message: this.$t('form.required'),
                   trigger: "change"
                 }],
                 trainId:[{
                   required: true,
                   message: this.$t('form.required'),
                   trigger: "blur"
                 }],
                 unitAmount:[{
                   required:true,
                   message: this.$t('form.required'),
                   trigger: "blur"
                 }],
                //  validateHasDecimal
                 mdiscountAmount:[
                 {
                  validator:validateHasDecimal
                 }
                ],
                receivedVal:[{
                  required: true,
                  message: this.$t('form.required'),
                },{
                  validator: validateNumber
                }]
            }
        }
    },
    methods: {
        async trainFind(data={}){
            // this.trainData=await post("card/traincardvo_find",data);
            this.$nextTick(()=>{
              if(isEmpty(this.formData2.trainId)){
                this.$refs.trainId.selectDefaultData()
              }
            })
        },
        getReceivableAmount(){
          if(this.curCardDiscountData&&this.curCardDiscountData.discount&&this.curCardDiscountData.discount<10){
            let result=(this.curCardData.salesAmount-(((10-this.curCardDiscountData.discount)/10)*(this.curCardData.salesAmount))).toFixed(2);
            if(isNaN(result)){
              return (this.curCardData.salesAmount-(((10-this.curCardDiscountData.discount)/10)*(this.curCardData.salesAmount))).toFixed(2);
            }else{
              return result;
            }
          }else{
            //售价减去其他金额如果小于保底金额等于保底金额
            if((this.curCardData.salesAmount)<this.curCardData.guaranteeAmount){
             
              return this.curCardData.guaranteeAmount.toFixed(2);
            }else{
              return (this.curCardData.salesAmount).toFixed(2);
            }
          }
        },
        getTrainId(v){
            this.trainData.map((item)=>{
              if(item.trainId===v){
                this.cardData=item.cardVos;
                this.trainLevels=item.trainLevels;
                this.actItem=item;
              }
            })
            this.$nextTick(()=>{
              if(this.$refs.cardId){
                this.$refs.cardId.selectDefaultData();
              }
              if(this.$refs.trainLevelId){
                this.$refs.trainLevelId.selectDefaultData();
              }
            })
        },
        getCardId(cardId){
          debounce(async()=>{
            let data=await post("card/find",{
              cardId
            });
            data.cardTypeDisplay=this.filterCardType(data.cardType);
            this.curCardData=data;
            //卡次数
            this.formData2.receivedVal=this.curCardData.cardType==='1'?this.curCardData.cardVal:this.curCardData.useDay;
            //应收金额
            this.formData2.receivableAmount=this.getReceivableAmount();
          },200)
        },
        receivableAmountChange(receivableAmount){
          //只有有效期才进行更改
          if(this.curCardData.cardType==='2'){
            if(!isNaN(Number(receivableAmount))){
              this.curCardData.unitAmount=(receivableAmount/this.curCardData.useDay).toFixed(2);
            }else{
              this.curCardData.unitAmount=0;
            }
          }
         
        },
        getCardDiscountItemId(v){
            this.cardDiscounts.map((item)=>{
              if(item.cardDiscountItemId===v){
                this.curCardDiscountData=item;
              }
            })
            //计算优惠金额
            if(this.curCardDiscountData.discount<10){
              this.formData2.discountAmount=(((10-this.curCardDiscountData.discount)/10)*(this.curCardData.salesAmount)).toFixed(2);
            }else{
              this.formData2.discountAmount=0;
            }
          },
        // getCardId(v){
        //     this.formData2.cardDiscountItemId=null
        //     this.cardData.map((item)=>{
        //       if(item.cardId===v){
        //         this.curCardData=item;
        //         this.formData2.unitAmount=item.unitAmount;
        //         this.cardDiscounts=item.cardDiscounts;
        //       }
        //     })
        //     this.$nextTick(()=>{
        //       if(this.$refs.cardDiscountItemId){
        //          this.$refs.cardDiscountItemId.selectDefaultData();
        //       }
        //     })
        //   },
        filterCardType(v){
          return getCodeDisplay(this.codeData.cardType,v);
        },
        edit(){
            this.$refs.dialog.show()
        },
        submit(){
            this.$refs["formData5"].validate((valid) => {
              if (valid) {
                this.$refs.dialog.close()
                this.curCardData.unitAmount=this.formData2.unitAmount;
              } else {
                console.log('error submit!!');
                return false;
              }
            });
          },
    }
}
export default accountMixin;