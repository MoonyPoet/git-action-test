let couponMixin={
    data(){
        return {
            rules: {
                cardDiscountName: [
                    { required: true, message: this.$t("form.required"), trigger: 'blur' },
                ],
                startDt:[
                    { required:true,message:this.$t("form.required"),trigger:'blur'}
                ],
                endDt:[
                    { required:true,message:this.$t('form.required'),trigger:'blur'}
                ]
            }
        }
    },
    methods: {
        computedUnitAmount(){
            if(!isEmpty(this.formData.salesAmount.toString().trim())&&!isEmpty(this.formData.salesAmount.toString().trim())){
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