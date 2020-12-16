import api from '@/utils/request'

export function getAlipay(subject, amount) {
  return api({
    url: '/alipay',
    method: 'POST',
    data:{
      subject, amount
    }
  })
}
