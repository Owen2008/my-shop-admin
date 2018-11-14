<template>
 <div class="categories">
 <el-button type="success" plain>添加分类</el-button>
 <el-table :data=" cateList" style="width:100%">
  <el-table-column type="index"></el-table-column>
  <el-table-column prop="cat_name" label="分类名称" >
  </el-table-column>
    <el-table-column prop="cat_deleted" label="是否有效" >
      <template slot-scope="scope">
        {{scope.row.cat_deleted}}
      </template>
  </el-table-column>
    <el-table-column prop="cat_level" label="排序" >
  </el-table-column>
    
   <el-table-column label="操作">
       <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini"
          plain></el-button>
        <el-button type="danger" icon="el-icon-delete" size="mini" plain
        ></el-button>
      </template>
    </el-table-column>
</el-table>
 <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[5,10, 20, 30, 40]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      background>
    </el-pagination>
 </div>
</template>

<script>
export default {
  data() {
    return {
      pageSize: 5,
      total: 0,
      currentPage: 1,
      cateList: []
    }
  },
  methods: {
    async getCateList() {
      let res = await this.axios.get(`categories`, {
        params: {
          type: 3,
          pagesize: this.pageSize,
          pagenum: this.currentPage
        }
      })
      console.log(res)
      let { meta: { status }, data: { total, pagesize, pagenum, result } } = res
      if (status === 200) {
        this.total = total
        this.pageSize = pagesize
        this.currentPage = pagenum
        this.cateList = result
      }
    },
    handleSizeChange(v) {
      this.pageSize = v
      this.getCateList()
    },
    handleCurrentChange(v) {
      this.currentPage = v
      this.getCateList()
    }
  },
  created() {
    this.getCateList()
  }
}
</script>

<style>
</style>
