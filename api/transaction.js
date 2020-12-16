import api from '@/utils/request'

export function getTransactionList(params) {
  return api({
    url: '/transaction',
    method: 'GET',
    params
  })
}


