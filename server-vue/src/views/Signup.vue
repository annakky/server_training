<template>
  <v-app>
    <div class="signup">

      <div id="title">SIGNUP</div>

      <v-form
      ref="form"
      v-model="valid"
      lazy-validation
      autocomplete="off"
      class="input-field"
      >
        <v-text-field
          ref="id"
          v-model="id"
          rounded
          filled
          color="light-green"
          label="아이디"
          :rules="[rules.required, rules.id]"
        />
        <v-text-field
          ref="pw"
          v-model="pw"
          rounded
          filled
          color="light-green"
          label="비밀번호"
          :type="showEye ? 'text' : 'password'"
          :append-icon="showEye ? 'mdi-eye' : 'mdi-eye-off'"
          @click:append="showEye = !showEye"
          :rules="[rules.required, rules.pw]"
        />
      </v-form>

      <v-snackbar
        v-model="idErrorAlert"
        rounded="pill"
        type="error"
        color="red"
        timeout=1000
      >
        <v-icon>mdi-alert-circle</v-icon> 존재하는 아이디입니다.
      </v-snackbar>

      <div class="buttons">
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

        <v-btn
          rounded
          x-large
          dark
          color="light-green"
          @click="login"
          class="button"
        >
          로그인하러 가기
        </v-btn>
      </div>
    </div>
  </v-app>
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      id: '',
      pw: '',
      valid: false,
      showEye: false,
      idErrorAlert: false,
      rules: {
        required: (v) => !!v || '입력해 주세요!',                                                                                                                                                       
        id: (v) => {
          const pattern = /[^a-z || ^A-Z || ^0-9]/
          return !pattern.test(v) || '유효하지 않은 아이디입니다.'
        },
        pw: (v) => {
          const pattern = /[ㄱ-ㅎ | ㅏ-ㅣ | 가-힣]/
          return !pattern.test(v) || '유효하지 않은 비밀번호입니다.'
        },
      },
    }
  },

  computed: {
    form () {
      return {
        id: this.id,
        pw: this.pw
      }
    }
  },

  methods: {
    signup () {
      if (this.id === '' || this.pw === '') {
        Object.keys(this.form).forEach(f => {
          this.$refs[f].validate(true)
        })
        return
      }
      axios.post('/api/signup', { id: this.id, pw: this.pw })
        .then((res) => {
          if (res.data.message === 'DUP_ENTRY') {
            this.loginErrorAlert = true
          } else if (res.data.status === 200) {
            this.$router.push('login')
          } else {
            this.loginErrorAlert = true
          }
        })
        .catch(() => {
          console.log('error')
        })
    },
    login () {
      this.$router.push('login')
    }
  }
}
</script>

<style scoped>
.signup {
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
