import api from '@/utils/request'

export function getList(data) {
  return api({
    url: '/product',
    method: 'POST',
    data
  })
}
export function getMyList(data) {
  return api({
    url: '/product/list',
    method: 'POST',
    data
  })
}
export function getCompanyProductList(data) {
  return api({
    url: '/product/list',
    method: 'POST',
    data
  })
}

export function getDetail(id) {
  return api.get('/product/'+id) 
}

export function add(data, config) {
  return api.post('/product/store', data, config)   
}

// export function update(id) {
//   return api.post('/product/'+id) 
// }

export function del(ids) {
  return api.post('/product/delete', {ids})
}

// To Recommemded Goods
export function toRecom(product_id) {
  return api({
    url: '/product/recommend',
    method: 'POST',
    data:{
      product_id
    }
  })
}
// update top order of selected product
export function toTop(ids) {
  return api({
    url: '/product/update',
    method: 'POST',
    data:{ ids }
  })
}


// __________ custom product category ____________

export function myCate() {
  return api.get('/product_custom')
}

export function myCateAdd(data) {
  return api({
    url: '/product_custom/add',
    method: 'POST',
    data
  })
}
export function myCateUpdate(data) {
  return api({
    url: '/product_custom/update',
    method: 'POST',
    data
  })
}
export function myCateDel(id) {
  return api.delete('/product_custom/'+id)
}

// --------------- recommended , latest -------------------------------

export function product_special(items) {
  return api({
    url: '/product/suggest',
    method: 'POST',
    data:{
      items
    }
  })
}

// comment
/* 
product_id
content
is_only 
*/
export function addComment(data) {
  return api({
    url: '/product/comment',
    method: 'POST',
    data
  })
}