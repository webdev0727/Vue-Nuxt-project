export default function ({ store, redirect, route }) {
    // If the user is not authenticated
    if (![3, 4, 5].includes(store.getters.userLevel)) {
      return redirect(`/pricing?lev=3&redirect=${route.path}`)
    }
  }
  