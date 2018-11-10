<template>
  <div class="user">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/users' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/users' }">用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div style="margin-bottom: 10px;">
  <el-input placeholder="请输入内容" v-model="query" >
    <el-button slot="append" icon="el-icon-search" @click="keyWords"></el-button>
  </el-input>
   <el-button type="success" plain>添加用户</el-button>
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
            inactive-color="#ff4949">
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
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      query: '',
      currentPage: 1,
      pageSize: 2,
      total: 0,
      userList: []
    }
  },
  methods: {
    getUsersList() {
      axios({
        method: 'get',
        url: 'http://localhost:8888/api/private/v1/users',
        params: {
          query: this.query,
          pagenum: this.currentPage,
          pagesize: this.pageSize
        },
        headers: {
          Authorization: localStorage.getItem('token')
        }
      }).then((res) => {
        this.total = res.data.data.total
        this.currentPage = res.data.data.pagenum
        this.userList = res.data.data.users
      })
    },
    // 关键字搜素
    keyWords() {
      this.getUsersList()
    },
    handleEdit(index, row) {
      console.log(row)
    },
    // 删除一条用户
    handleDelete(id) {
      console.log(`http://localhost:8888/api/private/v1/users/${id}`)

      axios({
        url: `http://localhost:8888/api/private/v1/users/${id}`,
        method: 'delete',
        headers: {
          Authorization: localStorage.getItem('token')
        }
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
    }
  },
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
