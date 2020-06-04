<template lang='html'>
    <div class='container'>
        <div class="memu">
            <template v-for="element in menuData">
                <template v-if="element.type==='select'">
                    <div style="position: relative;display:inline-block;">
                        <div class="title">
                            <span>{{element.title}}</span>
                            <span class="up"></span>
                        </div>
                        <div style="display:inline-block;">
                            <SelectBar v-model="element.value" :width="100"  ref="selectBar" @change="change" :bindOptions="{
                                data:element.options||[],
                                key:'id',
                                val:'display',
                                placeholder:element.title
                            }"></SelectBar>
                        </div>
                    </div>
                </template>
                 <template v-if="element.type==='selectMultiple'">
                    <div style="position: relative;display:inline-block;">
                        <div class="title">
                            <span>{{element.title}}</span>
                            <span class="up"></span>
                        </div>
                        <div style="display:inline-block;">
                             <el-select
                                :style="{width:100+'px'}"
                                v-model="element.value"
                                multiple
                                collapse-tags
                                @change="changeMultiple"
                                style="margin-left: 20px;"
                                placeholder="请选择">
                                <el-option
                                v-for="item in element.options"
                                :key="item.id"
                                :label="item.display"
                                :value="item.id">
                                </el-option>
                            </el-select>
                        </div>
                    </div>
                </template>
            </template>
        </div>
        <div class="menu_bar">
            <div v-for="element in menuOptionData" class="menu_element">
                <div class="menu_select">
                    {{element.name}}:
                </div>
                <div class="menu_item">
                    <el-tag size="mini" v-for="item in element.options" :key="item.id" closable>{{item.display}}</el-tag>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import SelectBar from "common/SelectBar";
     export default {
        name: 'SearchMenu',
        components:{
            SelectBar
        },
        data () {
            return{
                menuData:[],
                menuOptionData:[],
                formData:{

                }
            }
        },
        async created(){
            this.menuData=await this.getSearchMenuData();
            this.setMenu(this.menuData);
        },
        methods:{
            getSearchMenuData(){
                return new Promise((resolve,reject)=>{
                    this.$axios.post({
                        url:"http://192.168.0.108:8090/mode2/DataOne",
                        data:{},
                        success:(res)=>{
                            resolve(res.data)
                        }
                    })
                })
            },
            setMenu(menuData){
                menuData.map((element,index)=>{
                    if(element.type==="select"){
                        let options=[];
                        element.options.map((item)=>{
                            if(item.id===element.value){
                                options.push(item);
                            }
                        })
                         this.menuOptionData.splice(index,1,{
                            name:element.title,
                            options:options
                        })
                    }else if(element.type==="selectMultiple"){
                        let options=[];
                        element.options.map((item)=>{
                            if(element.value.some((option)=>item.id===option)){
                                options.push(item);
                            }
                        })
                         this.menuOptionData.splice(index,1,{
                            name:element.title,
                            options:options
                        })
                    }
                })
            },
            change(){
                this.setMenu(this.menuData);
            },
            changeMultiple(){
                this.setMenu(this.menuData);
            }
        }
    }
</script>
<style lang="scss" scoped>
/deep/.el-select .el-input{
    background: #fff;
}
/deep/.el-select .el-input input{
    border: none;
    color: #fff;
}
.title{
    display: inline-block;
    position: absolute;
    z-index: 1;
    top: 0;
    left: 0;
    /* right: 0; */
    left: 0%;
    padding: 0 0px 0 10px;
    top: 50%;
    width: 100%;
    pointer-events: none;
    transform: translate(0,-50%);
    span:nth-of-type(1){
         background-color: #fff;
        display: inline-block;
        width:calc(100% - 35px);
    }
    .up{
        display: inline-block;
        width: 25px;
        padding-right: 10px;
    }
}
.menu_bar{
    background: #fff;
    padding: 10px;
    .menu_select{
        display:inline-block;
        padding-right: 10px;
    }
    .menu_item{
        display: inline-block;
    }
    .menu_element{
        display: inline-block;
        margin-right: 10px;
    }
}
/deep/.el-select .el-tag{
    display: none;
}
.el-tag{
    margin-right: 10px;
}
</style>