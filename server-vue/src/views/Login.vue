<template>
  <v-app>
    <div class="login">

      <div id="title">LOGIN</div>

      <v-form
        ref="form"
        v-model="valid"
        lazy-validation
        autocomplete="off"
        class="input-field"
      >
        <v-text-field
          v-model="id"
          rounded
          filled
          color="light-green"
          label="아이디"
          :rules="[rules.required, rules.id]"
        />
        <v-text-field
          v-model="pw"
          rounded
          filled
          color="light-green"
          label="비밀번호"
          type="password"
          :rules="[rules.required]"
        />
      </v-form>
      <v-snackbar
        v-model="loginErrorAlert"
        rounded="pill"
        type="error"
        timeout=1000
      >
        <v-icon>mdi-alert-circle</v-icon> 로그인 정보가 일치하지 않아요!
      </v-snackbar>

      <div class="buttons">
        <v-btn
          rounded
          x-large
          dark
          color="light-green"
          @click="login"
          class="button"
        >
          로그인
        </v-btn>
        <v-btn
          rounded
          x-large
          dark
          color="light-green"
          @click="signup"
          class="button"
        >
          회원가입
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
      loginErrorAlert: false,
      id: '',
      pw: '',
      rules: {
        required: (v) => !!v || '입력해 주세요!',                                                                                                                                                       
        id: (v) => {
          const pattern = /[^a-z || ^A-Z || ^0-9]/
          return !pattern.test(v) || '유효하지 않은 아이디입니다.'
        }
      }
    }
  },

  methods: {
    async login () {
      if (this.valid === false) {
        this.loginErrorAlert = true
        return;
      }
      axios.post('/api/login', { id: this.id, pw: this.pw })
        .then(res => {
          if (res.data.status == 200) {
            VueCookies.set('access_token', res.data.data.access_token, '10s')
            VueCookies.set('refresh_token', res.data.data.refresh_token, '1h')
            axios.defaults.headers.access_token = VueCookies.get('acccess_token')
            this.$router.push('/')
          } else {
            console.log('로그인 에러 발생')
            this.loginErrorAlert = true
            return
          }
        })
        .catch(() => {
          console.log('catch문')
          this.loginErrorAlert = true
        })
    },
    signup () {
      this.$router.push('/signup')
    }
  }
}
</script>

<style scoped>
.login {
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
.input-field {
  width: 90%;
  margin-left: 5%;
  margin-top: 15%;
}
.buttons {
  margin-top: 5%;
  text-align: center;
}
.button {
  margin-left: 5%;
  margin-right: 5%;
}
</style>
