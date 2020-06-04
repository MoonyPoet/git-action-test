import {isEmpty} from "assets/js/reused";
let couponMixin={
    data(){
        return {
            rules: {
                province:[
                    { required: true, message: this.$t('form.required'), trigger: 'change' },
                ],
                campusIds:[
                    { required: true, message: this.$t("form.required"), trigger: 'blur' },
                ],
                trainId:[
                    { required: true, message: this.$t("form.required"), trigger: 'blur' },
                ],
                cardName: [
                    { required: true, message: this.$t("form.required"), trigger: 'blur' },
                    {max:10,message:"不能超过10个字节"}
                ],
                cardType:[
                    { required:true,message:this.$t("form.required"),trigger:'blur'},
                ],
                cardVal:[
                    { required:true,message:this.$t("form.required"),trigger:'blur'}
                ],
                useDay:[
                    { required:true,message:this.$t('form.required'),trigger:'change'}
                ],
                unitAmount:[
                    { required:true,message:this.$t("form.required"),trigger:'blur'}
                ],
                salesAmount:[
                    { required:true,message:this.$t("form.required"),trigger:'blur'}
                ],
                guaranteeAmount:[
                    { required:true,message:this.$t("form.required"),trigger:'blur'}
                ],
                isLeaveDeduct:[
                    { required:true,message:this.$t("form.required"),trigger:'change'}
                ]
            }
        }
    },
    methods: {
        computedUnitAmount(){
            if(!isEmpty(this.formData.salesAmount.toString().trim())&&!isEmpty(this.formData.cardVal.toString().trim())){
              this.formData.unitAmount=(parseFloat(this.formData.salesAmount)/parseFloat(this.formData.cardVal)).toFixed(2)
            }else{
              this.formData.unitAmount=0;
            }
          },
          cardTypeChange(){
            this.formData.cardVal="";
            this.formData.useDay="";
            this.formData.unitAmount="";
          }
    }
}
export default couponMixin