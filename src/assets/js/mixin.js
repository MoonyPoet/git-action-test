import { type } from "./reused";
//FixedTable搜索方法调用
let filterMenu = {
        data: () => {
            return {
                searchData: {}
            }
        },
        created() {
            this.filterMenu()
        },
        methods: {
            filterMenu() {
                this.$parent.$on('searchData', (v) => {
                    this.offset = 0;
                    if (type(this.$refs.pagination) === "undefined") {
                        console.error("请检查pagination的ref是否存在")
                        return
                    }
                    this.$refs.pagination.reset()
                    this.searchData = {...v }
                    this.getTableData(v)
                });
            }
        }
    }
    //FilterHeader搜索方法触发
let filterSearch = {
    methods: {
        search(v) {
            this.$parent.$emit("searchData", v)
        }
    }
}
// 系统查询封装
let systemSearch= {
    methods: {
        pushCallbackFn(element){
            return {
                    value:element.display ,//显示需要的
                    id: element.value
            }
        },
        searchOptFn(v){
            return {"keyword":v,"category":"institution"}
        }
    }
}
// 城市校区匹配(多选城市，多校区)(卡种,员工)
let campusFind={
    data(){
        return {
            campusData:[]
        }
    },
    methods:{
        areaChange(data){
            // 根据城市id 筛选校区
            this.campusData=[];
            this.formData.campusIds=[];
            this.codeData.campus.map((item)=>{
              if(data.some((id)=>id===Number(item.areaNum))){
                this.campusData.push({
                  campusDisplay:item.display+"     "+this.getAreaName(Number(item.areaNum)),
                  areaNum:item.areaNum,
                  value:item.value
                })
              }
            })
        },
        getAreaName(id){
            let areaName;
            this.codeData.area.map((item)=>{
                if(item.value===id){
                    areaName=item.display
                }
            })
            return areaName;
        }
    }
}
// 城市校区匹配(单选城市,多校区)(优惠)
let campusFind1={
    data(){
        return {
            areaData:[],
            campusData:[],
        }
    },
    methods:{
        /**
         *
         *
         * @param {*} v
         * @param {boolean} ref 如果第二个参数为true,则进行下拉框默认选中第一项处理
         */
        getAreaId(v,ref,campusIds=undefined,callFn=undefined){
            this.campusData=[];
            if(campusIds===undefined&&this.formData){
                this.formData.campusIds=[];
            }else{
                campusIds=[]
            }
            this.codeData.campus.map((item)=>{
                if(Number(item.areaNum)===v){
                    this.campusData.push(item);
                }
            })
            if(ref&&this.$refs[ref]){
                this.$nextTick(()=>{
                    this.$refs[ref].selectDefaultData();
                    if(callFn){
                        callFn()
                    }
                })   
            }
        }
    }
}
// 员工匹配
let memberFind={
    data(){
        return {
            areaData:[],
            campusData:[],
        }
    },
    methods:{
        /**
         *
         *
         * @param {*} v
         * @param {boolean} ref 如果第二个参数为true,则进行下拉框默认选中第一项处理
         */
        getAreaId(v,ref,campusIds=undefined,callFn=undefined){
            this.campusData=[];
            if(campusIds===undefined&&this.formData){
                this.formData.campusIds=[];
            }else{
                campusIds=[]
            }
            this.codeData.campus.map((item)=>{
                if(Number(item.areaNum)===v){
                    this.campusData.push(item);
                }
            })
            if(ref&&this.$refs[ref]){
                this.$nextTick(()=>{
                    this.$refs[ref].selectDefaultData();
                    if(callFn){
                        callFn()
                    }
                })   
            }
        }
    }
}
export {
    filterMenu,
    filterSearch,
    systemSearch,
    campusFind,
    campusFind1,
    memberFind
}