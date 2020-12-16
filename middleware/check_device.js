export default function (ctx) {
  const {
    isMobile,
    isDesktop,
    redirect,
    route
  } = ctx;
  // console.log(process.env.WWW_URL)
  if (isDesktop){
    const redirect_url = process.env.WWW_URL + route.fullPath
    console.log("redirect_url ", redirect_url)
    // redirect(redirect_url)
  } 
}
