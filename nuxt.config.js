export default {
    /*
  ** Nuxt rendering mode
  ** See https://nuxtjs.org/api/configuration-mode
  */
  // mode: 'universal',
    /*
  ** Nuxt target
  ** See https://nuxtjs.org/api/configuration-target
  */
  target: 'server',
  server: {
    port: 9001,
  },
  env: {
    BASE_API_URL: process.env.BASE_API_URL,
  },
  /*
   ** Headers of the page
   */
  head: {
    title: process.env.npm_package_name || '',
    titleTemplate: "%s-蚂蚁街",
    meta: [{
        charset: 'utf-8'
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no'
      },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      },
      {
        hid: "keywords",
        name: "keywords",
        content: `antway,antway.cn,m.antway.cn,m.antway,event,expo,company,enterprise,discovery,discover,activity,蚂蚁街,展会,企业,头条,发现,活动,展会`
      },
      {
        property: 'og:image',        
        content: 'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1388877560,3676921828&fm=26&gp=0.jpg'
      },
      {
        property: 'og:image:width',        
        content: '550'
      },
      {
        property: 'og:image:height',        
        content: '413'
      },
    ],
    link: [{
      rel: 'icon',
      type: 'image/x-icon',
      href: '/favicon.ico'
    }],
    script: [
    ],
  },
  /*
   ** Customize the progress-bar color
   */
  loading: {
    color: '#fff'
  },
  router: {
    middleware: ['check_device'],
  },
  /*
   ** Global CSSimport 'vue-loading-overlay/dist/vue-loading.css';
   */
  css: [
    // 'element-ui/lib/theme-chalk/index.css',
    'swiper/css/swiper.css',
    'vue-image-lightbox/dist/vue-image-lightbox.min.css',
    'vue-loading-overlay/dist/vue-loading.css',
    '@/assets/scss/main.scss'
  ],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    '@/plugins/element-ui',    
    {
      src: '@/plugins/lang',
    },
    {
      src: '@/plugins/text-highlight',
      ssr: false
    },
    {
      src: '@/plugins/infiniteLoaing',
      ssr: false
    },
    {
      src: '@/plugins/b_map',
      ssr: false
    },    
    {
      src: '@/plugins/qr',
      ssr: false
    },
    {
      src: '@/plugins/vue-awesome-swiper',
      mode: 'client'
    },
    {
      src: '@/plugins/light_box',
      ssr: false
    },
    {
      src: '@/plugins/vue-read-more-smooth',
      ssr: false
    },
    {
      src: '@/plugins/paypal',
      ssr: false
    },
    '@/plugins/i18n',
    '@/plugins/mixinCommonMethods',
    '@/plugins/ku_components',
    '@/plugins/svg-icon',
    '@/icons',
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
          
  ],  
  /*
   ** Nuxt.js modules
   */
  modules: [
    '@nuxtjs/dotenv',
    '@nuxtjs/device', 
    '@nuxtjs/style-resources',   
    [
      '@nuxtjs/router',
      {
        path: 'router',
        fileName: 'index.js',
        keepDefaultRouter: true,
      },
    ],
        
  ],  
  
  /*
   ** Build configuration
   */
  build: {
    transpile: [/^element-ui/, 'swiper', 'dom7', 'vue-read-more-smooth'],
    // styleResources: {
    //   scss: ['./assets/scss/main.scss']     
    // },
    postcss:{
      'postcss-preset-env':{
        autoprefixer:{
          // grid: true
        }
      }
    },
    extend(config, ctx) {
      
    }
  }
}
