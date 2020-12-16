export default function ({ store, redirect, route }) {
    // If the user is not authenticated
    if (!store.state.auth.company_id) {
      return redirect(`/my/sell/company_info?redirect=${route.path}`)
    }
  }
  