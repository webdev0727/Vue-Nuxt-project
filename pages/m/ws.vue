<template>
<div>
    <h1 class="text-center">WebSoket</h1>
    <div>
        <div class="text-center mt-4">
            <el-button type="primary" size="default" @click="establishWS">Connect WebSoket</el-button>
        </div>
    </div>
</div>
</template>

<script>
import Echo from 'laravel-echo'
export default {
    methods: {
        establishWS() {
            // window.Pusher = require('pusher-js');
            // window.Echo = new Echo({
            //     broadcaster: 'pusher',
            //     key: 'b3e8decab1bbc6a5b7c0', //process.env.MIX_PUSHER_APP_KEY,
            //     // host: 'api.antway.cn:6001', //window.location.hostname,
            //     wsHost: 'localhost', //window.location.hostname, api.antway.cn
            //     // cluster: 'ap1',
            //     wsPort: 6001, //6001 
            //     disableStats: true,
            // });
            // window.Echo.connector.pusher.connection.bind('connected', () => {
            //     console.log('connected')
            // })
            // window.Echo.channel('antway.message').listen("antway.message", (event) => {
            //     alert('callbacked.....' + event.username);
            //     console.log('---', 'callbacked');
            //     console.log('event.message', event.username);
            //     //this.messages.push(event.message);
            //     //event.unread.
            // })
        }
    },
    mounted() {
        window.Pusher = require('pusher-js');
        window.Echo = new Echo({
            broadcaster: 'pusher',
            key: 'b3e8decab1bbc6a5b7c0', //process.env.MIX_PUSHER_APP_KEY,
            // authHost: "http://localhost:8000",
            authEndpoint:  'http://localhost:6001/broadcasting/auth',
            // host: 'api.antway.cn:6001', //window.location.hostname,
            wsHost: '127.0.0.1', //, api.antway.cn
            // cluster: 'ap1',
            wsPort: 6001, //6001 
            disableStats: true,
            forceTLS: false,
        });
        window.Echo.connector.pusher.connection.bind('connected', () => {
            console.log('connected')
        })
        // window.Echo.channel('antway.message').listen("MessageSent", (event) => {
        //     alert('notification.....');
        //     console.log('---', 'callbacked', event);
        //     //this.messages.push(event.message);            
        // })
        // window.Echo.channel(`antway.message`)
        //     .listen("MessageSent", (event) => {
        //         alert('notification.....');
        //         console.log('---', 'callbacked', event);
        //     })
        window.Echo.join(`antway.message.p`)
            .listen("StatusLiked", (event) => {
                alert('notification.....');
                console.log('---', 'callbacked', event);
            })
    }
}
</script>
