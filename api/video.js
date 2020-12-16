import api from '@/utils/request'
/* 
type:{ 
  "all", 
  "recommend", 
  "etc", 
  "company", 
  "product", 
  "activity", 
  "expo" } 
*/
export function getVideo(type, params) {
  return api({
    url: `/video/${type}`,
    method: 'GET',
    params
  })
}