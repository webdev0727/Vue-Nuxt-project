import api from '@/utils/request'

export function getList(params) {
  return api({
    url: '/notice',
    method: 'GET',
    params
  })
}

export function getDetail(id) {
  return api.get('/notice/'+id) 
}

// update top order of selected product
export function del(ids) {
  return api({
    url: '/notice',
    method: 'DELETE',
    data:{
      ids
    }
  })
}

