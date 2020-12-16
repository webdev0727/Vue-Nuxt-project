export default function ({ store, redirect, route }) {
    if (store.getters.userLevel != 5) {
      return redirect(`/pricing?lev=5&redirect=${route.path}`)
    }
  }
  