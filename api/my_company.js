import api from '@/utils/request'

export function getList() {
  return api.get('/company')
}
export function getDetail(id) {
  return api.get('/company/'+id) 
}

export function add(data) {
  return api({
    url: '/company',
    method: 'POST',
    data
  })
}
export function collect_list(data) {
  return api({
    url: '/collect/company',
    method: 'POST',
    data
  })
}

// status : route->company_news
/* 
company_id
page
limit */
export function statusList(data) {
  return api({
    url: '/company/status',
    method: 'POST',
    data
  })
}
export function statusDel(id) {
  return api({
    url: '/discover/?ids[]='+id,
    method: 'DELETE'
  })
}
export function statusAdd(data) {
  return api({
    url: '/company/status/store',
    method: 'POST',
    data
  })
}

// VIP
export function getVip() {
  return api.get('/company/vip') 
}

export function addVip(data) {
  return api({
    url: '/company/vip',
    method: 'POST',
    data
  })
}

/* 
  Cover
asset_id: 239
company_id: 8 
*/
export function setCover(company_id, asset_id) {
  return api({
    url: `/company/setcover`,
    method: 'POST',
    data:{
      company_id,
      asset_id
    } 
  })
}
