<template>
  <div>
    <div class="address-box" v-for="(item, index) in arrdata" :key="index">
      <div class="address-header">
        <span>{{item.name}}</span>
        <div class="address-action">
          <span @click="edit(index)"><Icon type="edit"></Icon> 修改</span>
          <span @click="del(item.id)"><Icon type="trash-a"></Icon> 删除</span>
        </div>
      </div>
      <div class="address-content">
        <p><span class="address-content-title"> 收 货 人 :</span> {{item.name}}</p>
        <p><span class="address-content-title">收货地区:</span> {{item.province}} {{item.city}} {{item.area}}</p>
        <p><span class="address-content-title">收货地址:</span> {{item.address}}</p>
        <p><span class="address-content-title">邮政编码:</span> {{item.postalcode}}</p>
      </div>
    </div>
    <Modal v-model="modal" width="530">
        <p slot="header">
          <Icon type="edit"></Icon>
          <span>修改地址</span>
        </p>
        <div>
            <Form :model="formData" label-position="left" :label-width="100" :rules="ruleInline">
              <FormItem label="收件人" prop="name">
                <i-input v-model="formData.name" size="large"></i-input>
              </FormItem>
              <FormItem label="收件地区" prop="address">
                <Distpicker :province="formData.province" :city="formData.city" :area="formData.area" @province="getProvince" @city="getCity" @area="getArea"></Distpicker>
              </FormItem>
              <FormItem label="收件地址" prop="address">
                <i-input v-model="formData.address" size="large"></i-input>
              </FormItem>
              <FormItem label="手机号码" prop="phone">
                <i-input v-model="formData.phone" size="large"></i-input>
              </FormItem>
              <FormItem label="邮政编码" prop="postalcode">
                <i-input v-model="formData.postalcode" size="large"></i-input>
              </FormItem>
            </Form>
        </div>
        <div slot="footer">
            <Button type="primary" size="large" long @click="editAction">修改</Button>
        </div>
    </Modal>
  </div>
</template>

<script>
import store from '@/vuex/store';
import { mapState, mapActions } from 'vuex';
import Distpicker from 'v-distpicker';
export default {
  name: 'MyAddress',
  data () {
    return {
      modal: false,
      formData: {
        id:'',
        name: '',
        address: '',
        phone: '',
        postalcode: '',
        province: '广东省',
        city: '广州市',
        area: '天河区'
      },
      arrdata:[],
      ruleInline: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请输入地址', trigger: 'blur' }
        ],
        postalcode: [
          { required: true, message: '请输入邮政编码', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          { type: 'string', pattern: /^1[3|4|5|7|8][0-9]{9}$/, message: '手机号格式出错', trigger: 'blur' }
        ]
      }
    };
  },
  created () {
    this.loadAddress();
  },
  computed: {
    ...mapState(['address'])
  },
  methods: {
    ...mapActions(['loadAddress']),
    getProvince (data) {
      this.formData.province = data.value;
    },
    getCity (data) {
      this.formData.city = data.value;
    },
    getArea (data) {
      this.formData.area = data.value;
    },
    edit (index) {
      this.modal = true;
      this.formData.province = this.arrdata[index].province;
      this.formData.city = this.arrdata[index].city;
      this.formData.area = this.arrdata[index].area;
      this.formData.address = this.arrdata[index].address;
      this.formData.name = this.arrdata[index].name;
      this.formData.phone = this.arrdata[index].phone;
      this.formData.postalcode = this.arrdata[index].postalcode;
      this.formData.id = this.arrdata[index].id;
      console.log(this.formData);
    },
    editAction () {
      this.$ajax.post("http://localhost:20001/feigon/addres/updateaddres",this.$qs.stringify(this.formData)).then(res=>{
        console.log(res);
        if(res.data.code==200){
          this.modal = false;
          this.$Message.success('修改成功');
          this.getqueryAll();
        }
      })

    },
    del (index) {
      console.log(index);
      this.$Modal.confirm({
        title: '信息提醒',
        content: '你确定删除这个收货地址',
        onOk: () => {
      this.$ajax.post("http://localhost:20001/feigon/addres/delAddresById?id="+index).then(res=>{
        if(res.data.data.code==200){
          this.$Message.success('删除成功');
          this.getqueryAll();
      }
          })
        },
        onCancel: () => {
          this.$Message.info('取消删除');
        }
      });
    },
    getqueryAll(){
      let user=sessionStorage.getItem('loginInfo');
      let userid=JSON.parse(user).username;
      this.$ajax.post("http://localhost:20001/feigon/addres/queryByUserId?userid="+userid).then(res=>{

        if(res.data.data.code==200){
          this.arrdata=res.data.data.data;
        }
      })
    }
  },

  created(){
   this.getqueryAll();
  },
  components: {
    Distpicker
  },
  store
};
</script>

<style scoped>
.address-box {
  padding: 15px;
  margin: 15px;
  border-radius: 5px;
  box-shadow: 0px 0px 5px #ccc;
}
.address-header {
  height: 35px;
  display: flex;
  justify-content: space-between;
  color: #232323;
  font-size: 18px;
}
.address-content {
  font-size: 14px;
}
.address-content-title {
  color: #999;
}
.address-action span{
  margin-left: 15px;
  font-size: 14px;
  color: #2d8cf0;
  cursor: pointer;
}
</style>
