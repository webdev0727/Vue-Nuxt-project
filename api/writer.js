import request from '@/utils/request'

export function addWriter(data) {
  return request({
    url: '/writer',
    method: 'POST',
    data
  })
}

export function getList(type='all', data) {
  return request({
    url: `/writer/list/${type}`,
    method: 'POST',
    data
  })
}

export function getDetail(id) {
  return request({
    url: '/writer/'+id,
    method: 'GET'
  })
}

// "follow", "unfollow"
export function actionWriter(action_type, id) {
  return request({
    url: `/writer/${id}/${action_type}`,
    method: 'GET'  
  })
}
