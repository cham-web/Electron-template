<template>
  <div class="login">
    <div class="fixed-nav"></div>
    <div class="login-form">
      <h1>美容院管理系统</h1>
      <el-form :model="dataForm" :rules="rules" ref="dataForm" class="demo-dataForm">
        <el-form-item class="custom-el-form-item" prop="loginNo">
          <span>
            <img src="@/assets/imgs/icon-user.png" alt="">
          </span>
          <el-input placeholder="请输入用户" v-model="dataForm.loginNo"></el-input>
        </el-form-item>
        <el-form-item class="custom-el-form-item" prop="password">
          <span>
            <img src="@/assets/imgs/icon-password.png" alt="">
          </span>
          <el-input type="password" placeholder="请输入密码" v-model="dataForm.password"></el-input>
        </el-form-item>
      </el-form>
      <el-button class="btn" @click="login('dataForm')">立即登录</el-button>
    </div>
  </div>
</template>
<script>
// import md5 from 'md5'
// import { login } from '@/api/base'
export default {
  // 组件名称
  name: 'Login',
  // 过滤器
  filters: {
  },
  // 组件
  components: {
  },
  // props类型
  props: {
  },
  // 数据
  data () {
    return {
      dataForm: {
        loginNo: null,
        password: null
      },
      rules: {
        loginNo: [
          { required: true, message: '请输入登录账号', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '长度最少6个字符', trigger: 'blur' }
        ]
      },
      port: null
    }
  },
  // 计算属性
  computed: {
  },
  // 计算属性监听
  watch: {
  },
  // 创建时
  created () {

  },
  // 挂载完毕
  mounted () {

  },
  // 方法
  methods: {
    submitForm (formName) {

    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    login (formName) {
      this.$router.push('/')
      // this.$refs[formName].validate((valid) => {
      //   if (valid) {
      //     login({ ...this.dataForm, password: md5(this.dataForm.password) }).then(res => {
      //       this.$store.dispatch('setUserInfo', res)
      //       this.$store.dispatch('setToken', res.ticket)
      //       this.$router.push(this.$store.getters.permission_routes[0].path)
      //     })
      //   } else {
      //     console.log('error submit!!')
      //     return false
      //   }
      // })
    }
  }
}
</script>

<style lang='less' scoped>
.login{
  ::v-deep{
    .el-form-item__content{
      .flex-mixins();
      border: solid 1px #dddddd;
      padding: 1.1vh;
      box-sizing: border-box;
      border-radius: 5px;
      font-size: 20px;
      input{
        border: none;
        font-size: 20px;
      }
    }
  }
  width: 100%;
  min-height: 100vh;
  background: url('~@/assets/imgs/login-bg.png') no-repeat center/ 100% 100%;
  box-sizing: border-box;
  padding-top: 15vh;
  .fixed-nav{
    width: 100%;
    height: 6.8vh;
    position: fixed;
    top: 0;
    -webkit-app-region: drag;
  }
  &-form{
    width: 25%;
    margin-left: 60%;
    margin-top: 11.4vh;
    h1{
      font-weight: normal;
      text-align: center;
      color: #37C082;
      margin-bottom: 8.8vh;
    }
  }
}
.custom-el-form-item{
  margin-bottom: 3.1vh;
  span{
    img{
      width: 24px;
    }
  }
}
.btn{
  -webkit-app-region: no-drag;
  height: 6.7vh;
  width: 100%;
  font-size: 24px;
  color: white;
  background: linear-gradient(to bottom, #4AE6A0, #1A9F63);
  border: none;
}
</style>
