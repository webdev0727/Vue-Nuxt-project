import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);
export function createRouter(ssrContext, createDefaultRouter, routerOptions) {
  const options = routerOptions || createDefaultRouter(ssrContext).options

  let routesDirectory = null

  if (process.server && ssrContext && ssrContext.nuxt && ssrContext.req) {
    const req = ssrContext.req

    const domainLevel = (req.headers.host.match(/\./g) || []).length + 1
    // console.log(req.headers.host, domainLevel, "domainLevel")
    // Get routes directory by hostname

    routesDirectory = domainLevel > 3 ? 'expo.m' : 'm'
    // Save to the object that will be sent to the client as inline-script
    ssrContext.nuxt.routesDirectory = routesDirectory
  }
  if (process.client) {
    // Get what we saved on SSR
    if (window.__NUXT__ && window.__NUXT__.routesDirectory) {
      routesDirectory = window.__NUXT__.routesDirectory
    }
  }

  function isUnderDirectory(route, directory) {
    const path = route.path
    return path === '/' + directory || path.startsWith('/' + directory + '/')
  }

  let newRoutes = options.routes
  if (routesDirectory) {
    newRoutes = options.routes
      .filter((route) => {
        // remove routes from other directories
        const toRemove =
          routesDirectory === 'expo.m'
            ? 'm'
            : 'expo.m'
        return !isUnderDirectory(route, toRemove)
      })
      .map((route) => {
        // remove directory from path and name
        // console.log(route)
        if (isUnderDirectory(route, routesDirectory)) {
          let nnn_rout = {
            ...route,
            path: route.path.substr(routesDirectory.length + 1) || '/',
          }
          if (route.name) nnn_rout.name = route.name.substr(routesDirectory.length + 1) || 'index'
          // name: route.name ? route.name.substr(routesDirectory.length + 1) || 'index' : 'index'
          return nnn_rout
        }
        return route
      })
  }
  // console.log(options.routes, " new==>", newRoutes)
  return new Router({
    ...options,
    routes: newRoutes
  })
}