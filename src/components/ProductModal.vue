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
                  {{ modalProduct.username }}
                </p>
                <p class="price">価格 : {{ modalProduct.price }}円</p>
                <p>
                  <v-chip class="mr-2 mb-2" color="#cc1f40" text-color="white" label v-for="tag in tagsArr" :key="tag" @click="$emit('onTagClick', tag)"><v-icon left>mdi-label</v-icon>{{ tag }}</v-chip>
                </p>
                <v-btn color="#cc1f40" outlined @click="showModal = false" class="reserveBtn mt-auto" x-large>予約</v-btn>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                {{ modalProduct.desc }}
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  data: () => {
    return {
    }
  },
  props: ['modalProduct', 'showModal'],
  watch: {
    // modalProduct: function () {
    //     this.showModal = true
    // }
  },
  computed: {
    imgSrc: function () {
      return 'http://localhost:8000/images/' + this.modalProduct.img_path
    },
    avaSrc: function () {
      return 'http://localhost:8000/images/avatar/' + this.modalProduct.ava_path
    },
    tagsArr: function () {
      console.log()
      return this.modalProduct.tags.split(", ")
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
</style>