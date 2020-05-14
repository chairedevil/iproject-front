<template>
  <v-container fluid class="mylistContainer">
    <v-row justify="center">
      <v-col cols="8">
        <h2>マイリスト</h2>
        <v-sheet
          :elevation="0"
          color="#f5f5f5"
          class="pa-5"
        >
          <h3>販売リスト</h3>
          <div v-if="sellList !== []">
            <v-sheet elevation="3" v-for="list in sellList" :key="list.id" class="d-flex ma-5">
              <v-sheet>
                <v-img :src="getImgUrl(list.img_path)" width="120" height="120" contain class="img"></v-img>
              </v-sheet>
              <div class="ml-3 mt-3">
                <h4 class="mb-0">{{ list.pname }}</h4>
                <p class="mb-0">価格：{{ list.price}}</p>
                <p class="mb-0 statusText">進捗：{{ getStatus(list.status) }}</p>
              </div>
            </v-sheet>
          </div>
          <h3>買い物リスト</h3>
          <div v-if="buyList !== []">
            <v-sheet elevation="3" v-for="list in buyList" :key="list.id" class="d-flex ma-5">
              <v-sheet>
                <v-img :src="getImgUrl(list.img_path)" width="120" height="120" contain class="img"></v-img>
              </v-sheet>
              <div class="ml-3 mt-3">
                <h4 class="mb-0">{{ list.pname }}</h4>
                <p class="mb-0">販売：{{ list.name}}</p>
                <p class="mb-0">価格：{{ list.price}}</p>
                <p class="mb-0 statusText">進捗：{{ getStatus(list.status) }}</p>
              </div>
            </v-sheet>
          </div>
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
      sellList:[],
      buyList:[]
    }
  },
  computed: {
    ...mapState('auth', ['user'])
  },
  methods: {
    getImgUrl: function (path) {
      return  config.API_SERVER + '../images/' + path 
    },
    getStatus: function (num) {
      let status = ""
      switch(num){
        case 1: status="投稿中";break;
        case 2: status="交渉中";break;
        case 3: status="評価待ち中";break;
        case 4: status="販売済";break;
      }
      return status
    }
  },
  created() {
    Axios.get(`${config.API_SERVER}mylist`,
    { headers: { Authorization: `Bearer ${ this.user.token}` } })
    .then(response => {
      console.log(response.data.data)
      this.sellList = response.data.data[0]
      this.buyList = response.data.data[1]
    })
  }
}
</script>

<style lang="scss" scopedS>
  .mylistContainer {
    margin-top: 64px;
  }
  .img {
    border-top-left-radius:5px;
    border-bottom-left-radius: 5px;
  }
  .statusText {
    color: #cc1f40;
  }
</style>