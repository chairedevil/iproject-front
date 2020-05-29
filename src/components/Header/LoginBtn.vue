<template>
  <div>
    <v-menu
      v-model="loginDialog"
      v-if="!status.isLoggedIn"
      offset-y
      :close-on-content-click="false"
      nudge-bottom="8"
    >
      <template v-slot:activator="{ on }">
        <v-btn class="loginBtn" color="#000" text large v-on="on">
          <v-progress-circular
            class="loadingCircle"
            indeterminate
            color="red"
            size="25"
            width="3"
            v-if="isLoginLoding"
          ></v-progress-circular>
          <div v-else>
            ログイン
            <v-avatar size="30" class="ml-2">
              <v-icon large color="#000" dark>mdi-account-circle</v-icon>
            </v-avatar>
          </div>
        </v-btn>
      </template>
      <v-sheet width="300">
        <v-form>
          <v-card-text>
            <v-text-field
              v-model="email"
              label="メール"
            ></v-text-field>
            <v-text-field
            v-model="pwd"
              label="パスワード"
              type="password"
            ></v-text-field>
            <v-btn
              class="innerLoginBtn"
              outlined
              width="100%"
              v-on:click="handleLogin"
            >
              ログイン
            </v-btn>
          </v-card-text>
        </v-form>
      </v-sheet>
    </v-menu>

    <v-menu
      v-if="status.isLoggedIn"
      offset-y
      :close-on-content-click="false"
      nudge-bottom="8"
    >
      <template v-slot:activator="{ on }">
        <v-btn class="loginBtn" text large v-on="on">
          {{ user.userInfo.name }}
          <v-avatar size="30" class="ml-2">
            <img
              v-bind:src="avatarUrl"
              v-bind:alt="user.userInfo.name"
            >
          </v-avatar>
        </v-btn>
      </template>
      <v-list>
        <v-list-item
          @click="handleProductRegis"
        >
          商品登録
        </v-list-item>
        <v-list-item
          @click="handleMyList"
        >
          マイリスト
        </v-list-item>
        <v-list-item
          @click="handleInbox"
        >
          メッセージ
        </v-list-item>
        <v-list-item
          @click="handleLogout"
        >
          ログアウト
        </v-list-item>
      </v-list>
    </v-menu>

  </div>
</template>

<script>
import { mapState } from 'vuex'
import config from '../../config'

export default {
  data: () => {
    return {
      loginDialog: false,
      email: "user01@mail.com",
      pwd: "123456",
      isLoginLoding: false
    }
  },
  computed: {
    ...mapState('auth', ['user', 'status']),
    avatarUrl: function () {
      return config.API_SERVER + '../images/avatar/' + this.user.userInfo.ava_path
    },
  },
  watch: {
    status: {
      handler (val){
        if(val.isLoggedIn === true){
          this.isLoginLoding = false
        }
      },
      deep: true
    }
  },
  methods: {
    handleLogin () {
      this.isLoginLoding = true
      this.loginDialog = false
      this.$store.dispatch('auth/login', {email: this.email, pwd: this.pwd})
    },
    handleLogout () {
      console.log('Menu->Logout')
      this.$store.dispatch('auth/logout')
    },
    handleMyList () {
      console.log('handleMyList')
      this.$router.push('/mylist')
    },
    handleInbox () {
      console.log('handleInbox')
      this.$router.push('/msg')
    },
    handleProductRegis () {
      console.log('handleProductRegis')
      this.$router.push('/product_regis')
    }
  },
  created () {
    if(this.user.token !== ''){
      this.isLoginLoding = true
      this.$store.dispatch('auth/getUserInfo')
    }
  }
}
</script>

<style lang="scss" scoped>
  .loginBtn {
    font-size: 20px !important;
    font-weight: 900;
  }
  .innerLoginBtn {
    color: $accent-red !important;
    font-size: 18px !important;
    font-weight: 600;
  }
  .v-menu__content {
    box-shadow: none;
    border: 1px solid rgb(136, 136, 136);
  }
</style>