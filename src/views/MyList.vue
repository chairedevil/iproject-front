<template>
  <v-container fluid class="mylistContainer">
    <v-row justify="center">
      <v-col cols="8">
        <h2>マイリスト</h2>
        <v-sheet
          :elevation="0"
          color="#f5f5f5"
        >
        test
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Axios from 'axios'
import { mapState } from 'vuex'
import config from '../config'

export default {
  data: () => {
    return {
      userList:[]
    }
  },
  computed: {
    ...mapState('auth', ['user'])
  },
  created() {
    Axios.get(`${config.API_SERVER}mylist`,
    { headers: { Authorization: `Bearer ${ this.user.token}` } })
    .then(response => {
      console.log(response.data.data)
      this.userList = response.data.data
    })
  }
}
</script>

<style lang="scss" scopedS>
  .mylistContainer {
    margin-top: 64px;
  }
</style>