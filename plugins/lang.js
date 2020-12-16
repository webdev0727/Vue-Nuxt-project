export default (context, inject)=>{
    // const hello=(msg)=>console.log(`Hello ${msg}!`)
    // console.log("lang plugin", context.app.$lang)
    const ll={"new": "NEW"}
    inject('lang', ll)
    context.$lang=ll
}