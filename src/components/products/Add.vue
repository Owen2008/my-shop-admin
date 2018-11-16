<template>
  <div class="goods-add">
   <el-steps :active="active">
  <el-step title="步骤 1" description="基本信息" ></el-step>
  <el-step title="步骤 2" description="商品图片" ></el-step>
  <el-step title="步骤 3" description="商品描述" ></el-step>
</el-steps>
  <el-tabs tab-position="left"  v-model="activeName" >
    <el-tab-pane label="基本信息" name="content">
      <el-form :model="addform" ref="form" label-width="80px" :rules="rules">
        <el-form-item label="商品名称" prop="goods_name">
           <el-input v-model="addform.goods_name"></el-input>
        </el-form-item>
        <el-form-item label="商品价格" prop="goods_price">
           <el-input v-model="addform.goods_price"></el-input>
        </el-form-item>
        <el-form-item label="商品重量" prop="goods_weight">
           <el-input v-model="addform.goods_weight"></el-input>
        </el-form-item>
        <el-form-item label="商品数量" prop="goods_number">
           <el-input v-model="addform.goods_number"></el-input>
        </el-form-item>
        <el-form-item label="商品分类" prop="goods_cat">
             <el-cascader
              :options="options"
              v-model="addform.goods_cat"
              :props="props"
              >
            </el-cascader>
        </el-form-item>
        <el-form-item label="是否促销">
           <template>
            <el-radio v-model="addform.is_promote" :label="true">是</el-radio>
            <el-radio v-model="addform.is_promote" :label="false">否</el-radio>
          </template>

        </el-form-item>
      </el-form>
      <el-button type="primary" @click="next(2,'pic')">下一步</el-button>
    </el-tab-pane>
    <el-tab-pane label="商品图片" name="pic">
      <el-upload
        action="http://localhost:8888/api/private/v1/upload"
        :on-success="handleSuccess"
        list-type="picture"
        :headers="header">
        <el-button size="small" type="primary">点击上传</el-button>
        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
      </el-upload>
      <el-button type="primary" @click="next(3,'desc')">下一步</el-button>
    </el-tab-pane>
    <el-tab-pane label="商品描述" name="desc">
        <quill-editor v-model="addform.goods_introduce"
                ref="myQuillEditor"
            >
       </quill-editor>
       <el-button type="primary" @click="addProduct">添加</el-button>
    </el-tab-pane>
  </el-tabs>
  </div>
</template>

<script>
export default {
  data() {
    return {
      addform: {
        goods_name: '',
        goods_cat: [],
        goods_price: '',
        goods_number: '',
        goods_weight: '',
        goods_introduce: '',
        pics: [],
        is_promote: false
      },
      options: [],
      rules: {
        goods_name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' }
        ],
        goods_cate: [
          { required: true, message: '请输入活动名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入活动名称', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入活动名称', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入活动名称', trigger: 'blur' }
        ]
      },
      active: 1,
      activeName: 'content',
      header: {
        Authorization: localStorage.getItem('token')
      },
      props: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      }
    }
  },
  methods: {
    next(active, activeName) {
      this.active = active
      this.activeName = activeName
    },
    handleSuccess(res, file, fileList) {
      // console.log(res.data.tmp_path)
      this.addform.pics.push({ pic: res.data.tmp_path })
    },
    // 查询3级的分类,不带分页,用于添加多选框的渲染
    async getCateTwoList() {
      let res = await this.axios.get(`categories`, {
        params: {
          type: 3
        }
      })
      // console.log('CateList222', res)
      let { meta: { status }, data } = res
      if (status === 200) {
        // console.log(data)
        this.options = data
      }
    },
    // 添加产品
    addProduct() {
      console.log(this.$refs.form)
      console.log(this.addform.goods_cat.join(','))
      this.$refs.form.validate(async (valid) => {
        if (!valid) return false
        let res = await this.axios.post('goods', {
          ...this.addform,
          goods_cat: this.addform.goods_cat.join(',')
        })
        if (res.meta.status === 201) {
          this.$router.push('/goods')
        }
      })
    }
  },
  created() {
    this.getCateTwoList()
  }
}
</script>

<style lang="less" scoped>
.quill-editor {
  background-color: #fff;
  /deep/ .ql-editor {
    height: 300px;
  }
}
</style>
