<template>
  <van-nav-bar
    :title="title"
    left-text="back"
    left-arrow
    :fixed="true"
    @click-left="onClickLeft">
    <template #right>
      <van-icon name="notes-o" size="22" style="margin-right:10px" @click="onClickRight"/>
    </template>
  </van-nav-bar>
</template>

<script>
import service from "@/service";
export default {
  name: "NavBar",
  props: {
    title: String,
  },
  methods: {
    onClickLeft() {
      this.$emit('back',{});
    },
    onClickRight() {
      this.$router.push({
          name: "List"
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.van-nav-bar__arrow {
    font-size: 22px;
}
</style>
