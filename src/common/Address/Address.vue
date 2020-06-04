<template>
    <el-cascader
  :options="options2"
  @active-item-change="handleItemChange"
  @change="handleChange"
  :props="props"
  v-model="selectedOptions3"
  :placeholder="placeholder"
></el-cascader>
</template>
<script>
  export default {
    props:{
      newArea:Array,
      placeholder:String
    },
    data() {
      return {
        options2: [],
        props: {
          value: 'label',
          children: 'cities'
        },
        provinceNum:"",
        provinceIndex:"",
        cityIndex:"",
        cityNum:"",
        areaNum:"",
        selectedOptions3:[]
      };
    },
    created(){
      this.getAddress().then(res=>{
        if(res.data.length!=0){
          res.data.forEach(element => {
                this.options2.push({
                  label:element.areaName,
                  provinceNum:element.areaNum,
                  isLast:element.isLast,
                  value:element.areaNum,
                  cities:element.isLast>0?[]:""
                })
          });
          this.$emit("dataLoaded",1)
        }
      })
    },
    watch:{
      newArea(newV,oldV){
        if(newV){
          this.options2.forEach(element =>{
            if(element.provinceNum==newV[0]){
              this.selectedOptions3=[element.label]
            }
          })
          //选择好第一个
          this.handleItemChange(this.selectedOptions3).then((res)=>{
            res.forEach(element =>{
              if(element.provinceNum==newV[0]){
                //绑定第二个默认值
                element.cities.forEach(a=>{
                  if(a.value==newV[1]){
                    this.selectedOptions3.push(a.label)
                  }
                })
              }
            })
            //绑定第三个默认值
            this.handleItemChange(this.selectedOptions3).then((data)=>{
              data.forEach(element=>{
                if(element.provinceNum==newV[0]){
                  element.cities.forEach(a=>{
                    if(a.value==newV[1]){
                      a.cities.forEach(b=>{
                        if(b.value==newV[2]){
                          this.selectedOptions3.push(b.label)
                        }
                      })
                    }
                  })
              }
              })
            })
          })
        }
      }
    },
    methods: {
      getAddress(parentNum=0,level=1){
        return new Promise((resolve, reject) => {
        this.$axios.post({
          url:baseURL+"system/getaddress",
          data:{
            parentNum:parentNum,
            level:level
          },
          success:(res)=>{
            resolve(res);
          }
        })
      });
      },
      callback(){
        //  this.getAddress(provinceNum,cityNum).then(res=>{
        //    this.
        //  })
      },
      handleItemChange(val) {
        return new Promise ((resolve,reject) =>{
          //已经选择第一个
          if(val.length==1){
            this.provinceNum="";
            this.provinceIndex="";
            this.options2.forEach((element,index)=>{
              if(element.label===val[0]){
                this.provinceNum=element.provinceNum;
                this.provinceIndex=index;
              }
            })
          // 减少请求，防止重复
            if(this.options2[this.provinceIndex].cities.length===0&&this.options2[this.provinceIndex].isLast>0){
              this.getAddress(this.provinceNum,2).then(res=>{
                if(res.data.length!=0){
                  res.data.forEach(element=>{
                      this.options2[this.provinceIndex].cities.push({
                        label:element.areaName,
                        cityNum:element.areaNum,
                        isLast:element.isLast,
                        value:element.areaNum,
                        cities:element.isLast>0?[]:""
                      })
                  })
                }
                 resolve(this.options2)
              })
            }
          }else{
            // 已经选择第二个
            if(this.options2[this.provinceIndex]){
              this.options2[this.provinceIndex].cities.forEach((element,index)=>{
                if(element.label===val[1]){
                  this.cityIndex=index;
                  this.cityNum=element.cityNum;
                }
              })
              //减少请求，防止重复
              if(this.options2[this.provinceIndex].cities[this.cityIndex].cities.length===0&&this.options2[this.provinceIndex].cities[this.cityIndex].isLast>0){
                this.getAddress(this.cityNum,3).then(res=>{
                  if(res.data.length!=0){
                    res.data.forEach(element=>{
                        this.options2[this.provinceIndex].cities[this.cityIndex].cities.push({
                          label:element.areaName,
                          areaNum:element.areaNum,
                          isLast:element.isLast,
                          value:element.areaNum
                        })
                    })
                  }
                  resolve(this.options2)
              })
              }
            }
          }
        })
      },
      handleChange(val){
        if(val.length==3){
          this.options2[this.provinceIndex].cities[this.cityIndex].cities.forEach((element,index)=>{
            if(element.label===val[2]){
              this.areaNum=element.areaNum
            }
          })
           /**
          省 private String provinceNum;
          市  private String cityNum;
          区 private String areaNum;*/
          // this.$emit("area",this.provinceNum,this.cityNum,this.areaNum)
          this.$emit("input",this.areaNum)
        }else if(val.length==2){
           this.options2[this.provinceIndex].cities.forEach((element,index)=>{
            if(element.label===val[1]){
              this.cityIndex=index;
              this.cityNum=element.cityNum;
            }
          })
          // this.$emit("area",this.cityNum)
          this.$emit("input",this.cityNum)
          //  this.$emit("area",this.provinceNum,this.cityNum)
        }else if(val.length==1){
           this.options2.forEach((element,index)=>{
            if(element.label===val[0]){
              this.provinceNum=element.provinceNum;
              this.provinceIndex=index;
            }
          })
          // this.$emit("area",this.provinceNum)
          this.$emit("input",this.provinceNum)
        }
      }
    }
  };
</script>