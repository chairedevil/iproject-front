<template>
  <div class="mainContent">
    <v-btn class="toggleCardView" color="#cc1f40" dark @click="showCardContent = !showCardContent">カードスタイル</v-btn>
    <v-btn class="currentLocationBtn" color="#cc1f40" dark @click="goCurrentLocation">現在地</v-btn>
    <div class="mapContent">
      <div class="searchbar d-flex">
        <v-row>
          <v-col cols="6">
            <v-autocomplete
              v-model="placeModel"
              :items="placeItems"
              :loading="placeIsLoading"
              :search-input.sync="placeValue"
              label="場所"
              hide-selected
              cache-items
              hide-details
              clearable
              solo
              flat
            >
            </v-autocomplete>
          </v-col>
          <v-col cols="3">
            <v-combobox
              label="キーワード"
              v-model="tags"
              small-chips
              required
              solo
              flat
              hide-details
              single-line
            >
          </v-combobox>
          </v-col>
          <v-col cols="3">
            <v-select
              label="カテゴリー"
              v-model="categoryId"
              :items="categoriesList"
              required
              solo
              flat
              hide-details
            ></v-select>
          </v-col>
        </v-row>
      </div>
      <GmapMap
        :center="mapCenter"
        :zoom="14"
        :options="{streetViewControl: false, mapTypeControl: false, clickableIcons: false}"
        style="width: 100%; height: 100%; z-index: 0;"
        @center_changed="centerChanged"
      >
        <GmapMarker :position="mapCenter" />
        <gmap-marker :key="index" v-for="(m, index) in itemsOnMap" :position="{lat: m.lat, lng: m.lng }" :clickable="true" :draggable="true" @click="handleProductSelect(m)"></gmap-marker>
      </GmapMap>
      <ProductModal :modalProduct="modalProduct" :showModal="showModal" @handleChangeShowModal="()=>{showModal = false; getProducts()}" @onTagClick="onTagClick"></ProductModal>
    </div>
    <div class="cardContent" v-if="showCardContent">
      <v-progress-circular
        class="loadingCircle"
        indeterminate
        color="red"
        v-if="isProductLoading"
      ></v-progress-circular>
      <div v-masonry id="cardContainer" transition-duration="0.3s" stagger="0.1s" item-selector=".item" class="">
        <v-card
          v-masonry-tile
          class="item mb-5 ml-5"
          max-width="29%"
          transition-duration="0.3s"
          v-for="item in itemsOnMap"
          :key="item.id"
          hover
          @click="handleProductSelect(item)"
        >
          <v-img
            :src="'http://localhost:8000/images/' + item.img_path"
            @load="handleLoaded"
          ></v-img>
          <v-card-title>{{ item.name }}</v-card-title>
          <v-card-text>
            <p class="mb-0">距離：{{ Math.round(item.distance * 100) / 100 }}km</p>
            <p class="mb-0">価格：{{ item.price }}円</p>
          </v-card-text>
        </v-card>
        </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import config from '../config'
import Axios from 'axios'
import ProductModal from '../components/ProductModal'

export default {
  name: 'Home',
  data: () => {
    return {
      placeModel: null,
      placeItems: [],// 案内場所
      placeIsLoading: false,
      placeValue: null,// ユーザが入力した値

      tags: undefined,
      categoryId: null,
      categoriesList: [{text: '指定なし', value: ''}, {text: '家具', value: 1}, {text: '家電', value: 2}, {text: '自転車', value: 3}, {text: '服・ファッション', value: 4}, {text: '携帯電話・スマホ', value: 5}, {text: 'おもちゃ', value: 6}, {text: 'パソコン', value: 7}, {text: 'チケット', value: 8}, {text: 'その他', value: 9}],
      
      mapCenter: {
        lat: 35.690112,
        lng: 139.700460
      },

      itemsOnMap: [],

      modalProduct: {
        tags: ' '
      },
      showModal: false,
      showCardContent: true,

      loadedImg: 0,
      isProductLoading: false
    }
  },
  components: {
    ProductModal
  },
  created () {
    //this.goCurrentLocation()
    this.getProducts()
  },
  methods: {
    handleLoaded: function () {
      // this.loadedImg++
      // if(this.loadedImg === this.itemsOnMap.length){
      //   console.log("LOADED")
      //   this.$redrawVueMasonry()
      // }
      this.$redrawVueMasonry()
    },
    onTagClick: function (tag) {
      this.tags = tag
      this.showModal = false
    },
    handleProductSelect: function (product) {
      this.showModal = true
      this.modalProduct = product
    },
    centerChanged: _.debounce(function(geo) {
      this.mapCenter = geo
      this.placeModel = null
    }, 500),
    getProducts: _.debounce(function(){
      this.itemsOnMap = []
      this.isProductLoading = true
      this.loadedImg = 0
      let latQuery = typeof this.mapCenter.lat === "function" ? this.mapCenter.lat() : this.mapCenter.lat
      let lngQuery = typeof this.mapCenter.lng === "function" ? this.mapCenter.lng() : this.mapCenter.lng
      //let tagsQuery = this.tags === undefined ? '' : this.tags
      let tagsQuery
      if(this.tags === undefined || this.tags === null){
        tagsQuery = ''
      } else {
        tagsQuery = this.tags
      }
      let categoryQuery = this.categoryId === null ? '' : this.categoryId

      Axios.get(`${config.API_SERVER}products?geo=${latQuery},${lngQuery}&tags=${tagsQuery}&category=${categoryQuery}`)
      .then(res => {
        console.log('Get product', res.data.data)
        this.isProductLoading = false
        this.itemsOnMap = res.data.data
      })
    }, 500),
    goCurrentLocation: function () {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          console.log("Got current location")
          console.log(position)
          this.mapCenter = {lat:position.coords.latitude, lng:position.coords.longitude};
        }, (err) => {
          console.log(err)
        },{enableHighAccuracy: true})
      } else {
        console.log("Set geo with default value(shinjuku station)")
      }
    }
  },
  watch: {
    placeValue: _.debounce(function(val) {
      console.log("in")
      if (this.isLoading) return
      if (val == '') return
      this.isLoading = true
      // Lazily load input items
      fetch( config.SUB_API_SERVER + 'autoplace?chr=' + val)
        .then(res => res.json())
        .then(res => {
          this.placeItems = res
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => (this.isLoading = false))
    }, 500),
    placeModel: function (newVal, oldVal) {
      if(newVal === oldVal) return
      if(newVal === '') return

      fetch( config.SUB_API_SERVER + 'getgeo?chr=' + this.placeModel)
        .then(res => res.json())
        .then(res => {
          //console.log("geo of searchbar value :", res.result.geometry.location)
          this.mapCenter = {lat:res.result.geometry.location.lat, lng:res.result.geometry.location.lng}
        })
        .catch(err => {
          console.log(err)
        })
    },
    mapCenter: function () {
      this.getProducts()
    },
    tags: function () {
      this.getProducts()
    },
    categoryId: function () {
      this.getProducts()
    }
  }
}
</script>

<style lang="scss" scoped>
  .mainContent {
    display: flex;
    margin-top: 64px;
    width: 100%;
    height: calc(100% - 64px);
  }
  .mapContent {
    width: 100%;
    height: 100%;
  }
  .cardContent {
    padding-top: 100px;
    width: 100%;
    height: 91vh;
    overflow: auto;
    position: relative;
  }
  .searchbar {
    z-index: 1 !important;
    width: calc(100% - 300px);
    height: 60px;
    border-radius: 10px;
    
    position: absolute;
    top: 80px;
    margin-left: 150px;
    box-shadow: 0 0 10px #ddd;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
  }
  .toggleCardView {
    position: absolute;
    right: 20px;
    bottom: 20px;
    z-index: 100 !important;
  }
  .currentLocationBtn {
    position: absolute;
    left: 20px;
    bottom: 20px;
    z-index: 100 !important;
  }
  .loadingCircle{
    position: absolute;
    top: 50%;
    left: 50%;
  }
</style>