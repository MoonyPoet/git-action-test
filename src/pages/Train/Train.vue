<template>
	<div class="train">
		<ul>
			<li v-for="item in trainData" :key="item.id" @click="handleClick(item,0)">
				<img :src="item.logImg">
				{{ item.trainName }}
			</li>
		</ul>
	</div>
</template>
<script>
import {baseFn} from "assets/js/reused";
export default {
	name: 'train',
	data() {
		return {
			trainData: []
		};
	},
	created() {
		this.init();
	},
	methods:{
		init(){
			this.find()
		},
		handleClick(row,status){
			let obj={
				0:()=>{
					this.findDetail(row)
				},
				1:()=>{
					this.edit(row)
				}
			}
			obj[status]();
		},
		find(){
			this.$axios.post({
				url: baseURL + "train_rel/find",
				success: res => {
					if(res.status==1){
						this.trainData = res.data.rows;
					}
				}
			});
		},
		findDetail(row){
			if(this.getFourRoleArr('train/detailTrain')){
				this.$store.commit("addTabAndActive", {
					url: "/train/detailTrain",
					data:{
						trainRelId:row.trainRelId,
						trainId:row.trainId
					}
				});
			}
		},
		edit(row){
			this.$store.commit("addTabAndActive", {
				url: "/campus/editCampus",
				data:{
					campusId:row.campusId
				}
			});
		}
	}
};
</script>
<style lang="scss" scoped>
.train {
}
.train ul{
	line-style:none;
}
.train ul li{
	width: 200px;
	height: 100px;
	display: inline-block;
	border-radius: 10px;
	border: 1px solid #c2c2c2;
	padding: 5px;
	margin-right: 20px;
	font-size: 20px;
}
.train ul li img{
	width: 100px;
	height: 100px;
}
</style>