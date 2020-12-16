import api from '@/utils/request'
/* 
mode: { 1: article, 2: discovery, 3: product }

LIKE => GET /comment/like/{mode}/{comment_id}  =>  { likes : comment.likes, my_like: comment.my_like }
(Toggle Enable) 

ANSWER => POST /comment/answer, {mode, comment_id, answer} => {answers: comment.answers}

*/
export function getList(mode, params) {
  return api({
    url: '/comment/' + mode,
    method: 'GET',
    params
  })
}

//mode: product | article | discover
export function getComments(mode, source_id, params) {
  return api({
    url: `/comment/${mode}/${source_id}`,
    method: 'GET',
    params
  })
}

// mode, comment_id, answer
export function doAnswer(data) {
  return api({
    url: '/comment/answer',
    method: 'POST',
    data
  })
}
// 
export function toggleLike(mode, comment_id) {
  return api({
    url: `/comment/like/${mode}/${comment_id}`,
    method: 'GET'
  })
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

