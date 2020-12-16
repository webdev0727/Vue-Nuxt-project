import request from '@/utils/request'

export function addDiscover(data) {
  return request({
    url: '/discover',
    method: 'POST',
    data
  })
}

export function getMyEvents(params) {
  return request({
    url: '/discover/activity/mylist',
    method: 'GET',
    params
  })
}
export function getList(da) {
  return request({
    url: '/discover/list',
    method: 'POST',
    data:{
      tag: 'activity',
      ...da
    }
  })
}

export function getDetail(id) {
  return request({
    url: '/discover/'+id,
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

// action_type = like, comment, collect
export function actionArticle(action_type, id) {
  return request({
    url: `/discover/${id}/${action_type}`,
    method: 'POST'  
  })
}
