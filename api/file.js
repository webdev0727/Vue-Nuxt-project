import api from '@/utils/request'

export function fileUpload(data) {
  return api({
    url: "/company/uploadfile",
    method: 'POST',
    data
  })
}
export function fileDel(company_id, ids) {
  return api({
    url: "/company/deletefile",
    method: 'POST',
    data:{
      company_id,
      ids
    }
  })
}
export function assetDel(id) {
  return api.delete(`/asset/${id}`)
}
export function fileList(company_id, subtag) {
  return api.get(`/company/${company_id}/files/${subtag}`)
}

