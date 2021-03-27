<template>
  <div>
    <navbar @back="$root.goBack()" 
            title="工资单"></navbar>
    <div class="home">
      <van-pull-refresh 
        v-model="refreshing" 
        @refresh="onRefresh"
        loosing-text="释放刷新..."
        pulling-text="下拉刷新..."
        loading-text="loading...">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="No more"
        @load="onLoad"
      >
        <van-swipe-cell v-for="item in list" :key="item.id">
          <van-cell-group class="biearn-cell">
            <van-field label="客户ID" :value="item.clientId" readonly />
          </van-cell-group>
          <template #right>
            <van-button square text="编辑" type="info" @click="editRow(item)" style="width: 60px;height: 100%;" />
            <van-button square text="删除" type="danger" @click="deleteRow(item.id)"  style="width: 60px;height: 100%;" />
          </template>
        </van-swipe-cell>
      </van-list>
      </van-pull-refresh>
    </div>
    <van-pagination v-model="ruleForm.pageNo" :total-items="total" :items-per-page="ruleForm.pageSize"	mode="simple" 
      @change="changePage"
      style="width: 100%;position: fixed;bottom: 0;background: #ffffff;"/>
  </div>
</template>

<script>
import service from "@/service";
import navbar from "@/components/NavBar";

export default {
  name: "Home",
  data() {
    return {
      refreshing: false,
      loading: false,
      finished: false,
      rawData: {},
      list: [],
      total: 0,
      ruleForm: {
        userId:'',
        startDate: "",
        endDate: "",
        payslip: '',
        pageNo: 1,
        pageSize: 10,
      }
    };
  },
  components: {
    navbar,
  },
  mounted() {
    this.ruleForm.userId = this.$route.query.userId
    this.ruleForm.startDate = this.$route.query.startDate
    this.ruleForm.endDate = this.$route.query.endDate
    this.onLoad()
  },
  methods: {
    onRefresh() {
      this.finished = false;
      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      this.loading = true;
      this.onLoad();
    },
    onLoad(){
      service.getPayslip(this.ruleForm).then((resp) => {
        this.list = resp.resultList
        this.total = resp.totalSize
        // 加载状态结束
        this.loading = false;
        // 数据全部加载完成
        this.finished = true;
      }).catch(() => {
        // 加载状态结束
        this.loading = false;
        // 数据全部加载完成
        this.finished = true;
        this.$toast.fail("Response error");
      });
    },
    changePage(val){
      this.ruleForm.pageNo = val
      this.onLoad()
    },
    deleteRow(id){
      this.$dialog.confirm({
        title: 'Delete Data',
        message: 'Confirm Delete?',
      })
        .then(() => {
          // on confirm
          this.$toast.loading({
            message: '加载中...',
            forbidClick: true,
          });
          service.deleteData(id).then((resp) => {
            this.$toast.clear();
            this.ruleForm.pageNo = 1
            this.onLoad()
            this.$toast.success('删除成功');
          }).catch((err) => {
            this.$toast.clear();
            this.$toast.fail("Response error");
          });
        })
        .catch(() => {
          // on cancel
          this.$toast.fail("取消删除");
        });
    },
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
