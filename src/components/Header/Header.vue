<template>
  <div>
    <v-app-bar
      color="#fff"
      absolute
    >
      <router-link to="/" class="titleLink"><h1 class="d-flex align-center"><img class="boxIcon mr-2" src="assets/box-icon.svg">取ってきます〜</h1></router-link>
      <v-spacer></v-spacer>
      <LoginBtn />
    </v-app-bar>
    <v-alert
      dense
      :value='alert'
      color="#cc1f40"
      class="alrBox"
      transition="scale-transition"
    >
      {{ status.msg }}
    </v-alert>
  </div>
</template>

<script>
  import LoginBtn from './LoginBtn'
  import { mapState } from 'vuex'

  export default {
    data: () => {
      return {
        alert: false
      }
    },
    components: {
      LoginBtn
    },
    computed: {
      ...mapState('auth', ['user', 'status']),
    },
    watch: {
      status: {
        handler (){
          this.alert = true
          setTimeout(()=>{
            this.alert = false
          }, 2000)
        },
        deep: true
      }
    },
  }
</script>

<style lang="scss" scoped>
  .headerBar {
    z-index: 100 !important;
  }
  h1 {
    .boxIcon {
      height: 45px;
    }
  }
  .alrBox{
    color: #fff !important;
    width: 250px;
    position: absolute;
    left: calc(50% - 125px);
    top: 40px;
    text-align: center;
    z-index: 1000 !important;
  }
  .titleLink {
    color: #000;
    text-decoration: none;
    font-size: 15px;
  }
</style>