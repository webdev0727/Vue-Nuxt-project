import api from '@/utils/request'

export function getList(type, data) {
  return api({
    url: '/trade/purchase/'+type,
    method: 'POST',
    data
  })
}

export function getDetail(id) {
  return api.get('/purchase/'+id) 
}

export function add(data) {
  return api({
    url: '/purchase/store',
    method: 'POST',
    data
  })
}

export function del(ids) {
  return api({
    url: '/purchase',
    method: 'DELETE',
    data:{ids}
  })
}

export function offer(data) {
  return api({
    url: '/purchase/offer/store',
    method: 'POST',
    data
  })
}

export function offer_detail(id) {
  return api.get('/purchase/offer/'+id)
}

export function myoffer(pid) {
  return api.get(`/purchase/${pid}/offer`)
}
export function myofferDone(id) {
  return api.get(`/purchase/${id}/done`)
}

export function offer_del(ids) {
  return api({
    url: '/purchase/offer',
    method: 'DELETE',
    data:{ids}
  })
}
