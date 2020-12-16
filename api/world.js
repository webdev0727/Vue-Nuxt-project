import api from '@/utils/request'

export function getCountry() {
  return api.get('/world/country')
}
export function getCity(country_code) {
  return api.get('/world/country/'+country_code)
}
export function getRegionsById(country_id) {
  return api.get('/world/regions/'+country_id)
}