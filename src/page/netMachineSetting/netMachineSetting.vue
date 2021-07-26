<template> 
<div
	id="netMachineSetting"
	element-loading-text="指令下发中"
	element-loading-spinner="el-icon-loading"
	element-loading-background="rgba(0, 0, 0, 0.3)">
	<div id="left"> 
		  <ul class="ul">
			<li>
		  		<el-button type="primary" size="mini" 
				  @click="machineDeal('RESET_FK','测试重启')" 
				  >重启</el-button>
			</li>			
			<li>  
  				<el-button type="primary" size="mini" 
				  @click="machineDeal('SET_TIME','校时')" 
				  >校时</el-button>
			</li>
			<li>  
  				<el-button type="primary" size="mini" 
				  @click="openLogTime()"
				  >更新打卡</el-button>
			</li>
			<li>  
  				<el-button type="primary" size="mini" 
				  @click="openInputUserName()"
				  >下发人员模板</el-button>
			</li>
			<li>  
  				<el-button type="primary" size="mini" 
				  @click="machineDeal('SET_USERNAME_ALL','下发全部姓名')"
				  >下发全部模板</el-button>
			</li>
			<li>  
  				<el-button type="primary" size="mini" 
				  @click="openGetUserInfo()"
				  >获取用户</el-button>
			</li>
			<li>  
  				<el-button type="primary" size="mini" 
				  @click="machineDeal('GET_USER_ID_LIST','获取全部用户')"
				  >获取全部用户</el-button>
			</li>

			<li>
				<el-button type="danger" size="mini" 
				@click="openUserDelete()"
				>删除用户</el-button>
			</li>
			<li>
				<el-button type="danger" size="mini" 
				@click="machineDeal('CLEAR_LOG_DATA','清空打卡')"
				>清空打卡</el-button>
			</li>
			<li>
				<el-button type="danger" size="mini" 
				@click="machineDeal('CLEAR_ENROLL_DATA','清空用户')"
				>清空用户</el-button>
			</li>


			
			<!-- <li>
				<el-button type="primary" size="mini" @click="machineDeal('close','关闭端口')">关闭端口</el-button>
				</li> -->
		  </ul> 
	 </div>
	<div id="middle" >
		<div class="tableBtn">
		 <el-button
       		v-for="item in tableBtn"
       		:key="item.title"
       		@click="buttonClick(item.event)"
       		size="mini"
       		:type="item.type"
       		:icon="'el-icon-' + item.icon"
       		class="btn"
       		>{{ item.title }}</el-button
     	 	>
		</div>
		<common-table
        :tableConfig ="machineConfig"
        @updateDate="setSearchMachine"
        :tableColumn="machineColumn"
        @selectTable="selectTableList"
		 :tableData.sync="machineTableData"  
      	/>
	</div>
	<div id="right">
		<div class="f-ac-be tableBtn">
			<div>待执行指令</div><el-button type="primary" size="mini" @click="setSearchDirect" icon='el-icon-refresh-right'>刷新</el-button>
		</div>
		<common-table
		  :tableConfig="directConfig"
     	  :tableData="directTableData"                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              
     	  :pageSize.sync="directPage.pageSize"
     	  :currentPage.sync="directPage.currentPage"
     	  :total="directPage.pageTotal"
     	  @updateDate="setSearchDirect"
     	  :tableColumn="directColumn"
      	/> 	
	</div>
	<div class="dialog">
      <add-dialog
        :visible.sync="dialog.visible"
        :title.sync="dialog.title"
        :typeConfig="typeConfig"
		@updateTable="setSearchMachine"
      />
    </div>
	<div class="operation-dialog">
	    <el-dialog
    	:title="operation.title"
    	:visible.sync="operation.visible"
    	width="600px"
    	style="text-alin:left"
    	@closed="closeDialog"
    	:close-on-click-modal="false"
 	    >
		 <el-date-picker
		 	v-if="operation.type == 'datepicker'"
      		v-model="operation.value"
      		type="daterange"
      		range-separator="至"
      		start-placeholder="开始日期"
      		end-placeholder="结束日期">
   		 </el-date-picker>
		 <el-input v-model="operation.value" placeholder="请输入逻辑卡号" v-else-if="operation.type == 'input'"></el-input>
	     <span slot="footer" class="dialog-footer">
     	  <el-button type="primary" @click="submitDialog" size="mini">确 定</el-button>
     	  <el-button @click="closeDialog" size="mini">取 消</el-button>
         </span>
  		</el-dialog>
	</div>
</div>
</template>
<script type="text/javascript">
import { dateToYYMMDD } from "@/utils/time.js"
import { mapState } from 'vuex'
import Bus from '@/common/eventBus'
// import NetMachineUser from './children/netMachineUser.vue'//删除人员
import MainTable from "@/components/children/queryFieldTables.vue";
import CommonTable from "@/components/children/CommonTable.vue";
import AddDialog from "@/page/netMachineSetting/dialog.vue";
export default {
  	name:'netMachine',
	components:{
		// NetMachineUser
		MainTable,
		CommonTable,
		AddDialog,
	},
	data(){
 		return {
			operation:{
				title:'',
				visible:false,
				value:'',
				type:'input',
				code:'',
			},
			tableBtn: [
     		  { icon: "plus", event: "addItem", title: "新增", type: "primary" },
     		  { icon: "edit", event: "editItem", title: "编辑", type: "warning" },
     		  { icon: "document-delete", event: "deteleItem", title: "删除", type: "danger" }
		    ],
			tableData: [],
			machineConfig:{
				pagination:false,
				checkbox:true,
				button:false,
			},
			directConfig:{
				pagination:true,
				checkbox:false,
				button:false,
			},
			machineColumn: [
			 { width:"180px",label: "机器编号", prop: "MNum" },
			 { width:"180px",label: "机器识别号", prop: "deviceId"},
      		 { width:"180px",label: "机器地址", prop: "MAddr"},
      		 { width:"180px",label: "机器类型", prop: "MType" },
      		 { width:"180px",label: "版本型号", prop: "Version" },
      		 { width:"180px",label: "通讯端口", prop: "Comm"},
      		 { width:"180px",label: "自动清除", prop: "IsAClear",type:"switch" },
      		 { width:"180px",label: "有效机器", prop: "IsUsed",type:"switch" },
      		 { width:"180px",label: "发卡机", prop: "IsRMachi",type:"switch" },
      		 { width:"180px",label: "收数时校时", prop: "IsSTime",type:"switch" },
      		 { width:"180px",label: "刷卡延时", prop: "CLapse" },
      		 { width:"180px",label: "下发时间", prop: "SDate", },
      		 { width:"180px",label: "标识类型", prop: "CType"},
      		 { width:"180px",label: "IP地址", prop: "IPAddr" },
      		 { width:"180px",label: "备注", prop: "Remark", },
    		],
			directColumn: [
      		 { width:"180px",label: "机器识别号", prop: "device_id" },
      		 { width:"180px",label: "指令名称", prop: "cmd_code"},
      		 { width:"180px",label: "指令参数", prop: "cmd_param" },
      		 { width:"180px",label: "状态", prop: "status" },
      		 { width:"180px",label: "创建日期", prop: "update_time"},
    		],
    		machineTableData: [],
    		directTableData: [],
    		tableList: [],
    		search: {},
    		directPage: {
    		  pageSize: 20,
    		  pageTotal: 0,
    		  currentPage: 1
			},
			dialog: {
      		  title: "新增",
      		  visible: false
			},
			typeConfig:{},
 		 }
	 },
	computed: {

  	},
 	methods:{
		submitDialog(){
		   let param = {}
		   let infos = {
			code: this.operation.code,
		   	infos:this.tableList
		   }
		   if(this.operation.type == 'datepicker'){
			   param.begin_time = dateToYYMMDD(new Date(this.operation.value[0]))
			   param.end_time = dateToYYMMDD(new Date(this.operation.value[0]))
		   }else if(this.operation.type == 'input'){
			   param.user_name = ""
			   param.user_id = this.operation.value
		   }
		    infos.param = JSON.stringify(param)
		   this.api.post('netmachine/saveCmdCode',{infos:JSON.stringify(infos)},val=>{
			 if(val.result){
		 	    this.$message({type:'success',message:val.data})
		 		this.setSearchDirect()
			 }
		   })
		},
	    machineDeal(type){
			if(this.tableList.length == 0){
				this.$message({type:'warning',message:'请先选择要操作的机器！'})
			}else{
			   let infos = {
			   	code: type,
			   	param:"",
			   	infos:this.tableList
			   }
			   this.api.post('netmachine/saveCmdCode',{infos:JSON.stringify(infos)},val=>{
				 if(val.result){
					this.$message({type:'success',message:val.data})
					this.setSearchDirect()
				 }
			   })
			}
		},
		openLogTime(){
		  if(this.tableList.length == 0){
			this.$message({type:'warning',message:'请先选择要操作的机器！'});return
		  }
		  this.operation.visible = true
		  this.operation.title = '获取打卡数据'
		  this.operation.type = 'datepicker'
		  this.operation.code = 'GET_LOG_DATA'
		},
		openInputUserName(){
		  if(this.tableList.length == 0){
			this.$message({type:'warning',message:'请先选择要操作的机器！'});return
		  }
	      this.operation.visible = true
		  this.operation.title = '下发人员模板'
		  this.operation.type = 'input'
		  this.operation.code = 'SET_USER_INFO_NAME'
		},
		openGetUserInfo(){
		  if(this.tableList.length == 0){
			this.$message({type:'warning',message:'请先选择要操作的机器！'});return
		  }
 		  this.operation.visible = true
		  this.operation.title = '获取用户'
		  this.operation.type = 'input'
		  this.operation.code = 'GET_USER_INFO'
		},
		openUserDelete(){
		  if(this.tableList.length == 0){
			this.$message({type:'warning',message:'请先选择要操作的机器！'});return
		  }
 		  this.operation.visible = true
		  this.operation.title = '用户删除'
		  this.operation.type = 'input'
		  this.operation.code = 'DELETE_USER'
		},
		closeDialog(){
		  this.operation.visible = false
		  this.operation.value = ''
		  this.operation.code = ''
		},
		addItem() {
   		  this.typeConfig = {};
   		  this.dialog.title = "新增";
   		  this.dialog.visible = true;
		},
		editItem(){
			if(this.tableList.length == 0){
				this.$message({type:'warning',message:'请选择要修改的记录'})
			}else if(this.tableList.length>1){
				this.$message({type:'warning',message:'每次只能修改一条记录!'})
			}else{
				this.typeConfig = {
					...this.tableList[0]
			    };
   				this.dialog.title = "编辑";
   				this.dialog.visible = true;
			}
		 
		},
		deteleItem(){
			if(this.tableList.length == 0){
				this.$message({type:'warning',message:'请选择要删除的记录！'})
			}else{
			    this.api.post('hrtWMachine/delete', {ids:this.tableList.map(item=>item.id).join(','),type:'netMachine',key:'id'},(res => {
    			   if(res.result) {
					 this.setSearchMachine()
					 this.$message("操作成功")
    			   }else {
    			     // 报错提示 res.msg
    			   }
     			}))
			}
		},
		selectTableList(list) {
      	   this.tableList = list;
    	},
	    buttonClick(name) {
           this[name]();
        },
     	setSearchMachine(search) {
			this.api.get('hrtWMachine/query',{},(val=>{
				if(val.result){
					this.machineTableData = val.data
				}
			}))
	 	},
     	setSearchDirect(search) {
			this.api.get('hrtWMachine/queryCmd',{curPage:this.directPage.currentPage,pageSize:this.directPage.pageSize},(val=>{
				if(val.result){
				   this.directTableData = val.map.rows
				   this.directPage.pageTotal = val.map.total
			 	}
			  })
		   )
		 },
	 },
	 created(){
		 this.setSearchMachine()
		 this.setSearchDirect()
	 }
}
</script>

<style type="text/css">
.operation-dialog .el-date-editor.el-input,.operation-dialog .el-date-editor.el-input__inner {
    width: 510px;
}
.operation-dialog .el-dialog__body{
    padding: 0px 0px 10px 0;
}
.operation-dialog .el-input {
    width: 92%;
}
.operation-dialog .el-dialog__header {
    padding: 20px 20px 20px;
}
#netMachineSetting{
	display:flex;
}
#netMachineSetting #left .ul{
	width:auto;
	list-style:none;
	text-align: left;
	padding: 15px 25px 0px 25px;
	margin:0;
	display:flex;
    flex-direction: column;
	width:104px;
	background:#F0F2F5;
	border: 1px solid #F0F2F5;
}
#netMachineSetting #left .ul li{
	width:100%;
	display:flex;
	margin-bottom: 15px;
}
#netMachineSetting #middle{
	padding: 0 20px;
	width:55%
}
#netMachineSetting #left .el-button--mini, .el-button--mini.is-round {
    padding: 7px 15px;
    width: 100%;
}
#netMachineSetting #middle .tableBtn{
	display:flex;
	padding-bottom:10px
}
#netMachineSetting #right .tableBtn{
	height: 38px;
	color: #409EFF;
}
#netMachineSetting #right{
	padding: 0 20px;
	width:30%
}
.table {
  display: flex;
  flex-direction: column;
  max-height: 80vh;
  height: 100%;
}
.common-table{
	width:100%
}
</style>


