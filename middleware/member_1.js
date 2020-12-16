export default function ({ store, redirect, route }) {
    if (![3, 4].includes(store.getters.userLevel)) {
      return redirect(`/pricing?lev=4&redirect=${route.path}`)
    }  
}
  