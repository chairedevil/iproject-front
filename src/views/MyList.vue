<template>
  <v-container fluid class="mylistContainer">
    <v-progress-circular
      class="loadingCircle"
      indeterminate
      color="red"
      v-if="isProcessLoading"
    ></v-progress-circular>
    <v-row justify="center">
      <v-col cols="8">
        <h2>マイリスト</h2>
        <v-sheet
          :elevation="0"
          color="#f5f5f5"
          class="pa-5"
        >
          <h3>販売リスト</h3>
          <v-progress-circular
            class="loadingCircle"
            indeterminate
            color="red"
            v-if="isListLoading"
          ></v-progress-circular>
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
              <div v-if="list.status === 1" class="align-self-center ml-auto mr-10" @click="handleDeleteProduct(list.list_id)">
                <v-btn outlined color="#cc1f40">商品削除</v-btn>
              </div>
              <div v-if="list.status === 2" class="align-self-center ml-auto mr-10 d-flex flex-column">
                <v-btn
                  class="mb-2"
                  outlined color="#cc1f40"
                  @click="handleCancelReserve(list.list_id)"
                >交渉キャンセル</v-btn>
                <v-btn
                  outlined color="#cc1f40"
                  @click="handleDoneTransaction(list.list_id)"
                >取引完了</v-btn>
              </div>
            </v-sheet>
          </div>
          <h3>買い物リスト</h3>
          <v-progress-circular
            class="loadingCircle"
            indeterminate
            color="red"
            v-if="isListLoading"
          ></v-progress-circular>
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
              <div v-if="list.status === 1" class="align-self-center ml-auto mr-10" @click="handleDeleteProduct(list.list_id)">
                <v-btn outlined color="#cc1f40">商品削除</v-btn>
              </div>
              <div v-if="list.status === 2" class="align-self-center ml-auto mr-10 d-flex flex-column">
                <v-btn
                  class="mb-2"
                  outlined color="#cc1f40"
                  @click="handleCancelReserve(list.list_id)"
                >交渉キャンセル</v-btn>
                <v-btn
                  outlined color="#cc1f40"
                  @click="handleDoneTransaction(list.list_id)"
                >取引完了</v-btn>
              </div>
              <div v-if="list.status === 3" class="align-self-center ml-auto mr-10 d-flex flex-column">
                <v-rating
                  x-large
                  v-model="rating"
                  background-color="orange lighten-3"
                  color="orange"
                  class="mb-5"
                ></v-rating>
                <v-btn
                  outlined color="#cc1f40"
                  @click="handleRate(list.list_id)"
                >評価</v-btn>
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
      buyList:[],
      
      rating: 3,
      isListLoading: true,
      isProcessLoading: false
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
    },
    getList: function () {
      this.isListLoading = true
      Axios.get(`${config.API_SERVER}mylist`,
      { headers: { Authorization: `Bearer ${ this.user.token}` } })
      .then(response => {
        //console.log(response.data.data)
        this.sellList = response.data.data[0]
        this.buyList = response.data.data[1]
        this.isListLoading = false
      })
    },
    handleDeleteProduct: function ($listId) {
      console.log("Delete Product")
      this.isProcessLoading = true
      
      Axios.patch(config.API_SERVER + 'delete_product', {
        'list_id': $listId
      },
      { headers: { Authorization: `Bearer ${ this.user.token}` } })
      .then(response => {
        console.log(response)
        this.isProcessLoading = false
        if(response.data.success === true){
          this.$store.dispatch('auth/setAlert', '商品を削除しました。')
        }else{
          this.$store.dispatch('auth/setAlert', response.data.message)
        }
        
        this.getList()
      })
    },
    handleCancelReserve: function ($listId) {
      console.log("Cancel Reserve")
      this.isProcessLoading = true
      
      Axios.patch(config.API_SERVER + 'cancel_reserve', {
        'list_id': $listId
      },
      { headers: { Authorization: `Bearer ${ this.user.token}` } })
      .then(response => {
        console.log(response)
        this.isProcessLoading = false
        if(response.data.success === true){
          this.$store.dispatch('auth/setAlert', '予約をキャンセルしました。')
        }else{
          this.$store.dispatch('auth/setAlert', response.data.message)
        }

        this.getList()
      })
    },
    handleDoneTransaction: function ($listId) {
      console.log("done_transaction")
      this.isProcessLoading = true
      
      Axios.patch(config.API_SERVER + 'done_transaction', {
        'list_id': $listId
      },
      { headers: { Authorization: `Bearer ${ this.user.token}` } })
      .then(response => {
        console.log(response)
        this.isProcessLoading = false
        if(response.data.success === true){
          this.$store.dispatch('auth/setAlert', '取引完了しました。')
        }else{
          this.$store.dispatch('auth/setAlert', response.data.message)
        }

        this.getList()
      })
    },
    handleRate: function (list_id) {
      console.log("rating the user who sold")
      this.isProcessLoading = true
      
      Axios.patch(config.API_SERVER + 'rate_user', {
        'list_id': list_id,
        'rating' : this.rating
      },
      { headers: { Authorization: `Bearer ${ this.user.token}` } })
      .then(response => {
        //console.log(response)
        this.isProcessLoading = false
        if(response.data.success === true){
          this.$store.dispatch('auth/setAlert', '評価しました')
        }else{
          this.$store.dispatch('auth/setAlert', response.data.message)
        }

        this.getList()
      })
    }
  },
  created() {
    this.getList()
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
  .loadingCircle {
    position: absolute;
    left: calc(50% - 20px);
    top: 50%;
  }
</style>