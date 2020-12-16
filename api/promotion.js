import api from '@/utils/request'

export function getList() {
  return api.get('/promotion')
}

export function validUnique(contact) {
  return api({
    url: '/promotion/check',
    method: 'POST',
    data:{
      contact
    }
  })
}
export function add(data) {
  return api({
    url: '/promotion',
    method: 'POST',
    data
  })
}

