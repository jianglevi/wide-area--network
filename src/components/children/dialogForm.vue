<template>
  <div>
    <el-col :span="config.span" v-if="config.type == 'input'">
      <el-form-item :prop="config.name" :label="config.title+'：'" class="f-ac-end">
        <el-input 
             v-model="setvalue"
             :placeholder="'请输入' + config.title"
             size="mini"
             clearable
             :style="{width:config.width ? config.width : '220px'}"
             @input="input"
             @blur="blur"
             :show-password="config.password"
             :disabled="disable"
           ></el-input>
      </el-form-item>
    </el-col>
    <el-col :span="config.span" v-if="config.type == 'switch'">
      <el-form-item :prop="config.name" :label="config.title+'：'" class="f-ac-end">
         <el-switch
            v-model="setvalue"
            active-color="#13ce66"
            :disabled="disable"
            :style="{width:config.width ? config.width : '220px'}"
            size="mini">
          </el-switch>
      </el-form-item>
    </el-col>
    <el-col :span="config.span" v-else-if="config.type == 'datetimes'">
      <el-form-item :prop="config.name" :label="config.title+'：'" class="f-ac-end">
        <el-date-picker
           clearable
          @change="select"
          v-model="setvalue"
          value-format="yyyy-MM-dd HH:mm:ss"
          type="datetime"
          placeholder="选择日期"
          size="mini"
          :disabled="disable"
        />
      </el-form-item>
    </el-col>
    <el-col :span="config.span" v-else-if="config.type == 'picker_same'">
      <el-form-item :prop="config.name" :label="config.title+'：'" class="f-ac-end">
        <el-select
          clearable
          :multiple="config.multiple"
          v-model="setvalue"
          placeholder="请选择"
          size="mini"
          @change="select"
          :disabled="disable"
        >
          <el-option
            v-for="item in config.range"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
    </el-col>
    <el-col :span="0" v-else-if="config.type == 'hide'"></el-col>
  </div>
</template>
 
<script>
export default {
  props: {
    config: {
      type: Object,
      default: {},
    },
    value:{
    },
    disable:{
      type:Boolean,
      default: false,
    }
  },
  computed:{
    setvalue:{
      get(){
        return this.value;
      },
      set(val){
        this.$emit("update:value", val);
      }
    },
  },
  data() {
    return {
     
    };
  },
  methods: {
    input(val) {
      let event = this.config.event ? this.config.event : "input";
      this.$emit(event, this.config, val);
    },
    blur(val) {
      let event = this.config.event ? this.config.event : "blur";
      this.$emit(event, this.config, val);
    },
    select(val) {
      let event = this.config.event ? this.config.event : "select";
      this.$emit(event, this.config, val);
    },
  },

  created() {
  },
};
</script>

<style >

</style>