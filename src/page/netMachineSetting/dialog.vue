<template>
  <el-dialog
    :title="title"
    :visible.sync="setVisible"
    width="1060px"
    style="text-alin:left"
    @closed="closeDialog"
    :close-on-click-modal="false"
  >
  <el-form :model="saveData" :rules="rules" ref="ruleForm" >
    <el-row
      v-for="(row,num) in machineList" :key="num"
      style="padding-top: 16px"
    >
      <div v-for="item in row" :key="item.title" >
        <form-item
          v-bind:config="item"
          @input="formInput"
          @select="formSelect"
          :disable.sync="disable"
          :value.sync="saveData[item.name]"
        ></form-item>
      </div>
    </el-row>
    <el-form-item class="f-ac-end">
      <el-button type="primary" @click="submitDialog('ruleForm')" size="mini">确 定</el-button>
      <el-button @click="closeDialog" size="mini">取 消</el-button>
    </el-form-item>
  </el-form>
  </el-dialog>
</template>
<script>
import { dateToStr } from "@/utils/time.js"
const machineType = [
  { label: "YJ710", value: "YJ710" },
  { label: "YJ680", value: "YJ680" },
];
const regNumber=/^\d{1,}$/
import formItem from "@/components/children/dialogForm.vue";
export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "",
    },
    typeConfig:{
      type:Object
    }
  },
  watch:{
    visible:{
      handler(newVal){
        if(newVal){
          if(this.typeConfig.id){
             this.saveData = {...this.typeConfig}
             this.saveData.SDate && (this.saveData.SDate = dateToStr(new Date(this.saveData.SDate)))
             this.saveData.CreateD && (this.saveData.CreateD = dateToStr(new Date(this.saveData.CreateD)))
             this.saveData.ModifyD && (this.saveData.ModifyD = dateToStr(new Date(this.saveData.ModifyD)))
          }else{
            this.saveData = {IsAClear:false,IsUsed:false,IsRMachi:false,IsSTime:false}
          }
        }
      },
      immediate:true
    }
  },
  computed: {
    setVisible: {
      get() {
        //回调函数 当需要读取当前属性值是执行，根据相关数据计算并返回当前属性的值
        return this.visible;
      },
      set(val) {
        //监视当前属性值的变化，当属性值发生变化时执行，更新相关的属性数据
        //val就是fullName3的最新属性值
        this.$emit("update:visible", val);
      },
    },
  },
  components: { formItem },
  data() {
    var PureNumber = (rule, value, callback) => {
        if (!value) {
          callback(new Error(rule.title+'不能为空'));
        } else if (!regNumber.test(value)) {
          callback(new Error(rule.title+'必须为数字'));
        } else {
          callback();
        }
     }
    return {
      disable: false,
      rules: {
        MNum: [
          { required: true, validator: PureNumber, trigger: 'blur',title:'机器识别号' },
        ],
        deviceId: [
          { required: true,  message: '机器识别号不能为空', trigger: 'change'}
        ],
        MAddr: [
          { required: true,  message: '机器地址不能为空', trigger: 'change' }
        ],
        MType: [
          { required: true,  message: '机器类型不能为空', trigger: 'change' }
        ],
        Version: [
          { required: true,   message: '版本型号不能为空', trigger: 'change' }
        ]
      },
      saveData: {
      },
      // 渲染列表
      machineList: [
        [
          {
            type: "input",
            name: "MNum",
            title: "机器编号",
            span: 8,
          },
          {
            type: "input",
            name: "deviceId",
            title: "机器识别号",
            span: 8,
          },
          {
            type: "input",
            name: "MAddr",
            title: "机器地址",
            span: 8,
          },
        ],
        [
          {
            type: "input",
            name: "MType",
            title: "机器类型",
            span: 8,
          },
          {
            type: "picker_same",
            name: "Version",
            title: "版本型号",
            range: machineType,
            span: 8,
          },
          {
            type: "input",
            name: "Comm",
            title: "通讯端口",
            span: 8,
          },
        ],
        [
          {
            type: "switch",
            name: "IsAClear",
            title: "自动清除",
            span: 8,
          },
          {
            type: "switch",
            name: "IsUsed",
            title: "有效机器",
            span: 8,
          },
          {
            type: "switch",
            name: "IsRMachi",
            title: "发卡机",
            span: 8,
          },
        ],
        [
          {
            type: "switch",
            name: "IsSTime",
            title: "收数时校时",
            span: 8,
          },
          {
            type: "input",
            name: "CLapse",
            title: "刷卡延时",
            span: 8,
          },
          {
            type: "datetimes",
            name: "SDate",
            title: "下发时间",
            span: 8,
          },
        ],
        [
          {
            type: "input",
            name: "CType",
            title: "标识类型",
            span: 8,
          },
          {
            type: "input",
            name: "IPAddr",
            title: "IP地址",
            span: 8,
          },
          {
            type: "input",
            name: "Remark",
            title: "备注",
            span: 8,
          },
        ],
      ],
    };
  },
  methods: {
    closeDialog() {
      this.setVisible = false;
    },
    submitDialog(formName) {
       this.$refs[formName].validate((valid) => {
          if (valid) {
                var obj = {
                  ...this.saveData
                }
                let url ='hrtWMachine/add'
                if(this.typeConfig.id){
                  url = 'hrtWMachine/update'
                  obj.id = this.typeConfig.id
                }
                // obj.SDate = new Date(this.saveData.SDate).Format('yy-MM-dd HH:mm:ss')
                this.api.post(url, {obj:JSON.stringify(obj),key:'id'},(res => {
                  if(res.result) {
                    this.$message({message:"操作成功",type:'success'})
                    this.closeDialog()
                    this.$emit('updateTable')
                  }else {
                    // 报错提示 res.msg
                  }
                }))
            } else {
            console.log('error submit!!');
            return false;
          }
        });
  
    },
    formInput(config, val) {
      this.saveData[config.name] = val;
    },
    formSelect(config, val) {
      this.saveData[config.name] = val;
    },
  },
  mounted(){
    
  },
  created() {
  },
};
</script>
<style >
.cargo_list {
  margin-top: 10px;
  margin-left: 20px;
  width: 99%;
}
.title {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  color: #1890ff;
  font-size: 14px;
  height: 35px;
  width: 99%;
  line-height: 35px;
  margin-left: 20px;
  position: relative;
}
.tag {
  margin-left: 20px;
  border: 1px solid #1890ff;
  color: #1890ff;
  width: 55px;
  height: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
}
.operation {
  color: #1890ff;
  display: flex;
  align-items: center;
}
.title::after {
  height: 2px;
  content: "";
  background: #f2f2f2;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
}
.title .line {
  z-index: 10;
  position: absolute;
  left: 0;
  bottom: 0;
  background: #1890ff;
  height: 2px;
}
.el-dialog__header{
  text-align: left;
}
</style>