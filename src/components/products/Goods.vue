<template>
  <div class="goods">
    <el-button type="success" plain>添加商品</el-button>
<el-table :data="goodsList" style="width:100%">
  <el-table-column type="index"></el-table-column>
  <el-table-column prop="goods_name" label="商品名称" >
  </el-table-column>
    <el-table-column prop="goods_price" label="商品价格" >
  </el-table-column>
    <el-table-column prop="goods_weight" label="商品重量" >
  </el-table-column>
     <el-table-column prop="add_time" label="创建时间" >
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
      goodsList: [],
      currentPage: 1,
      pageSize: 10,
      total: 0
    }
  },
  methods: {
    async getGoodsList() {
      let res = await this.axios.get(`goods`, {
        params: {
          pagenum: this.currentPage,
          pagesize: this.pageSize
        }
      })
      // console.log(res)
      let { meta: { status }, data: { goods, total, pagenum } } = res
      console.log(res)
      if (status === 200) {
        this.goodsList = goods
        this.currentPage = parseInt(pagenum) // 字符串转数字
        this.total = total
      }
      console.log(233, this.currentPage)
    },
    handleSizeChange(value) {
      this.pageSize = value
      this.getGoodsList()
    },
    handleCurrentChange(value) {
      this.currentPage = value
      this.getGoodsList()
    }
  },
  created() {
    this.getGoodsList()
    // console.log(333, this.currentPage, this.pageSize)
  }
}
</script>

<style>
</style>
