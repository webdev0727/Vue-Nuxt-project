import request from '@/utils/request'

export function getList() {
  return request({
    url: '/trade/seller/ads',
    method: 'GET'
  })
}

// {ads_space_id, user_name, phone, email, company_name}
export function add(data) {
  return request({
    url: '/trade/seller/ads/applicant',
    method: 'POST',
    data
  })
}

/* 
========== type: 
m_home_banner, 
m_home_center, 
m_product_banner, 
m_company_banner, 
m_article_banner, 
m_profile_center 
*/
export function getAdsBanner(type) {
  return request({
    url: '/site/ads/' + type,
    method: 'GET',
  })
}