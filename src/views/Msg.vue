<template>
  <v-container fluid class="msgContainer">
    <v-row justify="center">
      <v-col cols="8">
        <h2>メッセージ</h2>
        <v-row class="chatBox">
          <v-col cols="3" class="pa-0">
            <div v-for="user in msgUserList" :key="user.id" class="userList pa-3" @click="handleSelectUser(user.id)">
              <v-avatar>
                <img
                  :src="getAvaPath(user.ava_path)"
                  :alt="user.name"
                >
              </v-avatar>
              <span class="ml-2">{{ user.name }}</span>
            </div>
          </v-col>
          <v-col cols="9" class="pa-0 chatSpace d-flex-column">

            <div class="msgHistory">
              <div class="msgHistoryInner d-flex flex-column">
                <div class="msg mt-auto"></div>
                <div
                  v-for="msg in msgs"
                  :key="msg.id"
                  :class="['msg','ma-2','pa-2', msg.sender_id === user.userInfo.id ? 'ml-auto' : 'mr-auto']"
                >
                  {{ msg.msg }}
                </div>

              </div>
            </div>
            
            <div class="sendBoxContainer d-flex align-center ma-5">
              <v-text-field
                outlined
                color="#cc1f40"
                hide-details
                placeholder="メッセージを入力してくだいさい"
                class="msgBox"
                v-model="msgText"
              ></v-text-field>
              <v-btn
                outlined
                color="#cc1f40"
                height="56"
                class="sendBtn ml-5"
                @click="sendMsg"
              >
                送信
              </v-btn>
            </div>
          </v-col>
        </v-row>
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
      msgUserList: [],

      targetUser: null,
      msgs: [],

      msgText: ""
    }
  },
  computed: {
    ...mapState('auth', ['user'])
  },
  methods: {
    getAvaPath: function (path) {
      return `${config.API_SERVER}../images/avatar/${path}`
    },
    getMsgUserList: function () {
      Axios.get(`${config.API_SERVER}msguserlist`,
      { headers: { Authorization: `Bearer ${this.user.token}` } })
      .then(response => {
        this.msgUserList = response.data.data
      })
    },
    handleSelectUser: function (id) {
      console.log(`select user:${id} from list`)
      this.targetUser = id
      Axios.get(`${config.API_SERVER}msg?targetuser=${id}`,
      { headers: { Authorization: `Bearer ${this.user.token}` } })
      .then(response => {
        console.log(response)
        this.msgs = response.data.data
      })
    },
    sendMsg: function () {
      console.log("send msg")

      if(this.targetUser !== null && this.msgText.trim() !== ""){
        Axios.post(`${config.API_SERVER}sendmsg`,{
          target_user: this.targetUser,
          msg: this.msgText
        },
        { headers: { Authorization: `Bearer ${this.user.token}` } })
        .then(response => {
          console.log(response)
          this.msgText = ""
          this.handleSelectUser(this.targetUser)
        })
      }else{
        alert("相手または、メッセージを入力してくだいさい")
      }
    }
  },
  created() {
    this.getMsgUserList()
  }
}
</script>

<style lang="scss" scopedS>
  .msgContainer {
    margin-top: 64px;
  }
  .chatBox {
    background-color: #f5f5f5;
    border-radius: 5px;
  }
  .userList {
    width: 100%;
    cursor: pointer;
    font-size: 20px;
    border-bottom: 2px solid #DDD;
  }
  .chatSpace {
    background-color: rgb(216, 216, 216);
    height: calc(100vh - 180px);
    border-radius: 5px;
    
    .msgHistory {
      overflow: hidden;
      height: calc(100% - 95px);

      .msgHistoryInner {
        width: 100%;
        height: 100%;
        overflow-y: scroll;
        padding-right: 17px;
        box-sizing: content-box;
      }

      .msg {
        background-color: #fff;
        display: inline-block;
        border-radius: 5px;
      }
    }
    .sendBoxContainer {
      .msgBox {
        background-color: #fff;
        border-radius: 5px;
      }
      .sendBtn {
        background-color: #fff;
        border-radius: 5px;
      }
    }
  }
</style>