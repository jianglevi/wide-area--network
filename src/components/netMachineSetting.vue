<template> 
<div
	v-loading="fullscreenLoading"
	element-loading-text="指令下发中"
	element-loading-spinner="el-icon-loading"
	element-loading-background="rgba(0, 0, 0, 0.3)">
	<div id="container" :style="{height:clientHeight+'px'}">
			<div id="left" style="background:#F0F2F5;border: 1px solid #F0F2F5;width:132px"> 
		  <ol class="ol">
			<li>
		  		<el-button type="primary" size="mini" 
				  @click="machineDeal('RESET_FK','测试重启')" style="padding:7px 39px" 
				  >重启</el-button>
			</li>			
			<li>  
  				<el-button type="primary" size="mini" 
				  @click="machineDeal('SET_TIME','校时')" style="padding:7px 39px" 
				  >校时</el-button>
			</li>
			<li>  
  				<el-button type="primary" size="mini" style="padding:7px 27px" 
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
  				<el-button type="primary" size="mini" style="padding:7px 27px" 
				  @click="openGetUserInfo()"
				  >获取用户</el-button>
			</li>
			<li>  
  				<el-button type="primary" size="mini" 
				  @click="machineDeal('GET_USER_ID_LIST','获取全部用户')"
				  >获取全部用户</el-button>
			</li>
			<!-- <li> 
				<el-button type="primary" size="mini" @click="machineDeal('timeInterval','刷卡间隔')">刷卡间隔</el-button>
			</li> -->
			<!-- <li> 
				<el-button type="primary" size="mini" @click="openDeletePage()">人员管理</el-button>
			</li> -->
			<!-- <li>  
  				<el-button type="primary" size="mini" @click="machineDeal('editNum','更改编号')">更改编号</el-button>
				  </li> -->
			<!-- <li>
				<el-button type="danger" size="mini" @click="machineDeal('clearPicture','清空拍照')">清空拍照</el-button>
				</li> -->
			<!-- <li>
				<el-button type="danger" size="mini" @click="machineDeal('clearAdmin','清空管理')">清空管理</el-button>
			</li> -->
			<li>
				<el-button type="danger" size="mini" style="padding:7px 27px" 
				@click="openUserDelete()"
				>删除用户</el-button>
			</li>
			<li>
				<el-button type="danger" size="mini" style="padding:7px 27px" 
				@click="machineDeal('CLEAR_LOG_DATA','清空打卡')"
				>清空打卡</el-button>
			</li>
			<li>
				<el-button type="danger" size="mini" style="padding:7px 27px" 
				@click="machineDeal('CLEAR_ENROLL_DATA','清空用户')"
				>清空用户</el-button>
			</li>


			
			<!-- <li>
				<el-button type="primary" size="mini" @click="machineDeal('close','关闭端口')">关闭端口</el-button>
				</li> -->
		  </ol> 
	 </div>
			<div id="right" style="left:132px">
			<common-options :type="type" ref="commonOptions" >
				<template slot-scope="{ opts }">

					<convenient-conditions
					:type="type"
					:optionMetaInfo="opts" 
					:optionSet="optionSet"
					></convenient-conditions>
					
					<common-update ref="updateDialog" 
					:type="type" 
					:optionMetaInfo="opts"
					:primaryKey="primaryKey"
					:optionSet="optionSet"
					:metaInfo="metaInfo"
					:extraValid="addExtraRules" 					
					:whenOpenAddDialog="whenOpenAddDialog"
					:whenOpenUpdateDialog="whenOpenUpdateDialog"
					:beforeSubmit="beforeSubmit"
					:currentSelected="currentSelected" 
					:allSelected="allSelected"
					@afterSubmit="afterUpdateSubmit"
					@whenEditDialogClose="whenEditDialogClose">
					</common-update>
					<el-dropdown class="dropdownMLetft">
						<el-button type="primary" size="mini">
						更多菜单<i class="el-icon-arrow-down el-icon--right"></i>
						</el-button>
						<el-dropdown-menu slot="dropdown">
							<el-dropdown-item>
								<common-conditions ref="queryDialog" 
								:type="type" 
								:optionMetaInfo="opts" 
								:optionSet="optionSet" 
								:allConditions="metaInfo.conditions" 
								></common-conditions> 
							</el-dropdown-item>
							<el-dropdown-item >
								<FieldSetting
								:type="type"
								:optionMetaInfo="opts" 
								></FieldSetting>	
							</el-dropdown-item>
							<el-dropdown-item >
								<report :optionMetaInfo="opts" :type="type"></report>
							</el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>

				</template>
			</common-options>
			<MainTable ref="mainTable"  
				:type="type" 
				:primaryKey="primaryKey"
				:metaInfo.sync="metaInfo"
				:optionSet.sync="optionSet"
				:allSelected.sync="allSelected"
				:currentSelected.sync="currentSelected"
				:currentId.sync="currentId"
				:initHideConditions="initHideConditions"
				:clientHeight.sync="clientHeight"
			></MainTable>			
	  	</div>
		</div>
		<el-dialog
			v-dialogDrag
			title="获取打卡数据"
			:visible.sync="logTime"
			width="500px"
			v-loading="loading">
				<el-form label-width="80px">
					<el-form-item label="日期">
						<el-date-picker
						size="mini"
						v-model="statisticsByTimeForm.date"
						type="daterange"
						start-placeholder="开始日期"
						end-placeholder="结束日期">
						</el-date-picker>
						</el-form-item>
				</el-form>

			<span slot="footer" class="dialog-footer">
				<el-button @click="logTime = false" type="primary" size="small">取 消</el-button>
				<el-button type="primary" @click="machineDeal('GET_LOG_DATA','获取指定时段的打卡记录')" size="small">确 定</el-button>
			</span>
		</el-dialog>
		<el-dialog
			v-dialogDrag
			title="下发人员模板"
			:visible.sync="inputUserName"
			width="500px"
			v-loading="loading">
			<el-input v-model="uNum" placeholder="请输入逻辑卡号"></el-input>
			<!-- <el-input v-model="userName" placeholder="请输入姓名"></el-input> -->
			<span slot="footer" class="dialog-footer">
				<el-button @click="inputUserName = false" type="primary" size="small">取 消</el-button>
				<el-button type="primary" @click="machineDeal('SET_USER_INFO_NAME','下发人员模板')" size="small">确 定</el-button>
			</span>
		</el-dialog>
		<el-dialog
			v-dialogDrag
			title="获取用户"
			:visible.sync="getUserInfo"
			width="500px"
			v-loading="loading">
			<el-input v-model="uNum" placeholder="请输入逻辑卡号"></el-input>
			<span slot="footer" class="dialog-footer">
				<el-button @click="getUserInfo = false" type="primary" size="small">取 消</el-button>
				<el-button type="primary" @click="machineDeal('GET_USER_INFO','获取用户')" size="small">确 定</el-button>
			</span>
		</el-dialog>
			<el-dialog
			v-dialogDrag
			title="用户删除"
			:visible.sync="userDelete"
			width="500px"
			v-loading="loading">
			<el-input v-model="uNum" placeholder="请输入逻辑卡号"></el-input>
			<span slot="footer" class="dialog-footer">
				<el-button @click="userDelete = false" type="primary" size="small">取 消</el-button>
				<el-button type="primary" @click="machineDeal('DELETE_USER','获取用户')" size="small">确 定</el-button>
			</span>
		</el-dialog>
		<!-- <el-dialog
		title="请输入新的机器编号"
		:visible.sync="modifyMnumdialog"
		width="30%">
			<el-input v-model="newMnum" placeholder="请输入内容" size="mini"></el-input>
		<span slot="footer" class="dialog-footer">
			<el-button @click="modifyMnumdialog = false" type="primary">取 消</el-button>
			<el-button type="primary" @click="modifyMnumd">确 定</el-button>
		</span>
	</el-dialog> -->
	<!-- <el-dialog
		title="人员管理"
		:visible.sync="netMachineUserVisible"
		width="80%">
			<net-machine-user></net-machine-user>
	</el-dialog>	 -->
		
	</div>
</template>
<script type="text/javascript">
import { mapState } from 'vuex'
import Bus from '../common/eventBus'
// import NetMachineUser from './children/netMachineUser.vue'//删除人员
import MainTable from "./children/queryFieldTables.vue";
export default {
  name:'netMachine',
	components:{
		// NetMachineUser
		MainTable
	},
	data(){
 		return {
			statisticsByTimeForm:{
				date:''
			},
			loading:false,
			inputUserName:false,
			uNum:'',
			userName:'',
			logTime:false,
			getUserInfo:false,
			userDelete:false,
			fullscreenLoading:false,
 			grade:1,
 			currentNodeId:0,
 			//以下为公共变量。
 			type:'netMachine', //关联 着相应表与视图的key
 			primaryKey:'id', // 要修改的表的主键名
 			allSelected:[],
 			metaInfo:{},
 			optionSet:{},
 			currentSelected:{},
			currentId:-1,//当前已选中的记录的主键值
			modifyMnumdialog:false,  //修改机器编号弹框
			newMnum:'', //新的机器编号
			netMachineUserVisible:false,//删除人员页面显示
			clientHeight:0
 		}
	 },
	 	computed: {
      ...mapState([
          'userInfo'
        ]),
  	},
 	created(){
	 },
	  watch:{
       allSelected: function (val){   
	}
	 },
 	methods:{
 		nodeChange(msg){
 			this.grade = msg.grade
			this.currentNodeId = msg.currentNodeId
			this.pushHideCondition('parentId', msg.currentNodeId)			
			this.refreshTable()
 		},
		/*** 以下为通用公共的方法 */
 		clearTableSelected(){//取消表格已选项
 			this.$refs['mainTable'].clearSelected()
 		},
 		refreshTable(){//用于刷新表格数据
 			this.$refs['mainTable'].fetchTableData()
 		},
		pushHideCondition(fieldName, value, link, editor){
			//添加/修改隐藏条件
			this.$refs['mainTable'].pushHideCondition(fieldName, value, link, editor)
		},
		initHideConditions(conditions){// 用于 初始化  隐藏的查询条件
			//conditions.push({field:'parentId', value:'0'})			
		},
 		addExtraRules(formRules, formObj){//用于新增额外表单验证
 		},
 		whenEditDialogClose(){//当编辑表单的弹框 消失时, 触发
		 },
		whenOpenAddDialog(formObj){ //新增时，对表单的操作
		  //创建人和创建日期
		  formObj.CreateD = new Date();
		  formObj.CreateM = this.userInfo.nickname;
		  //var mnum =  this.createMNum(formObj);
		  console.log("form:"+JSON.stringify(formObj));
		 },
		whenOpenUpdateDialog(formObj){//更新时，对表单对象，做额外的操作 
		//修改日期和修改人员
		formObj.ModifyD = new Date();
		formObj.ModifyM = this.userInfo.nickname;
		var uid = formObj.UserList //获取用户列表
          this.$api.post('systemController/getSystemUser',{uids:uid},r=>{  //回显用户列表
 				if(r.result){	 
		 	     this.$set(formObj, 'UserList', r.data)           
 				}
			})
 		},
		beforeSubmit(formObj){//提交表单前，对表单对象，做额外的操作
		  formObj.state = 2 		
 		},
		afterUpdateSubmit(){//新增/修改/删除提交后，触发的事件			
		},
		createMNum(formObj){  //创建机器编号
		    var url = 'machine/createMNum';  
            this.$api.post(url,'',r=>{
				if(r.result){
					var data = r.data
					formObj.MNum = r.data
				 }
			   })
		},
		openDeletePage(){
			this.netMachineUserVisible=true;

		},

		openLogTime(){
			this.logTime=true
		},
		openInputUserName(){
			this.inputUserName=true
		},
		openGetUserInfo(){
			this.getUserInfo=true;
		},
		openUserDelete(){
			this.userDelete=true;
		},
		//操作机器的公共方法
		machineDeal(type,text){

          const len = this.allSelected.length
			if(len<1) {  //判断是否选中记录
				this.$message.warning('请先选择要操作的机器!')
				return
			// }else if(len>1){
            //     this.$message.warning('一次只能操作一台机器!')
			// 	return
			}else{
				var paramJson="";
				if(type=="GET_LOG_DATA"){
					if(this.statisticsByTimeForm.date.length!=2){
		  				this.$message.warning('还没有选择日期');
		  				return
					}
					var beginTime=this.statisticsByTimeForm.date[0].Format('yyyyMMdd');
					var endTime=this.statisticsByTimeForm.date[1].Format('yyyyMMdd');
					var infoss = new Object;
					infoss.begin_time=beginTime;
					infoss.end_time=endTime;
					paramJson=JSON.stringify(infoss);
					this.statisticsByTimeVisible = false;
				}
				if(type=="SET_USER_INFO_NAME"){
					if(this.uNum==''){
						this.$message.warning('逻辑卡号不能为空');
		  				return
					}
					var infoss = new Object;
					infoss.user_name=this.userName;
					infoss.user_id=this.uNum;
					paramJson=JSON.stringify(infoss);
					this.inputUserName = false;
				}
				if(type=="GET_USER_INFO"){
					if(this.uNum==''){
						this.$message.warning('逻辑卡号不能为空');
		  				return
					}
					var infoss = new Object;
					infoss.user_id=this.uNum;
					paramJson=JSON.stringify(infoss);
					this.getUserInfo = false;
				}
				if(type=="DELETE_USER"){
					if(this.uNum==''){
						this.$message.warning('逻辑卡号不能为空');
		  				return
					}
					var infoss = new Object;
					infoss.user_id=this.uNum;
					paramJson=JSON.stringify(infoss);
					this.getUserInfo = false;
				}
				var select =  []
				for (let i = 0, len = this.allSelected.length; i < len; i++) {
					select.push(this.allSelected[i])
				}
				var infos = new Object;
				infos.code = type; //指令名称
				infos.param = paramJson;  //执行参数数据
				infos.infos = select		
				var json = JSON.stringify(infos)
			 	var url = 'netmachine/saveCmdCode';   
				 this.fullscreenLoading = true;
				 this.$api.post(url,{'infos':json},r=>{
					if(r.result){
						this.fullscreenLoading = false;
						this.$message.success('操作成功,详情请见右下角！');
						this.$notify({
							title: '操作详情',
							message: r.data,
							position: 'bottom-right',
							duration: 60000,
						});
						// var data =r.data;
						// if(data[0]=="true"){
						// 	setTimeout(() => {
						// 		this.fullscreenLoading = true;
								// url='netmachine/findCmdState';
								// var loadingJson = new Object;
								// loadingJson.cmdTime = data.cmdTime;
								// loadingJson.devId = select.deviceId;
								// var jsonStr=JSON.stringify(loadingJson);
								// this.$api.post(url,{'infos':jsonStr},r=>{
								// 	if(r.result){
								// 		var data2 = r.data;
								// 		if(data2.msg=="true"){
								// 			this.fullscreenLoading = fa;
								// 		}
								// 	}
								// })
						// 		this.fullscreenLoading = false;
						// 	}, 5000);
						// }else if(data[0]=="true2"){
						// 	this.fullscreenLoading = false;
						// 	this.$message.success('操作成功！');
						// }else{
						// 	this.fullscreenLoading = false;
						// 	this.$message.error("操作失败！");
						// }
					}else{
						this.fullscreenLoading = false;
						this.$message.error("操作失败！");
					}
			   })
			   this.uNum='';
			}    
		},		
 	}
}
</script>

<style type="text/css">
#left .ol{
	text-align: left;
	padding-top: 15px;
}
#left .ol li{
	margin: 10px 5px;
}
</style>


