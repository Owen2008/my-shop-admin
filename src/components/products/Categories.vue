<template>
 <div class="categories">
 <el-button type="success" plain @click="showAddDialog">添加分类</el-button>
 <el-table :data=" cateList" style="width:100%"
   v-loading="loading"
   element-loading-text="拼命加载中"
  element-loading-spinner="el-icon-loading">
  <el-table-column type="index"></el-table-column>
  <!-- 配置别名 levelKey--缩进层级   treeKey--唯一的id parentKey--树形父级的id,一个等级是一样的-->
    <!-- levelKey="cat_level"
   treeKey="cat_id"
   parentKey="cat_pid" -->
  <el-table-tree-column prop="cat_name" label="分类名称"
   levelKey="cat_level"
   treeKey="cat_id"
   parentKey="cat_pid"
    >
  </el-table-tree-column>
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
        <el-button type="danger" icon="el-icon-delete" size="mini" plain @click="delCate(scope.row)"
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
  <!-- 添加对话框 -->
    <el-dialog title="添加分类" :visible.sync="AddDialogVisible" width="40%">
        <el-form ref="form" :model="addform" label-width="80px" :rules="rules">
          <el-form-item label="分类名称" prop="cateName">
            <el-input v-model="addform.cateName"></el-input>
          </el-form-item>
          <el-form-item label="父级名称" prop="parentName">
              <el-cascader
                :options="options2"
                change-on-select
                :props="props"
                v-model="addform.catePid"
              ></el-cascader>
          </el-form-item>
      </el-form>
        <span slot="footer" class="dialog-footer">
      <el-button @click="AddDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="addCate" >确 定</el-button>
      </span>
  </el-dialog>
 </div>
</template>

<script>
export default {
  data() {
    return {
      pageSize: 5,
      total: 0,
      currentPage: 1,
      cateList: [],
      AddDialogVisible: false,
      addform: {
        cateName: '',
        catePid: []
      },
      loading: true,
      rules: {
        cateName: [
          {
            required: true,
            message: '请输入分类名称',
            trigger: 'blur'
          }
        ]
      },
      options2: [],
      props: {
        value: 'cat_id',
        label: 'cat_name'
      }
    }
  },
  methods: {
    // 有分页的分类列表,3级分类
    async getCateList() {
      this.loading = true
      let res = await this.axios.get(`categories`, {
        params: {
          type: 3,
          pagesize: this.pageSize,
          pagenum: this.currentPage
        }
      })
      // console.log('CateList', res)
      let { meta: { status }, data: { total, pagesize, pagenum, result } } = res
      if (status === 200) {
        this.total = total
        this.pageSize = pagesize
        this.currentPage = pagenum + 1
        this.cateList = result
        this.loading = false
      }
    },
    // 查询2级的分类,不带分页,用于添加多选框的渲染
    async getCateTwoList() {
      let res = await this.axios.get(`categories`, {
        params: {
          type: 2
        }
      })
      // console.log('CateList222', res)
      let { meta: { status }, data } = res
      if (status === 200) {
        this.options2 = data
      }
    },
    handleSizeChange(v) {
      this.pageSize = v
      this.currentPage = 1
      this.getCateList()
    },
    handleCurrentChange(v) {
      this.currentPage = v
      this.getCateList()
    },
    showAddDialog() {
      this.AddDialogVisible = true
      this.getCateTwoList()
    },
    // 添加分类
    addCate() {
      this.$refs.form.validate(async (valid) => {
        if (!valid) return false
        let { catePid, cateName: catName } = this.addform
        let catPid = catePid[catePid.length - 1] || 0
        let catLevel = catePid.length
        let res = await this.axios.post('categories', {
          cat_pid: catPid,
          cat_name: catName,
          cat_level: catLevel
        })
        // console.log(res)
        if (res.meta.status === 201) {
          // this.$refs.form.resetFileds()
          this.$refs.form.resetFields()
          this.$message.success('恭喜你,添加分类成功')
          this.addform.catePid = []
          this.AddDialogVisible = false
          this.getCateList()
        }
      })
    },
    // 删除分类
    async delCate(row) {
      let { cat_id: id } = row
      let res = await this.axios.delete(`categories/${id}`)
      console.log(res)

      if (res.meta.status === 200) {
        try {
          await this.$confirm('此操作将永久删除该分类, 是否继续?', '温馨提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
          this.$message.success('成功删除该分类')
          this.getCateList()
        } catch (e) {
          this.$message.info('取消删除')
        }
      }
    }
  },

  created() {
    this.getCateList()
  }
}
</script>

<style>
</style>
