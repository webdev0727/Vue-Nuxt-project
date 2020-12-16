import request from '@/utils/request'

export function addArticle(data) {
  return request({
    url: '/discover',
    method: 'POST',
    data
  })
}

export function getList(da) {
  return request({
    url: '/discover/list',
    method: 'POST',
    data:{
      tag: 'article',
      ...da
    }
  })
}
// export function getListGuest(da) {
//   return request({
//     url: '/guest/discover/list',
//     method: 'POST',
//     data:{
//       tag: 'article',
//       ...da
//     }
//   })
// }

export function getDetail(id) {
  return request({
    url: '/guest/discover/'+id,
    method: 'GET'
  })
}
export function getArticle(type='latest_articles') {
  return request({
    url: '/article/list/' + type,
    method: 'GET'
  })
}

export function del(ids) {
  return request({
    url: '/discover',
    method: 'DELETE',
    data: {ids}
  })
}

// action_type = singnup, like, comment, collect
export function actionArticle(action_type, id) {
  return request({
    url: `/discover/${id}/${action_type}`,
    method: 'POST'  
  })
}
