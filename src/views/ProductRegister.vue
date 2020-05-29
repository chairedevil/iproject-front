<template>
  <v-container fluid class="productRegisterContainer">
    <v-row justify="center">
      <v-col cols="8">
        <h2>商品登録</h2>
        <v-sheet
          :elevation="0"
          color="#f5f5f5"
        >
          <v-form class="px-10 py-5" @on:submit="handleSubmit" ref="form">
            <v-text-field
              v-model="name"
              :rules="[v => !!v || '商品名を入力してください']"
              :counter="100"
              label="商品名"
              required
            ></v-text-field>
            <v-text-field
              label="価格"
              v-model="price"
              :rules="[v => !!v || '価格を入力してください']"
              type="number"
              required
            ></v-text-field>
            <v-select
              label="カテゴリー"
              v-model="categoryId"
              :items="categoriesList"
              required
            ></v-select>
            <v-combobox
              label="商品に関するキーワード"
              v-model="tags"
              :rules="[
                v => !!v || 'キーワードを入力してください',
                v => this.tags.length > 0 || 'キーワードを入力してください'
                ]"
              small-chips
              multiple
              required
              clearable
              @click:clear="tagsClear"
              
            >
            </v-combobox>
            <v-file-input
              label="商品の画像"
              v-model="img_path"
              :rules="[v => !!v || '画像を入力してください']"
              accept="image/png, image/jpeg"
              prepend-icon="mdi-camera"
              required
            ></v-file-input>
            <!--<v-textarea
              label="商品詳細"
              :rules="[v => !!v || '画像を入力してください']"
              v-model="desc"
              required
            ></v-textarea>-->
            <br>
            商品詳細
            <VueEditor
              v-model="desc"
              useCustomImageHandler
              @image-added="handleImageAdded"
            ></VueEditor>
            <br>
            打ち合わせ希望の場所
            <div class="map">
              <GmapMap
                :center="mapCenter"
                :zoom="14"
                :options="{streetViewControl: false, mapTypeControl: false, clickableIcons: false}"
                style="width: 100%; height: 100%"
                @click="handleMapCLick"
                @center_changed="centerChanged"
              >
                <GmapMarker
                  :position="mapCenter"
                />
              </GmapMap>
            </div>
            <v-btn class="mr-4 regisBtn" outlined color="#cc1f40" @click="handleSubmit">商品登録</v-btn>
          </v-form>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Axios from 'axios'
import config from '../config'
import { mapState } from 'vuex'
import _ from 'lodash'
import { VueEditor } from "vue2-editor"

export default {
  name: 'ProductRegistr',
  data: () => {
    return {
      categoriesList: [{text: '家具', value: 1}, {text: '家電', value: 2}, {text: '自転車', value: 3}, {text: '服・ファッション', value: 4}, {text: '携帯電話・スマホ', value: 5}, {text: 'おもちゃ', value: 6}, {text: 'パソコン', value: 7}, {text: 'チケット', value: 8}, {text: 'その他', value: 9}],

      name: 'gundam',
      price: 10000,
      categoryId: 6,
      tags: null,
      desc: '',
      img_path: null,

      mapCenter: {
        lat: 35.690112,
        lng: 139.700460
      }
    }
  },
  components: {
    VueEditor
  },
  computed: {
    ...mapState('auth', ['user'])
  },
  methods: {
    tagsClear: function () {
      this.tags = null
    },
    centerChanged: _.debounce(function(geo) {
      this.mapCenter = geo
    }, 500),
    handleMapCLick (geo) {
      this.mapCenter = geo.latLng
    },
    handleSubmit () {
      if(this.$refs.form.validate()){
        console.log('登録')
        let form = new FormData()
        form.append('name', this.name)
        form.append('price', this.price)
        form.append('category_id', this.categoryId)
        form.append('tags', this.tags)
        form.append('desc', this.desc)
        form.append('lat', this.mapCenter.lat())
        form.append('lng', this.mapCenter.lng())
        form.append('img_path', this.img_path)
        
        Axios.post(config.API_SERVER + 'products', form, 
        { headers: { Authorization: `Bearer ${ this.user.token}` } })
        .then(response => {
          console.log(response)
          this.$router.push('/')
          this.$store.dispatch('auth/setAlert', '商品登録済み')
        })
        .catch(err => {
          console.log(err)
          this.$store.dispatch('auth/setAlert', '商品登録失敗')
        })
      }
    },
    handleImageAdded(file, Editor, cursorLocation, resetUploader){//file, Editor, cursorLocation, resetUploader
      console.log("add image", file)

      var formData = new FormData();
      formData.append("image", file);

      Axios({
        url: `${config.API_SERVER}add_img`,
        method: "POST",
        data: formData,
        headers: { Authorization: `Bearer ${ this.user.token}` }
      })
      .then(result => {
        console.log(result)
        let url = `${config.API_SERVER}../images/${result.data.data}`; // Get url from response
        Editor.insertEmbed(cursorLocation, "image", url);
        resetUploader();
      })
      .catch(err => {
        console.log(err);
      });
    }
  },
  created () {
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
}
</script>

<style lang="scss" scoped>
  .productRegisterContainer {
    margin-top: 64px;
  }
  .regisBtn {
    width: 100%;
  }
  .map {
    height: 400px;
    margin-bottom: 30px;
  }
</style>