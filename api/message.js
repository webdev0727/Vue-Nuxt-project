import api from '@/utils/request'

/* {
  "datatype":"sent",
  "tag":"user",
  "group_id":"0",
  "page": 1,
  "limit": 10
} 
'datatype' : sent, received, starred, trash 
'tag' : all, system, user, answer, new 
'group_id': 0 or other 
'page': 
'limit':
*/
export function getList(data) {
  return api({
    url: '/message/list',
    method: 'POST',
    data
  })
}

export function getDetail(id) {
  return api.get('/message/'+id) 
}

// get thread from reply post id
export function getThread(id) {
  return api.get('/message/read/'+id) 
}

export function toggleStar(id) {
  return api.get('/message/star/'+id) 
}

/*
 {
  "tag": 0,
  "receiver_id": 50,
  "title": "New Message",
  "content": "Message Content",
  "pid": 0,
  "is_group": 0
} 
'tag' => 'required|in:0,2', //0: user-user, 1: system-user 2: user-system 
'receiver_id' => 'required', //tag=2 => adminid else userid 
'title' => 'required', 
'content' => 'required', 
'pid' => 'required', // 0: master, other:thread 
'is_group' => 'required' // 0: no group
*/
export function sendMsg(data) {
  return api({
    url: '/message/store',
    method: 'POST',
    data
  })
}

export function del(ids) {
  return api({
    url: '/message',
    method: 'DELETE',
    data:{ids}
  })
}

// Group
export function getGroup() {
  return api.get('/messagegroup')  
}

export function setGroup(data) {
  return api({
    url: '/messagegroup/user',
    method: 'POST',
    data
  })
}