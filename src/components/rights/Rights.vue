<template>
  <div class="right">
   <el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item to="/rights">权限管理</el-breadcrumb-item>
  <el-breadcrumb-item>权限列表</el-breadcrumb-item>
</el-breadcrumb>
<el-table :data="rightList" style="width:100%">
  <el-table-column type="index"></el-table-column>
  <el-table-column prop="authName" label="日期" >
  </el-table-column>
    <el-table-column prop="path" label="路径" >
  </el-table-column>
    <el-table-column prop="level" label="层级" >
     <template slot-scope="scope">
       <span v-if="scope.row.level==='0'">一级</span>
       <span v-else-if="scope.row.level==='1'">二级</span>
       <span v-else>三级</span>
     </template>
  </el-table-column>
</el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rightList: []
    }
  },
  methods: {
    async getRightList() {
      let res = await this.axios.get(`rights/list`)
      // console.log(res)
      let { meta: { status }, data } = res
      if (status === 200) {
        this.rightList = data
      }
    }
  },
  created() {
    this.getRightList()
  }
}
</script>

<style>
</style>
