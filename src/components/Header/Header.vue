<template>
  <div>
    <v-app-bar
      color="#fff"
      elevate-on-scroll
    >
      <h1 class="d-flex align-center"><img class="boxIcon mr-2" src="assets/box-icon.svg">取ってきます〜</h1>
      <v-spacer></v-spacer>
      <LoginBtn />
    </v-app-bar>
  </div>
</template>

<script>
  import LoginBtn from './LoginBtn'

  export default {
    data: () => {
      return {

      }
    },
    components: {
      LoginBtn
    }
  }
</script>

<style lang="scss" scoped>
  h1 {
    .boxIcon {
      height: 45px;
    }
  }
</style>