<template>
 <el-container class="home">
  <el-header>
    <div class="logo"></div>
    <div class="logout">
      欢迎光临
      <a href="Javascript:" @click="logout">退出</a>
    </div>
      <h1 class="title">
        电商后台管理系统
      </h1>
  </el-header>
  <el-container>
    <el-aside width="200px">
          <el-menu
          default-active="1-1"
          class="el-menu-vertical-demo"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          unique-opened
          router>
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>用户管理</span>
            </template>
             <el-menu-item index="/users"> <i class="el-icon-menu"></i>用户列表</el-menu-item>
          </el-submenu>
              <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>权限管理</span>
            </template>
              <el-menu-item index="2-1">角色列表</el-menu-item>
              <el-menu-item index="2-2">权限列表</el-menu-item>
          </el-submenu>
          </el-menu>
        </el-aside>
      <el-main>
        <router-view/>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  methods: {
    logout() {
      this.$confirm('此操作将退出登陆, 是否继续?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          localStorage.removeItem('token')
          this.$router.push('/login')
          this.$message({
            type: 'success',
            message: '退出成功!'
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消退出'
          })
        })
    }
  }
}
</script>

<style lang="less" scoped>
.home {
  height: 100%;
  .el-header {
    height: 60px;
    background-color: #b3c1cd;
    .logo {
      height: 60px;
      float: left;
      width: 180px;
      background-image: url('../assets/logo.png');
      background-size: contain;
      background-origin: content-box;
      background-repeat: no-repeat;
    }
    .logout {
      font-weight: 700;
      height: 60px;
      float: right;
      line-height: 60px;
      a {
        color: orange;
      }
    }
    .title {
      padding: 0;
      margin: 0;
      height: 60px;
      line-height: 60px;
      overflow: hidden;
      text-align: center;
      font-size: 28px;
      color: #fff;
    }
  }
  .el-aside {
    background-color: #545c64;
  }
  .el-main {
    background-color: #d4dfe4;
  }
}
</style>
