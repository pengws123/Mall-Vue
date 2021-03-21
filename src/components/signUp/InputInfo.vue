<template>
  <div class="info-form">
     <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80" >
        <FormItem label="用户名" prop="username">
            <i-input v-model="formValidate.username" clearable size="large" placeholder="请输入你的姓名"></i-input>
        </FormItem>
        <FormItem label="邮箱" prop="email">
            <i-input v-model="formValidate.email" clearable size="large" placeholder="请输入你的邮箱"></i-input>
        </FormItem>
        <FormItem label="密码" prop="password">
            <i-input type="password" v-model="formValidate.password" clearable size="large" placeholder="请输入你的密码"></i-input>
        </FormItem>
        <FormItem label="确认密码" prop="repassword">
            <i-input type="password" v-model="formValidate.repassword" clearable size="large" placeholder="请再次输入你的密码"></i-input>
        </FormItem>
        <Button type="error" size="large" long @click="handleSubmit('formValidate')">注册</Button>
    </Form>
  </div>
</template>

<script>
import store from '@/vuex/store';
import { mapMutations, mapActions } from 'vuex';
export default {
  name: 'InputInfo',
  data () {
    const validatePassCheck = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.formValidate.password) {
        callback(new Error('两次输入的密码不一样'));
      } else {
        callback();
      }
    };
    return {
      formValidate: {
        username: '',
        email: '',
        password: '',
        repassword: ''
      },
      ruleValidate: {
        username: [
          { required: true, message: '用户名不能为空', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '邮箱不能为空', trigger: 'blur' },
          { type: 'email', message: '邮箱格式错误', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { type: 'string', min: 6, message: '密码长度不能小于6', trigger: 'blur' }
        ],
        repassword: [
          { validator: validatePassCheck, trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    ...mapMutations(['SET_SIGN_UP_SETP']),
    ...mapActions(['addSignUpUser']),
    handleSubmit (username) {
      const father = this;
      this.$refs[username].validate((valid) => {
        if (valid) {
          const userinfo = {
            username: this.formValidate.username,
            password: this.formValidate.password,
            email: this.formValidate.email,
            phone: this.$route.query.phone
          };
          const userinf = {
            'name': this.formValidate.username,
            password: this.formValidate.password,
            email: this.formValidate.email,
            phone: this.$route.query.phone
          };
          this.addSignUpUser(userinfo);
          this.$ajax.post("http://localhost:20001/feigon/user/insertuser",this.$qs.stringify(userinf)).then(res=>{
            if(res.data.data.data.mage==1) {
              this.$Message.success('注册成功');
              father.SET_SIGN_UP_SETP(2);

              this.$router.push({ path: '/SignUp/signUpDone' });
            }
            if(res.data.data.data.mage==2) {
              this.$Message.error('用户已存在');
            }
          })
        } else {
          this.$Message.error('注册失败');
        }
      });
    }
  },
  store
};
</script>

<style scoped>
.info-form {
  width: 90% !important;
}
</style>
