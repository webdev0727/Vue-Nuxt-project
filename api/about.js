import api from '@/utils/request'

/* 
type: {'about_us' | 'contact_us' | 'join_us' | 'terms' | privacy_policy' | 'help'}

*/
export function getList(type) {
  return api({
    url: `/sitecontent/${type}`,
    method: 'GET'
  })
}