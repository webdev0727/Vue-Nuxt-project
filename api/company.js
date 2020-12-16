import api from '@/utils/request'

export function sList(data) {
  return api({
    url: '/company/lists',
    method: 'POST',
    data
  })
}

export function getList(data) {
  return api({
    url: '/company/searched',
    method: 'POST',
    data
  })
}

export function getDetail(id, data) {
  return api({
    url: `/company/${id}/lists`,
    method: 'POST',
    data 
  })
}
export function getHistory(id, data) {
  return api({
    url: `/company/${id}/history`,
    method: 'GET',
    data 
  })
}

export function doVisitList(company_id) {
  return api({
    url: '/company-visit',
    method: 'POST',
    data:{company_id}
  })
}

export function delVisitList(id) {
  return api.delete('/company-visit/'+id)
}
export function toggleVisit(company_id) {
  return api({
    url: '/company-visit-toggle',
    method: 'POST',
    data:{company_id}
  })
}
// export function getVisitList(params) {
//   return api({
//     url: `/company-visit`,
//     method: 'GET',
//     params 
//   })
// }
export function getVisitList(params, expoid=-1) {
  return api({
    url: `/trade/buyer/visitcompany/${expoid}`,
    method: 'GET',
    params 
  })
}
export function companySearch(c_name) {
  return api.get('/company/search?name='+c_name) 
}
