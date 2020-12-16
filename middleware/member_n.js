export default function ({ store, redirect, route }) {
    // If the user is not authenticated
    // console.log("authenteded middleware", store.state.auth)
    if (!store.state.auth.vip_id) {
      return redirect(`/pricing?redirect=${route.path}`)
    }
  }
  