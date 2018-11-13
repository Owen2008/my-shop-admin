<template>
  <div class="user">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/users' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/users' }">用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div style="margin-bottom: 10px;">
  <el-input placeholder="请输入内容" v-model="query" @keyup.enter.native="keyWords">
    <el-button slot="append" icon="el-icon-search" @click="keyWords"></el-button>
  </el-input>
   <el-button type="success" plain @click="showAddDialog">添加用户</el-button>
</div>
    <el-table :data="userList">
    <el-table-column property="username" label="姓名" width="150"></el-table-column>
    <el-table-column property="email" label="邮箱" width="150"></el-table-column>
    <el-table-column property="mobile" label="电话" width="150"></el-table-column>
    <el-table-column property="1" label="用户状态" width="150">
      <template slot-scope="scope">
          <el-switch
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949" @change="changeStatus(scope.row)">
          </el-switch>
      </template>
    </el-table-column>
    <el-table-column property="2" label="操作">
      <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini"
          @click="handleEdit(scope.$index, scope.row)" plain></el-button>
        <el-button type="danger" icon="el-icon-delete" size="mini" plain
         @click="handleDelete(scope.row.id)"></el-button>
          <el-button type="success" icon="el-icon-check" plain
            @click="handleAssign()">分配角色</el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[2,4,6,8]"
      :page-size="2"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      background>
    </el-pagination>
<!--对话框,添加用户 -->
 <el-dialog
    title="添加用户"
    :visible.sync="addDialogVisible"
    width="40%"
    >
    <el-form ref="form" :model="addForm" :rules="rules" label-width="80px" status-icon>
      <el-form-item label="用户名" prop="username">
        <el-input v-model="addForm.username"></el-input>
      </el-form-item>
       <el-form-item label="密码" prop="password">
        <el-input v-model="addForm.password"></el-input>
      </el-form-item>
       <el-form-item label="邮箱" prop="email">
        <el-input v-model="addForm.email"></el-input>
      </el-form-item>
       <el-form-item label="电话" prop="mobile">
        <el-input v-model="addForm.mobile"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="addDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="addUser">确 定</el-button>
    </span>
  </el-dialog>
  <!-- 编辑对话框 -->
   <el-dialog
    title="编辑用户"
    :visible.sync="editDialogVisible"
    width="40%"
    >
    <el-form ref="editForm" :model="editForm" :rules="rules" label-width="80px" status-icon>
      <el-form-item label="用户名" >
        <el-tag type="info">{{editForm.username}}</el-tag>
      </el-form-item>
       <el-form-item label="邮箱" prop="email">
        <el-input v-model="editForm.email"></el-input>
      </el-form-item>
       <el-form-item label="电话" prop="mobile">
        <el-input v-model="editForm.mobile"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="editDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="editUser">确 定</el-button>
    </span>
  </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      query: '',
      currentPage: 1,
      pageSize: 2,
      total: 0,
      userList: [],
      addDialogVisible: false,
      editDialogVisible: false,
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      editForm: {
        id: '',
        username: '',
        email: '',
        mobile: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 6, message: '长度在 3 到 6个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
        ],
        email: [{ type: 'email', message: '请输入正确格式的邮箱地址' }],
        mobile: [{ pattern: /^1\d{10}$/, message: ' 请输入正确的手机号码' }]
      }
    }
  },
  methods: {
    // 获取用户列表数据
    async getUsersList() {
      let res = await this.axios({
        method: 'get',
        url: 'users',
        params: {
          query: this.query,
          pagenum: this.currentPage,
          pagesize: this.pageSize
        }
      })
      // console.log(22, res.data.total)
      this.total = res.data.total
      this.currentPage = res.data.pagenum
      this.userList = res.data.users
    },
    // 关键字搜素
    keyWords() {
      this.getUsersList()
    },
    async changeStatus({ id, mg_state: myState }) {
      // console.log(id, myState)
      let res = await this.axios({
        url: `users/${id}/state/${myState}`,
        method: 'put'
      })
      let { meta: { status } } = res

      if (status === 200) {
        this.$message.success('状态修改成功')
      } else {
        this.$message.error('状态修改失败')
      }
    },
    // 编辑用户信息,数据回写---不用ajax,用的是作用域插槽
    handleEdit(index, row) {
      this.editDialogVisible = true
      this.editForm.username = row.username
      // this.editForm.password = row.password
      this.editForm.email = row.email
      this.editForm.mobile = row.mobile
      this.editForm.id = row.id
      // console.log(row)
    },
    // 删除一条用户
    handleDelete(id) {
      this.axios({
        url: `users/${id}`,
        method: 'delete'
      }).then((res) => {
        if (this.userList.length === 1 && this.currentPage > 1) {
          this.currentPage--
        }
        this.getUsersList()
        this.$message('删除成功了')
      })
    },
    // 改变每页条数
    handleSizeChange(val) {
      this.currentPage = 1
      this.pageSize = val
      this.getUsersList()
    },
    // 点击页码,改变当前页
    handleCurrentChange(val) {
      this.currentPage = val
      this.getUsersList()
    },
    showAddDialog() {
      this.addDialogVisible = true
    },
    // 添加用户
    addUser() {
      this.$refs.form.validate((valid) => {
        // console.log(11, this.$refs)
        if (valid) {
          this.axios({
            method: 'post',
            url: 'users',
            data: this.addForm
          }).then(({ meta: { status }, data }) => {
            if (status === 201) {
              this.$message.success('添加成功')
              this.$refs.form.resetFields()
              this.addDialogVisible = false
              // 页面刷新在最后一页
              this.total++
              this.currentPage = Math.ceil(this.total / this.pageSize)
              this.getUsersList()
            }
          })
        } else {
          this.$message('添加用户失败')
          return false
        }
      })
    },
    editUser(id) {
      console.log(1, id)
      this.axios({
        method: 'put',
        url: `users/${this.editForm.id}`,
        data: this.editForm
        // data: {
        //   email: this.editForm.email,
        //   mobile: this.editForm.mobile
        // }
      }).then(({ meta: { status } }) => {
        if (status === 200) {
          this.$message.success('修改成功')
          this.$refs.editForm.resetFields()
          this.editDialogVisible = false
          this.getUsersList()
        }
      })
    }
  },
  // 钩子函数 生成用户列表
  created() {
    this.getUsersList()
  }
}
</script>

<style lang="less" scroped>
.el-breadcrumb {
  height: 30px;
  line-height: 30px;
}
.el-input {
  width: 300px;
}
</style>
