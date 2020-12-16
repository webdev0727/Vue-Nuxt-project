import Vue from 'vue';
import Echo from 'laravel-echo';

const echo = {};

echo.install = function (Vue) {
  Vue.prototype.$pusher = require('pusher-js');
  Vue.prototype.$echo = new Echo({
    // authEndpoint:  'http://antway.cn:6001/broadcasting/auth',
    authEndpoint:  false,
    // auth: {
    //   headers: {
    //     Authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9hcGkuYW50d2F5LmNuXC9hcGlcL3VzZXJcL2xvZ2luIiwiaWF0IjoxNTk3OTg5NjkxLCJuYmYiOjE1OTc5ODk2OTEsImp0aSI6InBEaENCaVBmWEtNYnp0cFQiLCJzdWIiOjM3LCJwcnYiOiI4N2UwYWYxZWY5ZmQxNTgxMmZkZWM5NzE1M2ExNGUwYjA0NzU0NmFhIn0.JTos63Oj9plmccs3AmDPZCbN_zX0uiFaecRD6k9MjXo',
    //   }
    // },
    broadcaster: 'pusher',
    cluster: process.env.PUSHER_APP_CLUSTER,
    key: process.env.PUSHER_APP_KEY,
    wsHost: process.env.WS_HOST,
    wsPort: process.env.WS_PORT,
    // encrypted: true,
    forceTLS: false,
    disableStats: true,
  });
};

Vue.use(echo);