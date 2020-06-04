<template lang='html'>
    <div style="display:inline">
      <el-button class="add" size="small" @click="exportData()" round>{{text}}</el-button>
      <div>
          <table class="exportTable">
              <tbody>
                  <tr v-for="item in tableData">
                      <td v-for="b in item">{{b}}</td>
                  </tr>
              </tbody>
          </table>
      </div>
    </div>
</template>
<script>
    import FileSaver from 'file-saver'
    import XLSX from 'xlsx';
    // let saveAs= require("assets/js/fileSave.js");
    function Workbook() {
        if(!(this instanceof Workbook)) return new Workbook();
        this.SheetNames = [];
        this.Sheets = {};
    }
     export default {
        name: 'ExportData',
        props:{
            text:{
                type:String,
                default:"导出"
            }
        },
        data () {
            return {
                tableData:[]
            }
        },
        created(){
            // this.exportExcel()
        },
        methods:{
            exportData(){
                this.$emit("data",this.exportExcel);
            },
            sheet_from_array_of_arrays(data, opts) {
               var ws = {};
                var range = {s: {c:10000000, r:10000000}, e: {c:0, r:0 }};
                //C为纵轴,R为横轴
                for(var R = 0; R != data.length; ++R) {
                    for(var C = 0; C != data[R].length; ++C) {
                        if(range.s.r > R) range.s.r = R;
                        if(range.s.c > C) range.s.c = C;
                        if(range.e.r < R) range.e.r = R;
                        if(range.e.c < C) range.e.c = C;
                        var cell = {v: data[R][C] };
                        if(cell.v == null) continue;
                        var cell_ref = XLSX.utils.encode_cell({c:C,r:R});
                        
                        if(typeof cell.v === 'number') cell.t = 'n';
                        else if(typeof cell.v === 'boolean') cell.t = 'b';
                        else if(cell.v instanceof Date) {
                            cell.t = 'n'; cell.z = XLSX.SSF._table[14];
                            cell.v = datenum(cell.v);
                        }
                        else cell.t = 's';
                        
                        if(C == 0){
                            cell.s={
                                font:{
                                    bold:true
                                }
                            }
                        }
                        if(R == 0){
                            cell.s={
                                fill:{
                                    fgColor:{ rgb: "FFFFAA00" }
                                }
                            }
                        }
                        
                        ws[cell_ref] = cell;
                    }
                }
                if(range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range);
                return ws;
            },
            exportExcel (data) {
                this.tableData=data;
                /* generate workbook object from table */
                setTimeout(()=>{
                    var wb = XLSX.utils.table_to_book(document.querySelector('.exportTable'))
                    /* get binary string as output */
                    var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' })
                    try {
                        FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'sheetjs.xlsx')
                    } catch (e) { if (typeof console !== 'undefined') console.log(e, wbout) }
                    return wbout;
                })
                // var data1 = [[1,2,3,4],["Sample", "Sample", "Sample", "Sample"],["foo","bar","Hello","0.3"], ["baz", "1221212", "qux"],["baz", "1221212", "qux"]]
                // var ws_name = "SheetJS";
                // console.log(this.sheet_from_array_of_arrays(data1))
                // var wb = new Workbook(), ws = this.sheet_from_array_of_arrays(data1);
                // /* add worksheet to workbook */
                // wb.SheetNames.push(ws_name);
                // wb.Sheets[ws_name] = ws;
                // var wbout = XLSX.write(wb, {bookType:'xlsx', bookSST:true, type: 'binary'});
	            // saveAs(new Blob([this.s2ab(wbout)],{type:"application/octet-stream"}), "sample.xlsx")
            },
            s2ab(s) {
                var buf = new ArrayBuffer(s.length);
                var view = new Uint8Array(buf);
                for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
                return buf;
            }
        }
    }
</script>
<style scoped>
    .exportTable{
        display: none;
    }
</style>