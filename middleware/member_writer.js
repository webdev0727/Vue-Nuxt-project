export default function ({ store, redirect, route }) {
    // If the user is not authenticated
    // console.log("authenteded middleware", store.state.auth)
    if (store.state.auth.status_writer==0) {
      return redirect(`/my/article/writer?redirect=${route.path}`)
    }else if(store.state.auth.status_writer==1){
      return redirect(`/my/article`)
    }
  }
  