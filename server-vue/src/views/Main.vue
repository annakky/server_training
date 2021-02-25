<template>
  <v-app>
    <div class="main">

      <div id="title">MAIN</div>

      <v-form
        ref="form"
        v-model="valid"
        lazy-validation
        autocomplete="off"
        class="input-field"
        id="inputField"
      >
        <v-text-field
          v-model="searchId"
          label="Seach ID"
          color='green'
          :rules="[rules.id]"
          :append-icon="'mdi-account-search'"
          @click:append="search"
        ></v-text-field>
      </v-form>

      <div id="idList">
        <div
          id="searchedId"
          v-for="user in userList"
          :key=user.id
        >
          {{ user.id }}
        </div>

        <div
          id="loader"
          v-show="loading"
        ></div>
      </div>

      <div class="button">
        <v-btn
          rounded
          x-large
          dark
          color="light-green"
          @click="logout"
        >
          로그아웃
        </v-btn>
      </div>

    </div>
  </v-app>
</template>

<script>
import axios from 'axios'
import VueCookies from 'vue-cookies'

export default {
  data () {
    return {
      valid: false,
      rules: {                                                                                                                                                  
        id: (v) => {
          const pattern = /[^a-z || ^A-Z || ^0-9]/
          return !pattern.test(v) || '유효하지 않은 아이디입니다.'
        }
      },
      searchId: '',
      userList: [],
      loading: false,
    }
  },

  methods: {
    getUsers() {
      axios.get('/api/users', {
        params: {
          search: this.searchId
        }
      })
        .then(res => {
          this.userList = res.data.data.users;
          this.loading = false;
        })
        .catch(() => {
          console.log('userList Error');
          this.loading = false;
        })
    },

    search() {
      this.loading = true;
      this.userList.length = 0;
      if (VueCookies.get('access_token') !== null) {
        this.getUsers();
        return;
      } else if (VueCookies.get('access_token') === null && VueCookies.get('refresh_token') !== null) {
        this.$store.dispatch('refreshToken')
        .then(() => {
          this.getUsers();
          return;
        })
        .catch(() => {
          this.loading = false;
          console.log('refresh token error');
        })
      } else {
        this.$router.push('/login');
      }
      
    },

    logout() {
      VueCookies.remove('access_token');
      VueCookies.remove('refresh_token');
      this.$router.push('/login');
    }
  }
}
</script>

<style scoped>
.main {
  width: 50%;
  height: 70%;
  margin-left: 25%;
  margin-top: 7.5%;
  border: 5px solid green;
  border-radius: 2em;
}
#title {
  text-align: center;
  width: 100%;
  height: 10%;
  margin-top: 5%;
  font-size: 4em;
  color: green;
}
#idList {
  width: 80%;
  height: 40%;
  margin-top: 2%;
  margin-left: 10%;
  overflow-y: scroll;
}
#idList::-webkit-scrollbar {
  width: 10px;
}
#idList::-webkit-scrollbar-thumb {
  background-color: #2f3542;
  border-radius: 10px;
}
#idList::-webkit-scrollbar-track {
  background-color: grey;
  border-radius: 10px;
  box-shadow: inset 0px 0px 5px white;
}
#searchedId {
  width: 80%;
  margin-left: 10%;
  margin-top: 3.5%;
  margin-bottom: 3.5%;
  border-bottom: 1px dotted green
}
#inputField {
  width: 80%;
  margin-left: 10%;
  margin-top: 4%;
}
.button {
  margin-top: 2%;
  text-align: center;
}

#loader {
  position: absolute;
  border: 4px solid #f3f3f3;
  border-top: 4px solid green;
  border-radius: 50%;
  width: 4vw;
  height: 4vw;
  left: calc(50% - 2vw);
  top: calc(50% - 2vw);
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
