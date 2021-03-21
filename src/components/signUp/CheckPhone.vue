<template>
  <div class="info-form">
    <Form ref="formValidate" :model="formValidate" :label-width="80" :rules="ruleValidate">
      <FormItem label="手机号" prop="phone">
          <i-input v-model="formValidate.phone" clearable size="large"  placeholder="请输入手机号"></i-input>
      </FormItem>
      <FormItem label="验证码" prop="checkNum">
          <i-input v-model="formValidate.checkNum" size="large"  placeholder="请输入验证码">
            <Button slot="append" @click="getcheckNum">获取验证码</Button>
          </i-input>
      </FormItem>
      <Button type="error" size="large" long @click="handleSubmit('formValidate')">验证手机号</Button>
    </Form>
  </div>
</template>

<script>
import store from '@/vuex/store';
import { mapMutations } from 'vuex';
export default {
  name: 'CheckPhone',
  data () {
    return {
      formValidate: {
        phone: '',
        checkNum: ''
      },
      ruleValidate: {
        phone: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          { type: 'string', pattern: /^1[3|4|5|7|8][0-9]{9}$/, message: '手机号格式出错', trigger: 'blur' }
        ],
        checkNum: [
          { required: true, message: '必须填写验证码', trigger: 'blur' },
          { type: 'string', min: 2, max: 6, message: '验证码长度错误', trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    ...mapMutations(['SET_SIGN_UP_SETP']),
    getcheckNum () {
      if (this.formValidate.phone.length === 11) {
        this.$ajax.post("http://localhost:20001/feigon/user/yanzeng",this.$qs.stringify(this.formValidate)).then(res=>{
          if(res.data.data.mage==2){
            this.$Message.success({
              content: '验证码已发送',
              duration: 6,
              closable: true
            });
          }
          if(res.data.data.mage==1){
            this.$Message.error({
              content: '验证码发送失败,手机号格式不对',
              duration: 6,
              closable: true
            });
          }
          if(res.data.data.mage==3){
            this.$Message.error({
              content: '手机号已使用',
              duration: 6,
              closable: true
            });
          }
          if(res.data.data.mage==4){
            this.$Message.error({
              content: '请勿频繁发送',
              duration: 6,
              closable: true
            });
          }
        })
      } else {
        this.$Message.error({
          content: '请输入正确的手机号',
          duration: 6,
          closable: true
        });
      }
    },
    handleSubmit (name) { // 提交验证
      this.$refs[name].validate((valid) => {
        if (valid) {

          this.$ajax.post("http://localhost:20001/feigon/user/jiaoyan",this.$qs.stringify(this.formValidate)).then(res=>{
            if(res.data.code===200){
              this.$Message.success({
                content: '验证通过',
                duration: 6,
                closable: true
              });
            this.$router.push({ path: '/SignUp/inputInfo', query: { phone: this.formValidate.phone } });
          this.SET_SIGN_UP_SETP(1);
          }else{
              this.$Message.error({
                content: '验证码错误或失效',
                duration: 6,
                closable: true
              });
            }
          })
        } else {
          this.$Message.error({
            content: '请填写正确的信息',
            duration: 6,
            closable: true
          });
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
