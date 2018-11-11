<template>
<div class="login">
  <el-form ref="form" :model="form" label-width="80px" :rules="rules" status-icon>
    <img src="../assets/avatar.jpg" alt="">
  <el-form-item label="用户名" prop="username">
    <el-input v-model="form.username"></el-input>
  </el-form-item>
 <el-form-item label="密码" prop="password">
    <el-input v-model="form.password" type="password" @keyup.enter.native="submitForm('form')"></el-input>
  </el-form-item>
  <el-form-item>
    <el-button type="primary"  @click="submitForm('form')">登陆</el-button>
  <el-button>重置</el-button>
  </el-form-item>
</el-form>
</div>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      form: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'change' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'change' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'change' },
          {
            min: 6,
            max: 12,
            message: '长度在 6 到 12 个字符',
            trigger: 'change'
          }
        ]
      }
    }
  },

  methods: {
    submitForm(form) {
      this.$refs.form.validate((valid) => {
        if (valid) {
          axios({
            url: 'http://localhost:8888/api/private/v1/login',
            method: 'post',
            data: this.form
          }).then((res) => {
            // console.log(res.data.token)
            if (res.meta.status === 200) {
              localStorage.setItem('token', res.data.token)
              this.$message({
                message: '登陆成功',
                type: 'success'
              })
              this.$router.push('/home')
            } else {
              this.$message.error(res.meta.msg)
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login {
  overflow: hidden;
  height: 100%;
  background-color: #2d434c;

  .el-form {
    background-color: #fff;
    border-radius: 20px;
    width: 400px;
    // height: 200px;
    margin: 200px auto;
    padding: 80px 40px 20px;
    position: relative;
  }
  img {
    // width: 140px;
    // height: 140px;
    position: absolute;
    top: 0;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    border: 10px solid #fff;
  }
  .el-button:nth-child(2) {
    margin-left: 80px;
  }
}
</style>
