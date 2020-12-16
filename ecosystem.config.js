module.exports = {
    apps: [
      {
        name: 'm.antway',
        exec_mode: 'cluster',
        port: 9001,
        instances: 'max', 
        script: './node_modules/nuxt/bin/nuxt.js',
        args: 'start'
      }
    ]
  }