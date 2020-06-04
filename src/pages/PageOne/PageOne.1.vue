<template lang='html'>
    <div>
        <!-- <img src="/asstes/img/1.png" alt=""> -->
        <!-- <SearchMenu></SearchMenu> -->
        <!-- <SearchMultiple v-model="searchValue" 
            :bindOptions="{
            data:goodsCategoryData,
            key:'id',
            val:'display',
            placeholder:'选择一级分类'
        }">
        </SearchMultiple> -->
            <!-- 表格 -->
        <!-- <TableBar :data="tableData"
            :col-configs="colConfigs">
            <el-table-column slot="opt">
            <el-button size="mini" slot-scope="{ row }">查看</el-button>
            </el-table-column>
        </TableBar> -->
        <TableSearch ref="table" :colConfigs="colConfigs" @sortChange="sortChange">
            <el-table-column
            label="操作"
            width="400"
            slot="opt"
            >
            <template slot-scope="{row}">
                <el-button size="mini">查看12</el-button>
                <el-button size="mini" slot-scope="{ row }">查看11</el-button>
                <el-button size="mini" slot-scope="{ row }">查看11</el-button>
                <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
                <el-button type="text" size="small">编辑</el-button>
            </template>
            </el-table-column>
        </TableSearch>
    </div>
</template>
<script>
    import SearchMenu from "common/SearchMenu";
    import SearchMultiple from "common/SearchMultiple";
    import TableSearch from "common/TableSearch";
     export default {
        name: 'PageOne',
        components:{
            SearchMenu,
            SearchMultiple,
            TableSearch
        },
        // render: function (createElement) {
        //     return createElement('div',
        //         Array.apply(null, { length: 20 }).map(function () {
        //         return createElement('p', 'hi')
        //         })
        //     )
        // },
        data () {
            return{
                searchValue:[],
                goodsCategoryData:[],
                colConfigs:[
                    { prop: 'campusName', label: '校区' ,sortable:"custom",},
                    { prop: 'studentName', label: '姓名' },
                    { prop: 'saleMemberName', label: '销售' },
                    // 模版中的元素需要对应的有 slot="opt" 属性
                    { slot: 'opt' }
                ],
            }
        },
        created(){
            setTimeout(()=>{
                this.goodsCategoryData=[{
                    "id": 1,
                    "display": "yo"
                },
                {
                    "id": 2,
                    "display": "1111"
                },
                {
                    "id": 3,
                    "display": "2222"
                },
                {
                    "id": 4,
                    "display": "333"
                }]
            })
        },
        methods:{
            getListApi(){
                return new Promise((resolve, reject) => {
                    let obj = Object.assign(v == undefined ? {} : v, {
                    limit: this.limit,
                    offset: this.offset,
                    status: 1,
                    studentStatus: 1,
                    ...this.searchData
                    });
                    this.$axios.post({
                    url: baseURL + "student/findlistpaging",
                    data: obj,
                    success: res => {
                        this.tableData = [...res.data.rows];
                        this.totalAll = parseInt(res.data.count);
                        resolve();
                    }
                    });
                });
            },
             getTableData(v) {
                //table 数据
                return new Promise((resolve, reject) => {
                    let obj = Object.assign(v == undefined ? {} : v, {
                    limit:this.$refs.table.getLimit(),
                    offset:this.$refs.table.getOffset(),
                    status: 1,
                    studentStatus: 1,
                    ...this.searchData
                    });
                    this.$axios.post({
                    url: baseURL + "student/findlistpaging",
                    data: obj,
                    success: res => {
                        this.$refs.table.setTableData(res.data.rows);
                        this.$refs.table.setTotalAll(res.data.count);
                        resolve();
                    }
                    });
                });
            },
            sortChange(obj){
                if(obj.order==="descending"){
                    // this.getTableData({
                    //     sort:
                    // })
                }else{
                    //  this.getTableData({
                    //     sort:sort
                    // })
                }
                console.log(v)
            }
        }
    }
</script>
<style scoped>
    
</style>