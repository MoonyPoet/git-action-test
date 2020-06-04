<template lang='html'>
    <div class='container'>
        <el-tabs type="border-card" class="tab" @tab-click="changeTab">
              <el-tab-pane>
                  <span slot="label">{{$t('costInfo.pay')}}</span>
                  <Pay v-if="index==='0'" class="basic-container"></Pay>
              </el-tab-pane>
              <el-tab-pane>
                  <span slot="label">{{$t('costInfo.renew')}}</span>
                  <Renew v-if="index==='1'" class="basic-container"></Renew>
              </el-tab-pane>
                <el-tab-pane>
                  <span slot="label">{{$t('costInfo.refund')}}</span>
                  <Refund v-if="index==='2'" class="basic-container"></Refund>
              </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
import Pay from "./Pay";
import Refund from "./Refund";
import Renew from "./Renew";
     export default {
        name: 'costInfo',
        components:{
            Pay,
            Refund,
            Renew
        },
        data () {
            return{
                index:'0'
            }
        },
        methods:{
            changeTab(v) {
                this.index = v.index;
            }
        }
    }
</script>
<style scoped>
    
</style>