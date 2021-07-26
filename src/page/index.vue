<template>
    <div class="content-common-style">
		<el-tabs :value="currentTab" type="card" >
			<el-tab-pane label="广域网机器设置" name="netMachineSetting">
			  <netMachineSetting></netMachineSetting>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script type="text/javascript">
import netMachineSetting from '@/page/netMachineSetting/netMachineSetting.vue'//广域网机器设置

export default {
	name:'pages',
	components:{
	   netMachineSetting,
	},
	data(){
 		return {
		  currentTab:"netMachineSetting",
		}
 	},
 	created(){
		
 	},
 	methods:{
		 
	},
}
</script>
<style>
.content-common-style{
	max-height:100vh;
	height: 100%;
}
</style>

 
