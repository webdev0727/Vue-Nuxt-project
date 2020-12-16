import api from '@/utils/request'

export function getCategory() {
  return api.get('/category')
}
export function getUnits(data) {
  return api({
    url: '/common/list',
    method: 'POST',
    data
  })
}

export function doCollect(tag, source_id) {
  return api({
    url: '/collect',
    method: 'POST',
    data:{
      source_id,
      tag
    }
  })
}
export function delCollect(tag, source_id) {
  return api({
    url: `/collect/${tag}/${source_id}`,
    method: 'DELETE'    
  })
}
export function toggleCollect(tag, source_id) {
  return api({
    url: `/collect-toggle`,
    method: 'POST',
    data: {
      tag,
      source_id
    }  
  })
}
export function getCollection(tag, data) {
  return api({
    url: '/collect/' + tag,
    method: 'POST',
    data
  })
}
export function getAds(lists) {
  return api({
    url: '/common/ad',
    method: 'POST',
    data: {lists}
  })
}
export function getAdsProductLike(data) {
  return api({
    url: '/common/ad',
    method: 'POST',
    data
  })
}
