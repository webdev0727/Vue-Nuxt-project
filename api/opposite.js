import api from '@/utils/request'

export function getList(type, data) {
  return api({
    url: '/trade/opposite/' + type,
    method: 'POST',
    data
  })
}

// ============= Group ====================================
export function getGroupList(type) {
  return api({
    url: '/trade/opposite/group/' + type,
    method: 'GET'    
  })
}

//  "id": 17,
//  "isbuyer":"0",
//  "name":"Group 1 (changed)"
export function upsertGroup(data) {
  return api({
    url: '/trade/opposite-group',
    method: 'POST',
    data
  })
}
export function delGroup(ids) {
  return api({
    url: '/trade/opposite/group',
    method: 'DELETE',
    data:{ids}
  })
}

// ============= add buyer or seller ====================================
/* "opposite_id": "45",
    "isbuyer":"1",
    "opposite_group_id":"1" */
export function add(data) {
  return api({
    url: '/trade/opposite',
    method: 'POST',
    data   
  })
}

export function del(ids) {
  return api({
    url: '/trade/opposite',
    method: 'DELETE',
    data:{ids}
  })
}
