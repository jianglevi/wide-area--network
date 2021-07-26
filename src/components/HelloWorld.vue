<template>
    <div class="content-common-style">
		<el-tabs value="machineSetting">

			<el-tab-pane label="广域网机器设置" name="netMachineSetting">
				<netMachineSetting

				></netMachineSetting>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script type="text/javascript">
import netMachineSetting from './netMachineSetting.vue'//广域网机器设置

export default {
	components:{
		netMachineSetting,
	},
	data(){
 		return {
			
		}
 	},
 	created(){
		
 	},
 	methods:{
		 
 	}
}
</script>



