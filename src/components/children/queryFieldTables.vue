<template>
  <div class="my-table-component">
    <el-table
      ref="mainTable"
      size="mini"
      tooltip-effect="dark"
      :highlight-current-row="!multiSelect"
      @current-change="singleSelectedChange"
      :data="tableData"
      :height="fullHeight - this.offsetTop"
      @row-click="tableRowClick"
      @selection-change="tableChangeSelected"
      @sort-change="sortChange"
      @cell-dblclick="onDblclick"
      @filter-change="filterNet"
      border
      v-loading="loading"
      element-loading-text="数据加载中"
      element-loading-background="rgba(0, 0, 0, 0.3)"
    >
      <el-table-column
        v-if="isShowRowCheck()"
        type="selection"
        fixed="left"
        width="45"
      ></el-table-column>
      <el-table-column
        v-if="indexVisible()"
        label="序号"
        type="index"
        width="45"
      ></el-table-column>

      <template v-for="title in tableTitles">
        <template v-if="title.ftype.indexOf('date') > -1">
          <el-table-column
            align="center"
            :show-overflow-tooltip="true"
            :key="title.fname"
            :fixed="title.fixed"
            :sortable="title.sortable"
            :width="title.width"
            :label="title.cname"
            :prop="title.fname"
          >
            <template slot-scope="scope">{{
              dateFormat(scope.row[title.fname], title.ftype)
            }}</template>
          </el-table-column>
        </template>
        <template v-else-if="title.ftype.indexOf('image') > -1">
          <el-table-column
            align="center"
            :show-overflow-tooltip="true"
            :key="title.fname"
            :fixed="title.fixed"
            :sortable="title.sortable"
            :width="title.width"
            :label="title.cname"
            :prop="title.fname"
          >
            <template slot-scope="scope">
              <span
                v-if="scope.row[title.fname]"
                style="cursor: pointer; color: #409eff"
                @click="
                  ChangeIamge(scope.row, scope.row[title.fname], title.fname)
                "
                >图片</span
              >
            </template>
          </el-table-column>
        </template>
        <template v-else-if="title.ftype.indexOf('bit') > -1">
          <el-table-column
            align="center"
            :show-overflow-tooltip="true"
            :key="title.fname"
            :fixed="title.fixed"
            :sortable="title.sortable"
            :width="title.width"
            :label="title.cname"
            :prop="title.fname"
          >
            <template slot-scope="scope">
              <el-checkbox
                onclick="return false"
                v-model="scope.row[title.fname]"
              ></el-checkbox>
            </template>
          </el-table-column>
        </template>
        <template v-else-if="title.ftype.indexOf('tag') > -1">
          <el-table-column
            align="center"
            filter-placement="bottom-end"
            :column-key="title.fname"
            :show-overflow-tooltip="true"
            :key="title.fname"
            :fixed="title.fixed"
            :sortable="title.sortable"
            :filters="[
              { text: '有', value: '1' },
              { text: '无', value: '2' },
            ]"
            :filter-method="filterTag"
            :width="title.width"
            :label="title.cname"
            :prop="title.fname"
          >
            <template slot-scope="scope">
              <el-checkbox
                onclick="return false"
                v-model="scope.row[title.fname]"
              ></el-checkbox>
            </template>
            <template slot-scope="scope">
              <el-tag
                :type="scope.row.tag === '1' ? 'primary' : 'success'"
                disable-transitions
                >{{ scope.row[title.fname] == 1 ? "有" : "无" }}</el-tag
              >
            </template>
          </el-table-column>
        </template>
        <template v-else-if="title.fname.indexOf('state') > -1">
          <el-table-column
            align="center"
            :show-overflow-tooltip="true"
            :key="title.fname"
            :fixed="title.fixed"
            :sortable="title.sortable"
            :width="title.width"
            :label="title.cname"
            :prop="title.fname"
          >
            <template slot-scope="scope">
              <el-link
                :underline="false"
                class="href-link"
                :class="
                  scope.row[title.fname] == '待审核'
                    ? 'rowClassBlue'
                    : scope.row[title.fname] == '不通过'
                    ? 'rowClassRed'
                    : scope.row[title.fname] == '已过期'
                    ? 'rowClassGray'
                    : ''
                "
                >{{ scope.row[title.fname] }}</el-link
              >
            </template>
          </el-table-column>
        </template>
        <template v-else>
          <el-table-column
            align="center"
            :show-overflow-tooltip="true"
            :key="title.fname"
            :fixed="title.fixed"
            :sortable="title.sortable"
            :width="title.width"
            :prop="title.fname"
            :label="title.cname"
          ></el-table-column>
        </template>
      </template>
    </el-table>
    <!-- <br> -->
    <tablePaginationSort
      v-if="paginationVisible"
      :type="type"
      :curPage="curPage"
      :pageSize="pageSize"
      :total="total"
      :tableTitles="tableTitles"
      @change="paginationSortChange"
      @refreshTable="refreshTable"
    ></tablePaginationSort>
    <el-dialog
      title="图片"
      v-dialogDrag
      :visible.sync="imageDialog"
      width="450px"
    >
      <img :src="this.imageUrl" style="width: 100%; height: 420px" />
    </el-dialog>
    <!-- 双击显示流程 -->
    <!-- <el-dialog title="审批流程" :visible.sync="dialogTableVisible">
				 <span>{{this.Process}}</span>				
    </el-dialog>-->
  </div>
</template>
<script type="text/javascript">
import Bus from "../../common/eventBus";
import { mapState } from "vuex";
export default {
  name: "table-component",
  props: {
    currencyquerySql: String, //传过来的sql
    type: String, //表格类型
    primaryKey: String, //主键
    metaInfo: Object, // 页面信息

    paginationVisible: {
      //是否显示分页
      type: Boolean,
      default: true,
      required: false,
    },
    multiSelect: {
      //是否为多选
      type: Boolean,
      default: true,
      required: false,
    },
    initHideConditions: {
      //用于初始化隐藏条件的钩子函数
      type: Function,
      default: null,
      required: false,
    },
  },
  data() {
    return {
      fullHeight: document.documentElement.clientHeight - 229, //定义页面的高度
      offsetTop: 0,
      width: 100,
      height: 400,
      rowCheckVisible: true, // 行 选择框 是否显示
      sort: "",
      conditions: [],
      defaultConditions: [],
      showConditions: [],
      hideConditions: [],
      curPage: 1,
      pageSize: 25,
      total: 0,
      tableTitles: [],
      tableData: [],
      allSelected: [],
      currentSelected: {},
      events: [],
      loading: false, //加载图标显示与否
      EchoData: [], //回显数据
      EchoState: 0, //回显状态
      EchoData1: [], //回显数据1
      EchoData2: [], //回显数据2
      EchoData3: [], //回显数据3
      vacationTypeEchoData: [], //假期类型回显数据
      dialogTableVisible: false,
      Process: [],
      imageDialog: false,
      imageUrl: "",
    };
  },
  computed: {
    ...mapState(["targetRootPath"]),
  },
  created() {
    //this.loading = true;
    // 单选模式时， 行选择框不显示
    this.rowCheckVisible = this.multiSelect;
    //初始化监听事件
    this.initEventListeners();
    //  尝试调用初始化隐藏条件的钩子函数
    if (this.initHideConditions) {
      var hideConditions = [];
      this.initHideConditions(hideConditions);
      this.formatHideConditions(hideConditions);
    }
    // 页面的其它信息。
    this.initMetaInfo();
    // 获取 表格
    this.fetchTableTitles();
    this.$emit("update:clientHeight", this.fullHeight + 85);
    this.$store.state.MHeight = this.fullHeight + 51;
    console.log(this.fullHeight);
  },
  //把window.onresize事件挂在到mounted
  mounted() {
    // setTimeout(() => {
    //   this.offsetTop = this.$refs.mainTable.$el.offsetTop
    //   console.log(this.offsetTop)
    // }, 500)
    const that = this;
    (window.onresize = () => {
      return (() => {
        that.fullHeight = document.documentElement.clientHeight - 229;
        this.$store.state.MHeight = this.fullHeight + 51;
        this.$emit("update:clientHeight", this.fullHeight + 85);
      })(); //屏幕变化自动执行函数
    }),
      $(function () {
        var isResizing = false,
          lastDownX = 0;
        var container = $("#container"),
          left = $("#left"),
          right = $("#right"),
          handle = $("#handle");
        handle.on("mousedown", function (e) {
          isResizing = true;
          lastDownX = e.clientX;
        });
        $(document)
          .on("mousemove", function (e) {
            if (!isResizing) return;
            // var offsetRight = container.width() - (e.clientX - container.offset().left);
            var offsetRight = e.clientX - container.offset().left;
            left.css("width", offsetRight);
            right.css("left", offsetRight + 13);
            if (offsetRight <= 0) {
              right.css("left", 4);
            }
          })
          .on("mouseup", function (e) {
            isResizing = false;
          });
      });
  },
  //监听window.onresize事件,为了优化避免频繁而卡顿
  watch: {
    fullHeight(val) {
      if (!this.timer) {
        this.fullHeight = val;
        this.timer = true;
        let that = this;
        setTimeout(function () {
          that.timer = false;
        }, 400);
      }
    },
  },
  methods: {
    filterNet(net){
      let conditions = []
      let tags = ''
      for(let i=0,len=net.tag.length; i<len; i++){
        tags += tags ? ',' + net.tag[i] : net.tag[i]
      }
      this.$refs["mainTable"].curPage = 1;
      conditions.sql = "and tag in (" + tags + ")"
      Bus.$emit(this.type + 'doTableDataQuery', conditions)
    },
    filterTag(value, row) {
      return row.tag === value;
    },
    getSplicing(conditions, link, editor, texts) {
      //条件拼接 正常条件
      if (texts === "" || texts === undefined) {
        return {
          field: conditions,
          link: link,
          editor: editor,
          value: texts,
        };
      } else {
        return {
          field: conditions,
          link: link,
          editor: editor,
          value: texts,
        };
      }
    },

    onDblclick(row) {
      this.$api.get(
        "common/queryAProcessInfo",
        { type: this.type, id: row[this.primaryKey] },
        (r) => {
          if (r.result) {
            this.dialogTableVisible = true;
            this.Process = r.data;
            console.log("流程显示：" + r.data);
          }
        }
      );
    },
    refreshTable() {
      //点击刷新按钮
      this.fetchTableData();
    },
    isShowRowCheck() {
      // 用于判断 是否 显示表格左侧的checkbox列
      if (this.rowCheckVisible) {
        if (this.tableTitles && this.tableTitles.length > 0) {
          return true;
        }
      }
      return false;
    },
    indexVisible() {
      // 用于判断 是否 显示表格左侧的索引列
      if (!this.rowCheckVisible) {
        if (this.tableTitles && this.tableTitles.length > 0) {
          return true;
        }
      }
      return false;
    },
    initEventListeners() {
      // 初始化监听事件
      const clearTableSelectedEvent = this.type + "clearTableSelected";
      const doTableDataQueryEvent = this.type + "doTableDataQuery";
      const defaultConditionsChange = this.type + "defaultConditionsChange";
      const labelsChange = this.type + "refreshTableLabels";
      this.events = [
        clearTableSelectedEvent,
        doTableDataQueryEvent,
        defaultConditionsChange,
        labelsChange,
      ];
      //事件监听先取消，再添加， 防止重复监听事件
      //先取消事件监听
      this.clearEventListeners();
      //再添加事件监听
      Bus.$on(clearTableSelectedEvent, () => {
        this.clearSelected();
      });
      Bus.$on(doTableDataQueryEvent, (conditions) => {
        this.fetchTableData(conditions);
      });
      Bus.$on(defaultConditionsChange, (conditions) => {
        // this.defaultConditions = conditions || []
        this.curPage = 1;
        this.fetchTableData(conditions);
      });
      Bus.$on(labelsChange, () => {
        this.tableTitles.splice(0);
        this.$nextTick(() => {
          this.refreshTableTitles();
        });
      });
    },
    clearEventListeners() {
      // 批量取消监听事件，初始化监听事件之前与组件销毁之前都要调用该方法
      for (var i = 0, len = this.events.length; i < len; i++) {
        // console.log(`清空 ${this.type} 监听事件: ${this.events[i]}`)
        Bus.$off(this.events[i]);
      }
    },
    initMetaInfo() {
      // 初始化页面其它信息
      this.$api.get("common/metaInfo", { type: this.type }, (r) => {
        if (r.result) {
          this.width = r.data.pageInfo.width;
          this.height = r.data.pageInfo.height || 400;
          this.pageSize = r.data.pageInfo.pageSize;
          //预排版 form表单
          this.$emit("update:metaInfo", r.data);
          this.initOptionSet(r.data.dataIds);
        }
      });
    },
    initOptionSet(dataIds) {
      // 初始化下拉选择框的数据
      if (!dataIds || dataIds.length < 1) return;
      const ids = dataIds.join(",");
      if (!ids) return;
      this.$api.get("common/optionSet", { dataIds: ids }, (r) => {
        if (r.result) {
          this.$emit("update:optionSet", r.data);
        }
      });
    },
    dateFormat(rawValue, type) {
      // 日期格式化处理
      const signIndex = type.indexOf("#");
      if (signIndex > -1) {
        const format = type.substring(signIndex + 1, type.length);
        return rawValue ? new Date(rawValue).Format(format) : "";
      }

      switch (type) {
        case "date":
          return rawValue ? new Date(rawValue).Format("yyyy-MM-dd") : "";
        case "datetime":
          return rawValue
            ? new Date(rawValue).Format("yyyy-MM-dd hh:mm:ss")
            : "";
        case "smalldatetime":
          return rawValue
            ? new Date(rawValue).Format("yyyy-MM-dd hh:mm:ss")
            : "";
      }
      return rawValue;
    },
    tableChangeSelected(selection) {
      // 表格为多选时， 表格已选项已改变触发的事件处理
      this.allSelected = selection;
      if (selection.length > 0) {
        this.currentSelected = selection[selection.length - 1];
      } else {
        this.currentSelected = {};
      }
      this.notifyTableSelectedChange();
    },
    tableRowClick(row, event, column) {
      // 表格行点击事件处理
      const len = this.allSelected.length || 0;
      let isChecked = false;
      for (let i = 0; i < len; i++) {
        if (this.allSelected[i][this.primaryKey] === row[this.primaryKey]) {
          isChecked = true;
          break;
        }
      }
      this.$refs["mainTable"].toggleRowSelection(row);
    },
    singleSelectedChange(currentSelected, oldSelected) {
      // 当 表格为单选时，选择改变触发的事件处理
      this.allSelected = [currentSelected];
      this.currentSelected = currentSelected;
      this.notifyTableSelectedChange();
    },
    clearSelected() {
      // 清空表格已选择
      if (!this.$refs["mainTable"]) return;
      this.$refs["mainTable"].clearSelection();
    },
    notifyTableSelectedChange() {
      // 提醒父组件 表格选择项发生改变
      this.$emit("update:allSelected", this.allSelected);
      this.$emit("update:currentSelected", this.currentSelected);
      this.$emit("update:currentId", this.getCurrentId());

      this.$emit("selectedChange", this.currentSelected);
    },
    getCurrentId() {
      //当前已选项的id(主键值)
      if (this.currentSelected && this.currentSelected[this.primaryKey]) {
        return this.currentSelected[this.primaryKey];
      }
      return -1;
    },

    // 分页参数改变事件处理
    paginationSortChange(curPage, pageSize) {
      //console.log("改变页数")
      //this.loading = true;
      this.curPage = curPage || this.curPage;
      this.pageSize = pageSize || this.pageSize;
      this.fetchTableData();
    },
    // 排序 改变事件处理
    sortChange(col) {
      if (!col || !col.order || !col.order) {
        this.sort = "";
      } else {
        const order = col.order === "ascending" ? "asc" : "desc";
        const prop = col.prop;
        this.sort = prop + " " + order;
      }
      this.fetchTableData();
    },
    ChangeIamge(row, url, name) {
      this.imageDialog = true;
      this.imageUrl = this.targetRootPath + "uploadfile/" + url;
    },

    getArgs() {
      // 查询数据请求的参数
      return {
        type: this.type,
        conditions: JSON.stringify(this.conditions),
        order: this.sort,
        curPage: this.curPage,
        pageSize: this.pageSize,
      };
    },

    fetchTableTitles() {
      // 获取 表格 标题
      this.$api.get("common/labels?type=" + this.type, null, (r) => {
        if (r.result) {
          this.tableTitles = r.data;
          //console.log("标题:"+JSON.stringify(r.data))
          this.fetchTableData();
        }
      });
    },
    refreshTableTitles() {
      // 刷新 表格的标题
      this.$api.get("common/labels?type=" + this.type, null, (r) => {
        if (r.result) {
          this.tableTitles = r.data;
          this.$refs["mainTable"].doLayout();
        }
      });
    },
    formatHideConditions(hideConditions) {
      // 格式化 隐藏查询条件
      for (var i = 0, len = hideConditions.length; i < len; i++) {
        const item = hideConditions[i];

        const field = item.field;
        const link = item.link;
        const value = item.value;
        const editor = item.editor;

        this.pushHideCondition(field, value, link, editor);
      }
    },
    // condition e.g.{
    // 		field: '', 字段名
    //    link: '', 连接符（e.g. =, <, >, ...）
    //    value: '', 条件值
    //    editor: ''  使用的控件类型
    // 	}
    // 新增 或修改 查询条件
    pushHideCondition(field, value, link, editor) {
      if (!field) {
        return;
      }

      const condition = {
        field: field,
        value: value + "",
        link: link || "=",
        editor: editor || "text",
      };

      const index = this.getHideConditionIndex(condition);
      if (index > -1) {
        //若已存在则替换。
        this.hideConditions.splice(index, 1, condition);
      } else {
        this.hideConditions.push(condition);
      }
    },
    getHideConditionIndex(condition) {
      //获取某一隐藏条件在隐藏条件列表的索引
      for (var i = 0, len = this.hideConditions.length; i < len; i++) {
        const item = this.hideConditions[i];
        if (item.field === condition.field) {
          return i;
        }
      }
      return -1;
    },
    removeHideCondition(fieldName) {
      //移除隐藏条件，根据字段名
      for (var i = 0, len = this.hideConditions.length; i < len; i++) {
        const item = this.hideConditions[i];
        if (item.field === fieldName) {
          this.hideConditions.splice(i, 1);
          return;
        }
      }
    },

    // 从 服务器 获取表格数据
    fetchTableData(conditions) {
      this.loading = true;
      if (conditions) {
        this.currencyquerySql = "";
        console.log("进入公共table if:", conditions);
        this.showConditions = conditions;
        this.conditions = [];
        this.conditions = [
          ...this.hideConditions,
          ...conditions,
          ...this.defaultConditions,
        ];
        if (conditions.sql) {
          //如果拼接的SQL不为空 将拼接的SQL传到后台
          this.conditions = [];
          this.currencyquerySql = conditions.sql;
          this.conditions.push(conditions.sql);
        }
      } else {
        console.log(
          "进入公共table else",
          "传过来的sql:",
          this.currencyquerySql
        );
        this.conditions = [
          ...this.conditions,
          ...this.hideConditions,
          ...this.showConditions,
          ...this.defaultConditions,
        ];
        if (this.hideConditions.length > 0) {
          this.conditions = [...this.hideConditions, ...this.defaultConditions];
        } else {
          this.conditions = [
            ...this.conditions,
            ...this.showConditions,
            ...this.defaultConditions,
          ];
        }

        if (
          this.currencyquerySql != null &&
          this.currencyquerySql != "" &&
          this.currencyquerySql != undefined &&
          this.currencyquerySql != "0"
        ) {
          if (this.conditions != null) {
            this.conditions = [];
            this.conditions.push(this.currencyquerySql);
            console.log("公共table刷新检查：", this.currencyquerySql);
          }
        } else {
          console.log("还没有sql传到公共table");
        }
      }
      this.$api.post("common/query", this.getArgs(), (r) => {
        if (r.result == "") {
          this.loading = false; //当数据库没有数据时先关闭进度条
        } else {
          this.formatTableData(r.map);
          this.loading = false;
        }
      });
    },

    formatTableData(map) {
      //需要特殊处理的表格走此方法
      var stateData = map.rows; //审核字段
      this.stateBackData(stateData); //所有页面的审核字段回显
      var type = this.type;
      if (type == "facialManagement") {
        //面像管理
        this.tableData = map.rows;
        this.total = map.total;
      } else if (
        type == "originalBaseSalary" ||
        type == "monthlyBaseSalary" ||
        type == "changeSalary"
      ) {
        //原始底薪与当月底薪和调薪作业回显
        var odata = map.rows; //计薪方式
        this.changeBackData(odata); //原始底薪和调薪作业回显
        this.tableData = odata;
        this.total = map.total;
      } else if (type == "Real-timeProcessing") {
        //实时处理
        var Rpoint = map.rows; //休假时间段
        this.RpointData(Rpoint); //实时处理回显
        this.tableData = Rpoint;
        this.total = map.total;
      } else if (type == "employee") {
        //员工
        var employee = map.rows;
        this.employeeData(employee);
        this.tableData = employee;
        this.total = map.total;
      } else if (type == "dayVacation") {
        //日休假表
        var dayVacation = map.rows; //休假时间段
        this.dayVacationData(dayVacation); //日休假表回显
        this.tableData = dayVacation;
        this.total = map.total;
      } else if (type == "proofSuit") {
        //证服设置
        var proofSuitType = map.rows; //类型
        this.proofSuitData(proofSuitType); //证服设置回显
        this.tableData = proofSuitType;
        this.total = map.total;
      } else if (type == "vacationType" || type == "defaultHoliday") {
        //假期类型和默认假日
        var vacationType = map.rows;
        this.vacationTypeData(vacationType);
        this.tableData = vacationType;
        this.total = map.total;
      } else if (type == "ConferenceRoom") {
        //会议室
        var available = map.rows; //类型
        this.ConferenceRoomData(available); //会议室回显
        this.tableData = available;
        this.total = map.total;
      } else {
        //其他q1
        this.tableData = map.rows;
        this.total = map.total;
      }
    },
    changeBackData(odata) {
      //处理原始底薪与当月底薪回显
      if (this.EchoState == 0) {
        //console.log('状态为0')
        this.$api.get("common/getNumAndName", { type: "payStyle" }, (r) => {
          if (r.result) {
            this.EchoData = r.data;
            for (let i = 0; i < odata.length; i++) {
              for (let j = 0; j < r.data.length; j++) {
                if (odata[i]["PWay"] == r.data[j]["num"]) {
                  odata[i]["PWay"] = r.data[j]["name"];
                }
                if (odata[i]["NPWay"] == r.data[j]["num"]) {
                  odata[i]["NPWay"] = r.data[j]["name"];
                }
                if (odata[i]["OPWay"] == r.data[j]["num"]) {
                  odata[i]["OPWay"] = r.data[j]["name"];
                }
              }
            }
            this.EchoState = 1;
            //console.log("赋值结果：",this.EchoData)
          }
        });
      } else {
        //console.log('状态为1')
        for (let i = 0; i < odata.length; i++) {
          for (let j = 0; j < this.EchoData.length; j++) {
            if (odata[i]["PWay"] == this.EchoData[j]["num"]) {
              odata[i]["PWay"] = this.EchoData[j]["name"];
            }
            if (odata[i]["NPWay"] == this.EchoData[j]["num"]) {
              odata[i]["NPWay"] = this.EchoData[j]["name"];
            }
            if (odata[i]["OPWay"] == this.EchoData[j]["num"]) {
              odata[i]["OPWay"] = this.EchoData[j]["name"];
            }
          }
        }
      }
    },

    stateBackData(tableData) {
      //所有页面字段回显
      if (this.EchoState == 0) {
        //console.log('状态为0')
        //1
        this.$api.get("common/getNumAndName", { type: "state" }, (r) => {
          if (r.result) {
            this.EchoData1 = r.data;
            for (let i = 0; i < tableData.length; i++) {
              for (let j = 0; j < r.data.length; j++) {
                if (tableData[i]["state"] == r.data[j]["num"]) {
                  tableData[i]["state"] = r.data[j]["name"];
                }
              }
            }
            this.EchoState = 1;
            //console.log("赋值结果1：",this.EchoData1)
          }
        });
        //2
        this.$api.get("common/getNumAndName", { type: "employeeType" }, (r) => {
          if (r.result) {
            this.EchoData2 = r.data;
            for (let i = 0; i < tableData.length; i++) {
              for (let j = 0; j < r.data.length; j++) {
                if (tableData[i]["employeeType"] == r.data[j]["num"]) {
                  tableData[i]["employeeType"] = r.data[j]["name"];
                }
              }
            }
            this.EchoState = 1;
            //console.log("赋值结果2：",this.EchoData2)
          }
        });
        //3
        this.$api.get(
          "common/getNumAndName",
          { type: "turnoverInterview" },
          (r) => {
            if (r.result) {
              this.EchoData3 = r.data;
              for (let i = 0; i < tableData.length; i++) {
                for (let j = 0; j < r.data.length; j++) {
                  if (tableData[i]["leaveType"] == r.data[j]["num"]) {
                    tableData[i]["leaveType"] = r.data[j]["name"];
                  }
                }
              }
              this.EchoState = 1;
              //console.log("赋值结果3：",this.EchoData3)
            }
          }
        );
      } else {
        //console.log('状态为1')
        for (let i = 0; i < tableData.length; i++) {
          for (let j = 0; j < this.EchoData1.length; j++) {
            if (tableData[i]["state"] == this.EchoData1[j]["num"]) {
              tableData[i]["state"] = this.EchoData1[j]["name"];
            }
          }
          for (let j = 0; j < this.EchoData2.length; j++) {
            if (tableData[i]["employeeType"] == this.EchoData2[j]["num"]) {
              tableData[i]["employeeType"] = this.EchoData2[j]["name"];
            }
          }
          for (let j = 0; j < this.EchoData3.length; j++) {
            if (tableData[i]["leaveType"] == this.EchoData3[j]["num"]) {
              tableData[i]["leaveType"] = this.EchoData3[j]["name"];
            }
          }
        }
      }
    },

    RpointData(Rpoint) {
      //实时处理休假时间段回显
      if (this.EchoState == 0) {
        //console.log('状态为0')
        this.$api.get("common/getNumAndName", { type: "RpointType" }, (r) => {
          if (r.result) {
            this.EchoData = r.data;
            for (let i = 0; i < Rpoint.length; i++) {
              for (let j = 0; j < r.data.length; j++) {
                if (Rpoint[i]["Rpoint"] == r.data[j]["num"]) {
                  Rpoint[i]["Rpoint"] = r.data[j]["name"];
                }
              }
            }
            this.EchoState = 1;
            //console.log("赋值结果：",this.EchoData)
          }
        });
      } else {
        //console.log('状态为1')
        for (let i = 0; i < Rpoint.length; i++) {
          for (let j = 0; j < this.EchoData.length; j++) {
            if (Rpoint[i]["Rpoint"] == this.EchoData[j]["num"]) {
              Rpoint[i]["Rpoint"] = this.EchoData[j]["name"];
            }
          }
        }
      }
    },

    employeeData(employee) {
      //处理员工回显
      if (this.EchoState == 0) {
        //console.log('状态为0')
        this.$api.get("common/getNumAndName", { type: "sexType" }, (r) => {
          if (r.result) {
            this.EchoData = r.data;
            for (let i = 0; i < employee.length; i++) {
              for (let j = 0; j < r.data.length; j++) {
                if (employee[i]["sex"] == r.data[j]["num"]) {
                  employee[i]["sex"] = r.data[j]["name"];
                }
              }
            }
            this.EchoState = 1;
            //console.log("赋值结果：",this.EchoData)
          }
        });
      } else {
        //console.log('状态为1')
        for (let i = 0; i < employee.length; i++) {
          for (let j = 0; j < this.EchoData.length; j++) {
            if (employee[i]["sex"] == this.EchoData[j]["num"]) {
              employee[i]["sex"] = this.EchoData[j]["name"];
            }
          }
        }
      }
    },

    dayVacationData(dayVacation) {
      //日休假表休假时间段回显
      if (this.EchoState == 0) {
        //console.log('状态为0')
        this.$api.get("common/getNumAndName", { type: "vacationTime" }, (r) => {
          if (r.result) {
            this.EchoData = r.data;
            for (let i = 0; i < dayVacation.length; i++) {
              for (let j = 0; j < r.data.length; j++) {
                if (dayVacation[i]["RPoint"] == r.data[j]["num"]) {
                  dayVacation[i]["RPoint"] = r.data[j]["name"];
                }
              }
            }
            this.EchoState = 1;
            //console.log("赋值结果：",this.EchoData)
          }
        });
      } else {
        //console.log('状态为1')
        for (let i = 0; i < dayVacation.length; i++) {
          for (let j = 0; j < this.EchoData.length; j++) {
            if (dayVacation[i]["RPoint"] == this.EchoData[j]["num"]) {
              dayVacation[i]["RPoint"] = this.EchoData[j]["name"];
            }
          }
        }
      }
    },

    proofSuitData(proofSuitData) {
      //证服设置
      if (this.EchoState == 0) {
        //console.log('状态为0')
        this.$api.get("common/getNumAndName", { type: "proof" }, (r) => {
          if (r.result) {
            this.EchoData = r.data;
            for (let i = 0; i < proofSuitData.length; i++) {
              for (let j = 0; j < r.data.length; j++) {
                if (proofSuitData[i]["Type"] == r.data[j]["num"]) {
                  proofSuitData[i]["Type"] = r.data[j]["name"];
                }
              }
            }
            this.EchoState = 1;
            //console.log("赋值结果：",this.EchoData)
          }
        });
      } else {
        //console.log('状态为1')
        for (let i = 0; i < proofSuitData.length; i++) {
          for (let j = 0; j < this.EchoData.length; j++) {
            if (proofSuitData[i]["Type"] == this.EchoData[j]["num"]) {
              proofSuitData[i]["Type"] = this.EchoData[j]["name"];
            }
          }
        }
      }
    },

    vacationTypeData(vacationType) {
      //假期类型
      if (this.EchoState == 0) {
        //console.log('状态为0')
        //1
        this.$api.get(
          "common/getNumAndName",
          { type: "vacationToWork" },
          (r) => {
            if (r.result) {
              this.EchoData = r.data;
              for (let i = 0; i < vacationType.length; i++) {
                for (let j = 0; j < r.data.length; j++) {
                  if (vacationType[i]["AWType"] == r.data[j]["num"]) {
                    vacationType[i]["AWType"] = r.data[j]["name"];
                  }
                }
              }
              this.EchoState = 1;
              //console.log("赋值结果：",this.EchoData)
            }
          }
        );
        //2
        this.$api.get("common/getNumAndName", { type: "holidayType" }, (r) => {
          if (r.result) {
            this.vacationTypeEchoData = r.data;
            for (let i = 0; i < vacationType.length; i++) {
              for (let j = 0; j < r.data.length; j++) {
                if (vacationType[i]["type"] == r.data[j]["num"]) {
                  vacationType[i]["type"] = r.data[j]["name"];
                }
              }
            }
            this.EchoState = 1;
          }
        });
      } else {
        //console.log('状态为1')
        for (let i = 0; i < vacationType.length; i++) {
          for (let j = 0; j < this.EchoData.length; j++) {
            if (vacationType[i]["AWType"] == this.EchoData[j]["num"]) {
              vacationType[i]["AWType"] = this.EchoData[j]["name"];
            }
          }
          for (let j = 0; j < this.vacationTypeEchoData.length; j++) {
            if (
              vacationType[i]["type"] == this.vacationTypeEchoData[j]["num"]
            ) {
              vacationType[i]["type"] = this.vacationTypeEchoData[j]["name"];
            }
          }
        }
      }
    },

    ConferenceRoomData(availableData) {
      //会议室
      console.log("进入会议室回显");
      if (this.EchoState == 0) {
        //console.log('状态为0')
        this.$api.get("common/getNumAndName", { type: "available" }, (r) => {
          if (r.result) {
            this.EchoData = r.data;
            for (let i = 0; i < availableData.length; i++) {
              for (let j = 0; j < r.data.length; j++) {
                if (availableData[i]["available"] == r.data[j]["num"]) {
                  availableData[i]["available"] = r.data[j]["name"];
                }
              }
            }
            this.EchoState = 1;
            //console.log("赋值结果：",this.EchoData)
          }
        });
      } else {
        //console.log('状态为1')
        for (let i = 0; i < availableData.length; i++) {
          for (let j = 0; j < this.EchoData.length; j++) {
            if (availableData[i]["available"] == this.EchoData[j]["num"]) {
              availableData[i]["available"] = this.EchoData[j]["name"];
            }
          }
        }
      }
    },

    beforeDestroy() {
      //console.log(`清空 ${this.type} 监听事件`)
      // 清空 监听事件
      this.clearEventListeners();
    },
    changeSqlValue() {
      this.currencyquerySql = "";
    },
  },
};
</script>


<style type="text/css" >
div.my-table-component tr.el-table__row td {
  cursor: pointer !important;
}
.my-table-component .current-row td {
  background-color: #2b9cfa !important;
  color: white;
}
</style>






