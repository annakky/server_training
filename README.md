# 로그인 토큰 예시

=============

## 사용 방법

1. 기본 설정

사용하기 전, node.js, vue 및 vue-cli, mysql을 설치하여야한다.

```shell
git clone <url>

cd server
npm install

cd server-vue
npm install
```

2. 데이터베이스 설정

```server/config/mysql.js``` 에서 자신이 설정한 mysql user, password, databse 이름을 알맞게 설정한다.

3. 실행

```shell
$~/server node app.js

$~/server-vue npm run serve
```

데이터베이스 설정에 문제가 없다면 정상적으로 실행 될 것이다.

localhost:8080으로 접속하면 실행 화면을 확인할 수 있다.

만약 데이터베이스 접속 포트를 바꾸고 싶다면, /server-vue/vue.config.js 파일에서 desServer.proxy.target의 포트번호를 바꾸면 된다.
혹 vue.js의 포트번호를 바꾸고 싶다면, ```npm run serve -- --port <포트번호>``` 로 사용하면 된다.
