<template>
 <el-container class="home">
  <el-header>
    <div class="logo">1</div>
  
    <div class="logout">
      欢迎光临
      <a href="Javascript:">退出</a>
    </div>
      <h1 class="title">
        电商后台管理系统
      </h1>
  </el-header>
  <el-container>
    <el-aside width="200px">Aside</el-aside>
    <el-main>Main</el-main>
  </el-container>
</el-container>
</template>

<script>
export default {}
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
