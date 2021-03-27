<template>
  <div>
    <navbar @back="$root.goBack()" 
            title="工资管理"></navbar>
    <div class="home">
      <van-form @submit="onSubmit">
        <van-field
          readonly
          clickable
          name="userName"
          :value="userName"
          label="员工"
          @click="showUserPicker = true"
          :rules="[{ required: true, message: '请选择员工' }]"
        />
        <van-popup v-model="showUserPicker" position="bottom">
          <van-picker
            title="员工"
            show-toolbar
            :columns="userOptions"
            :loading="userLoading"
            @confirm="onConfirmUser"
            @cancel="showUserPicker = false"
          />
        </van-popup>
        <van-field
          readonly
          clickable
          name="calendar"
          :value="date"
          label="时间"
          placeholder="点击选择日期"
          @click="showDate = true"
        />
        <van-calendar v-model="showDate" type="range" @confirm="onConfirmDate" />

        <div style="margin: 16px;">
          <van-button round block type="info" native-type="submit" :loading="submitLoading">提交</van-button>
        </div>
        <div style="margin: 16px;">
          <van-button round block type="info" :loading="checkLoading" @click="getPayslipDetail">查看工资单</van-button>
        </div>
      </van-form>
      <van-popup v-model="showPayslip" 
                round 
                closeable
                :style="{ width: '90%',height: '80%' }">
        <van-form>
          <van-field
            v-model="username"
            name="用户名"
            label="用户名"
          />
          <van-field
            v-model="password"
            type="password"
            name="密码"
            label="密码"
          />
        </van-form>
      </van-popup>
    </div>
  </div>
</template>

<script>
import service from "@/service";
import navbar from "@/components/NavBar";

export default {
  name: "Home",
  data() {
    return {
      userName:'',
      userOptions:[],
      userIdOptions:[],
      showUserPicker: false,
      userLoading: true,

      date: '',
      showDate: false,
      ruleForm:{
        userId:'',
        startDate: "",
        endDate: "",
        payslip: '',
        pageNo: '',
        pageSize: '',
      },
      submitLoading: false,
      checkLoading: false,
      showPayslip: false,
    };
  },
  components: {
    navbar,
  },
  mounted() {
    this.getLastMonth()
    this.getUserList()
  },
  methods: {
    onConfirmUser(value, index){
      this.userName = value
      this.ruleForm.userId = this.userIdOptions[index]
      this.showUserPicker = false;
    },
    onConfirmDate(date) {
      const [start, end] = date;
      this.showDate = false;
      this.date = `${this.formatDate(start)} 至 ${this.formatDate(end)}`;
    },
    getUserList(){
      this.userLoading = true
      service.getUserList().then((resp) => {
        this.userLoading = false
        for(let key in resp){
          this.userOptions.push(resp[key].username)
          this.userIdOptions.push(resp[key].id)
        }
      }).catch(() => {
        this.$toast.fail("Response error");
        this.userLoading = false
      });
    },
    onSubmit(){
      this.ruleForm.startDate = this.date.split('至')[0].trim()
      this.ruleForm.endDate = this.date.split('至')[1].trim()
      if(this.ruleForm.userId===''){
        return
      }
      this.submitLoading = true
      service.submitPayslip(this.ruleForm).then((resp) => {
        this.submitLoading = false
        if(resp.id){
          this.$toast.success('提交成功');
        }
      }).catch((err) => {
        this.submitLoading = false;
        this.$toast.fail("Response error");
      });
    },
    getPayslipDetail(){
      if(this.ruleForm.userId===''){
        return
      }
      this.checkLoading = true
      service.getPayslip(this.ruleForm).then((resp) => {
        this.checkLoading = false
      }).catch(() => {
        this.$toast.fail("Response error");
        this.checkLoading = false
      });
    },
    getLastMonth(){
      let start = this.$moment().month(this.$moment().month() - 1).startOf('month').format('YYYY-MM-DD')
      let end = this.$moment().month(this.$moment().month() - 1).endOf('month').format('YYYY-MM-DD')
      this.date = `${start} 至 ${end}`;
    },
    formatDate(date) {
      return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    }
  },
};
</script>

<style lang="scss" scoped>
.home {
  // padding: 20px;
  position: relative;
  top: 50px;
}
.biearn-cell{
  margin: 5px 0;
}
</style>
