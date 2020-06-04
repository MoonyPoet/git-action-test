import {isEmpty} from "assets/js/reused";
import {validateHasDecimal} from "assets/js/vuelidate";
let accountMixin={
    data(){
        return {
            trainData:[],
            trainLevels:[],
            cardDiscounts:[],//卡优惠
            curCardData:{},//当前卡种信息
            curCardDiscountData:{},//当前卡优惠信息
            cardData:[],
            formData2: {
                trainId:null,
                cardId:null,
                unitAmount:null,
                discountAmount:null,//已优惠金额
                cardDiscountId:null,
                mdiscountAmount:null,
                receivableAmount:null,
                amount:null,
                isArrears:true
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
                ]
            }
        }
    },
    computed:{
        receivableAmount(){
          let mdiscountAmount;
          if(isEmpty(this.formData2.mdiscountAmount)){
            mdiscountAmount=0;
          }else{
            mdiscountAmount=Number(this.formData2.mdiscountAmount)
          }
          if(this.curCardDiscountData&&this.curCardDiscountData.discount&&this.curCardDiscountData.discount<10){
            let result=(this.curCardData.salesAmount-(((10-this.curCardDiscountData.discount)/10)*(this.curCardData.salesAmount))-mdiscountAmount).toFixed(2);
            if(isNaN(result)){
              return (this.curCardData.salesAmount-(((10-this.curCardDiscountData.discount)/10)*(this.curCardData.salesAmount))).toFixed(2);
            }else{
              return result;
            }
          }else{
            //售价减去其他金额如果小于保底金额等于保底金额
            if((this.curCardData.salesAmount-mdiscountAmount)<this.curCardData.guaranteeAmount){
             
              return this.curCardData.guaranteeAmount.toFixed(2);
            }else{
              return (this.curCardData.salesAmount-mdiscountAmount).toFixed(2);
            }
          }
        }
    },
    methods: {
        getCampusId(v){
            this.trainFind({
             campusIds:v
           })
        },
        async trainFind(data={}){
            this.trainData=await post("card/traincardvo_find",data);
            this.$nextTick(()=>{
              if(isEmpty(this.formData2.trainId)){
                this.$refs.trainId.selectDefaultData()
              }
            })
        },
        getTrainId(v){
            this.trainData.map((item)=>{
              if(item.trainId===v){
                this.cardData=item.cardVos;
                this.trainLevels=item.trainLevels;
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
        getCardDiscountId(v){
            this.cardDiscounts.map((item)=>{
              if(item.cardDiscountId===v){
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
        getCardId(v){
            this.cardData.map((item)=>{
              if(item.cardId===v){
                this.curCardData=item;
                this.formData2.unitAmount=item.unitAmount;
                this.cardDiscounts=item.cardDiscounts;
              }
            })
            this.$nextTick(()=>{
              if(this.$refs.cardDiscountId){
                 this.$refs.cardDiscountId.selectDefaultData();
              }
            })
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