<template>
  <div>
    <v-dialog v-model="showModal" width="700px" @click:outside="$emit('handleChangeShowModal')">
      <v-card>
        <v-card-title>
          <span class="headline">{{ modalProduct.name }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="6">
                <v-img :src="imgSrc" contain></v-img>
              </v-col>
              <v-col cols="6" class="productDetail d-flex flex-column">
                <p class="user d-flex align-center">
                  <v-avatar class="mr-3">
                    <img
                      :src="avaSrc"
                      :alt="modalProduct.username"
                    >
                  </v-avatar>
                  {{ modalProduct.username }} <span v-if="modalProduct.user_rating !== null"> (<span class="starIcon">★</span>{{ modalProduct.user_rating }})</span>
                </p>
                <p class="price">価格 : {{ modalProduct.price }}円</p>
                <p>
                  <v-chip class="mr-2 mb-2" color="#cc1f40" text-color="white" label v-for="tag in tagsArr" :key="tag" @click="$emit('onTagClick', tag)"><v-icon left>mdi-label</v-icon>{{ tag }}</v-chip>
                </p>
                <v-btn
                  v-if="status.isLoggedIn === true && user.userInfo.id !== modalProduct.seller_id"
                  color="#cc1f40"
                  outlined
                  @click="() => {confirmDialog = true}"
                  class="reserveBtn mt-auto"
                  x-large
                >
                  <v-progress-circular
                    class="loadingCircle"
                    indeterminate
                    color="red"
                    v-if="isReserveLoading"
                  ></v-progress-circular>
                  <div v-else>予約</div>
                </v-btn>
              </v-col>
            </v-row>
            <v-row>
              <v-col v-html="modalProduct.desc" class="descContainer">
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog v-model="confirmDialog" persistent max-width="290">
      <v-card>
        <v-card-title class="headline">予約確認</v-card-title>
        <v-card-text>「{{ modalProduct.username }}」さんの「{{ modalProduct.name }}」を予約しますか。</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click="confirmDialog = false">キャンセル</v-btn>
          <v-btn color="green darken-1" text @click="handleReserve">確認</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import config from '../config'
import Axios from 'axios'
import { mapState } from 'vuex'

export default {
  data: () => {
    return {
      confirmDialog: false,
      isReserveLoading: false
    }
  },
  props: ['modalProduct', 'showModal'],
  watch: {
    // modalProduct: function () {
    //     this.showModal = true
    // }
  },
  computed: {
    ...mapState('auth', ['status', 'user']),
    imgSrc: function () {
      return `${config.API_SERVER}../images/` + this.modalProduct.img_path
    },
    avaSrc: function () {
      return `${config.API_SERVER}../images/avatar/` + this.modalProduct.ava_path
    },
    tagsArr: function () {
      return this.modalProduct.tags.split(", ")
    }
  },
  methods: {
    handleReserve: function () {
      this.isReserveLoading = true
      this.confirmDialog = false
      console.log('「予約」ボタンが押された。')
      
      Axios.patch(config.API_SERVER + 'reserve', {
        'product_id': this.modalProduct.id
      }, 
      { headers: { Authorization: `Bearer ${ this.user.token}` } })
      .then(response => {
        console.log(response)
        if(response.data.success === true){
          this.$emit('handleChangeShowModal')
          this.isReserveLoading = false
          this.$store.dispatch('auth/setAlert', '予約しました。')
        }else{
          this.$store.dispatch('auth/setAlert', response.data.message)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .reserveBtn {
    font-size: 30px !important;
    margin-bottom: 5px;
    width: 100%;
  }
  .productDetail {
    .user {
      font-size: 30px;
    }
    .price {
      font-size: 20px;
    }
  }
  .descContainer::v-deep {
    img {
      max-width: 100%;
    }
  }
  .starIcon {
    color: #ff9800;
  }
  .loadingCircle {

  }
</style>