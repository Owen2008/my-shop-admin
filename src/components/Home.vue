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
          :default-active="path"
          class="el-menu-vertical-demo"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          unique-opened
          router>
          <el-submenu :index="menu.path" v-for="menu in menuList" :key="menu.id">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{menu.authName}}</span>
            </template>
             <el-menu-item :index="item.path" v-for="item in menu.children" :key="item.id"> <i class="el-icon-menu"></i>{{item.authName}}</el-menu-item>
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
  data() {
    return {
      menuList: [],
      path: ''
    }
  },
  methods: {
    async logout() {
      try {
        await this.$confirm('此操作将退出登陆, 是否继续?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })

        localStorage.removeItem('token')
        this.$router.push('/login')
        this.$message({
          type: 'success',
          message: '退出成功!'
        })
      } catch (e) {
        this.$message({
          type: 'info',
          message: '已取消退出'
        })
      }
    },
    async getMenuList() {
      let res = await this.axios.get(`menus`)
      // console.log(res)
      let { meta: { status }, data } = res
      if (status === 200) {
        this.menuList = data
      }
    }
  },
  created() {
    this.getMenuList()
    this.path = this.$route.path.slice(1)
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
    .el-submenu {
      width: 200px;
    }
  }
  .el-main {
    background-color: #d4dfe4;
  }
}
</style>
