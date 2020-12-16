import api from '@/utils/request'

export function getStep(type="seller", step='-1', params={}) {
    return api({
        url: `/trade/${type}/applicant/${step}`,
        method: 'GET',
        params
      }) 
}

export function applyStep(type, step, data) {
    return api({
      url: `/trade/${type}/applicant/${step}`,
      method: 'POST',
      data
    })
}
export function makeBuyerFriend(data) {
    return api({
      url: `/expobuyerfriend`,
      method: 'POST',
      data
    })
}
export function getBuyerExpoList() {
    return api.get(`/trade/buyer/applicant`) 
}
export function myExpo() {
    return api.get('/trade/seller/myexpo') 
}
export function myExpoList() {
    return api.get('/trade/seller/office/0?expo_id=0') 
}
export function myExpoOffice(type, expo_id) {
    return api.get(`/trade/seller/office/${type}?expo_id=${expo_id}`) 
}

/* 
My Expo History
POST trade/seller/history/{expo_seller.id}/{"image" / "video"}, 
FormData{file, description_zh, description_en} => items[]

*/

export function AddMyExpoHistory(expo_seller_id, tag, data) {
    return api({
      url: `/trade/seller/history/${expo_seller_id}/${tag}`,
      method: 'POST',
      data
    })
}
export function GetMyExpoHistory(expo_seller_id, tag, params) {
    return api({
      url: `/trade/seller/history/${expo_seller_id}/${tag}`,
      method: 'GET',
      params
    })
}
export function DelMyExpoHistory(expo_seller_id, tag, id) {
    return api({
      url: `/trade/seller/history/${expo_seller_id}/${tag}/${id}`,
      method: 'DELETE'
    })
}


// badge
export function AddExpoBadge(data) {
    return api({
      url: `/expobadge`,
      method: 'POST',
      data
    })
}
export function DetailExpoBadge(id) {
    return api.get('/expobadge/'+id)     
}

export function AddExpoAds(data) {
    return api({
        url: `/expoaddition`,
        method: 'POST',
        data
    })
}
export function AddExpoFascia(data) {
    return api({
        url: `/expolintel`,
        method: 'POST',
        data
    })
}
export function AddExpoProceedings(data) {
    return api({
        url: `/expoproceed`,
        method: 'POST',
        data
    })
}

// expobuyerbus
export function getExpoBuyerBus() {
    return api.get(`/expobuyerbus`) 
}
export function detailExpoBuyerBus(id) {
    return api.get(`/expobuyerbus/${id}`) 
}

export function addExpoBuyerBus(data) {
    return api({
        url: `/expobuyerbus`,
        method: 'POST',
        data
    })
}

// expo detail content
export function getContent(exponame, expotype) {
    return api.get(`/expocontent/${exponame}/${expotype}`)
}

export function getExpo(exponame) {
    return api.get(`/expo/${exponame}`)
}
export function getExpoNewsList(expoid, params) {
    return api({
        url: `/expo/newslist/${expoid}`,
        method: 'GET',
        params
      }) 
}
export function getExpoCompany(expoid, hallname, params) {
    return api({
        url: `/expo/hall/company/${expoid}/${hallname}`,
        method: 'GET',
        params
    })
}
export function getHallDetail(id) {
    return api({
      url: '/common/hall/'+id,
      method: 'GET',
    })
  }
// Get Review
// expocontent/id/{expo_id}/{type}
  