import api from '@/utils/request'

export function getList(type, data) {
  return api({
    url: '/trade/pindan/' + type,
    method: 'POST',
    data
  })
}

export function getPindan(data) {
  return api({
    url: '/pindan/',
    method: 'POST',
    data
  })
}
export function getPindanDetail(product_id, group_id) {
  return api.get(`/pindan/product/${product_id}/${group_id}`)   
}

export function getDetail(id) {
  return api.get('/pindan/'+id) 
}

export function del(ids) {
  return api({
    url: '/pindan',
    method: 'DELETE',
    data: {ids}
  })
}


export function add(data) {
  return api({
    url: '/pindan/store',
    method: 'POST',
    data
  })
}
export function historyPindanOfProduct(product_id) {
  return api.get('/pindan/product/'+product_id)   
}
