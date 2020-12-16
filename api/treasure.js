import api from '@/utils/request'
/* { 
  "category_id": "7", 
  "created_at": "week", // week, month, 3-month 
  "delivery_date": "week", // week, month, 3-month, no-limit 
  "offer_count": "10", // 10(<=10), 30(<=30), 50(<=50), 100(>50) 
  "keyword": "asfa", 
  "with": [ "category", "user", "offers" ], 
  "page": "1", 
  "limit": "10" }
 */
export function getList(data) {
  return api({
    url: '/purchase/list',
    method: 'POST',
    data
  })
}
export function getListForGuest(data={limit:4, page:1}) {
  return api({
    // url: '/guest/purchase/list',
    url: '/purchase/list',
    method: 'POST',
    data
  })
}

export function getDetail(id) {
  return api.get('/purchase/'+id) 
}
