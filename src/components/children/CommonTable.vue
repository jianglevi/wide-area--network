<template>
    <div class="table">
     <el-table
       class="table_content"
       :data="tableData"
       size="mini"
       border
       @select="selectTableList"
       @select-all="selectTableList"
       :row-style="{ height: '40px' }"
       :cell-style="{ padding: 0 }"
       height="600"
       style="width: 100%"
      > 
      <el-table-column type="selection" width="50" v-if="tableConfig.checkbox"></el-table-column>
        <template  v-for="item in tableColumn">
            <el-table-column
               v-if="item.type == 'input'"
              :key="item.label"
              :prop="item.prop"
              :label="item.label"
               sortable
               width="180"
               align="center"
              >
              <template slot-scope="scope">
               <el-input
                 size="mini"
                 clearable
                 :disabled="true"
                 v-model="scope.row[item.prop]"
                 @input="tableInput(scope, item)"
                 :placeholder="'请输入' + item.label"
               ></el-input>
             </template>
            </el-table-column>
            <el-table-column
              v-else-if="item.type == 'picker_same'"
              :key="item.label"
              :prop="item.prop"
              :label="item.label"
              width="180"
              align="center"
            >
              <template slot-scope="scope">
                <el-select
                  :placeholder="'请选择' + item.label"
                  size="mini"
                  clearable
                  :disabled="true"
                  v-model="scope.row[item.prop]"
                  @change="tableSelect(scope, item)"
                >
                  <el-option
                    v-for="row in item.range"
                    :key="row.value"
                    :label="row.label"
                    :value="row.value"
                  >
                  </el-option>
                </el-select>
              </template>
           </el-table-column>
            <el-table-column
              v-else-if="item.type == 'switch'"
              :key="item.label"
              :prop="item.prop"
              :label="item.label"
              width="180"
              align="center"
            >
              <template slot-scope="scope">
                <el-switch
                   v-model="scope.row[item.prop]"
                   :disabled="true"
                   size="mini"
                   clearable
                   active-color="#13ce66">
                </el-switch>
              </template>
           </el-table-column>
            <el-table-column
              sortable
              :key="item.label"
              :prop="item.prop"
              :label="item.label"
              align="center"
              v-else
              :width="item.width"
             ></el-table-column>
          </template>
        <el-table-column  label="操作" width="300" align="center"  v-if="tableConfig.button">
          <template slot-scope="scope">
            <el-button
              @click="handleDetail(scope.row)"
              size="mini"
              type="warning"
              icon="el-icon-collection"
              plain
              >查看</el-button
            >
            <el-button
              @click="handleEdit(scope.row)"
              size="mini"
              type="success"
              icon="el-icon-edit"
              plain
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-document-delete"
              plain
              @click="handleDelete(scope.row, scope.$index)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-if="tableConfig.pagination"
        class="table_Pagination"
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="setCurrentPage"
        :page-size="setPageSize"
        :page-sizes="[20, 50, 100, 200]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination> 
    </div>
</template>
 
<script type="text/javascript">
  export default{
    name:"commonTable",
    props: {
      tableConfig:{
        type:Object,
        default:()=>{
          return {}
        }
      },
      tableColumn:{
        type:Array,
        default:()=>{
          return []
        }
      },
      tableButton:{
        type:Array,
        default:()=>{
          return []
        }
      },
      tableData: {
        type: Array,
        default: ()=>{
          return []
        },
      },
      pageSize:{
        type: Number,
        default: 0
      },
      currentPage:{
        type: Number,
        default: 0
      },
      total:{
        type: Number,
        default: 0
      }
    },
    data(){
      return{
      
      }
    },
    computed:{
      setPageSize:{
        set(val){
          this.$emit("update:pageSize", val);
        },
        get(){
          return this.pageSize
        }
      },
      setCurrentPage:{
        set(val){
          this.$emit("update:currentPage",val)
        },
        get(){
          return this.currentPage
        }
      }
    },
    methods:{
      handleSizeChange(size) {
        this.setPageSize = size
        this.$emit("updateDate")
      },
      handleCurrentChange(currentPage) {
        this.setCurrentPage = currentPage
        this.$emit("updateDate")
      },
      selectTableList(list) {
        this.$emit("selectTable",list)
      },
      handleDetail(row){
        this.$emit("Detail",row)
      },
      handleEdit(row){
        this.$emit("Edit",row)
      },
      handleDelete(row,index){
        this.$emit("Delete",row,index)
      }
    },
    created(){
    }
  }
</script>

<style  type="text/css">
.table_Pagination {
  padding-top: 20px;
  display: flex;
  justify-content: center;
}
</style>