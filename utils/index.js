/**
 * Created by Orion on 16/05/20.
 */

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
      time = parseInt(time)
    }
    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }
    return value.toString().padStart(2, '0')
  })
  return time_str
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
      time = parseInt(time)
      // time = +time
    }
  }
  // console.log(time)
  // console.log(this.$i18n.locale, this.$t('purchase'))
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    // return '刚刚'
    return this.$t('time.just')
  } else if (diff < 3600) {
    // return Math.ceil(diff / 60) + '分钟前'
    return Math.ceil(diff / 60) + this.$t('time.mm_ago')
  } else if (diff < 3600 * 24) {
    // return Math.ceil(diff / 3600) + '小时前'
    return Math.ceil(diff / 3600) + this.$t('time.hh_ago')
  } else if (diff < 3600 * 24 * 2) {
    // return '1天前'
    return this.$t('time.dd_ago')
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function getQueryObject(url) {
  url = url == null ? window.location.href : url
  const search = url.substring(url.lastIndexOf('?') + 1)
  const obj = {}
  const reg = /([^?&=]+)=([^?&=]*)/g
  search.replace(reg, (rs, $1, $2) => {
    const name = decodeURIComponent($1)
    let val = decodeURIComponent($2)
    val = String(val)
    obj[name] = val
    return rs
  })
  return obj
}

/**
 * @param {string} input value
 * @returns {number} output value
 */
export function byteLength(str) {
  // returns the byte length of an utf8 string
  let s = str.length
  for (var i = str.length - 1; i >= 0; i--) {
    const code = str.charCodeAt(i)
    if (code > 0x7f && code <= 0x7ff) s++
    else if (code > 0x7ff && code <= 0xffff) s += 2
    if (code >= 0xDC00 && code <= 0xDFFF) i--
  }
  return s
}

/**
 * @param {Array} actual
 * @returns {Array}
 */
export function cleanArray(actual) {
  const newArray = []
  for (let i = 0; i < actual.length; i++) {
    if (actual[i]) {
      newArray.push(actual[i])
    }
  }
  return newArray
}

/**
 * @param {Object} json
 * @returns {Array}
 */
export function param(json) {
  if (!json) return ''
  return cleanArray(
    Object.keys(json).map(key => {
      if (json[key] === undefined) return ''
      return encodeURIComponent(key) + '=' + encodeURIComponent(json[key])
    })
  ).join('&')
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse(
    '{"' +
    decodeURIComponent(search)
    .replace(/"/g, '\\"')
    .replace(/&/g, '","')
    .replace(/=/g, '":"')
    .replace(/\+/g, ' ') +
    '"}'
  )
}

/**
 * @param {string} val
 * @returns {string}
 */
export function html2Text(val) {
  const div = document.createElement('div')
  div.innerHTML = val
  return div.textContent || div.innerText
}

/**
 * Merges two objects, giving the last one precedence
 * @param {Object} target
 * @param {(Object|Array)} source
 * @returns {Object}
 */
export function objectMerge(target, source) {
  if (typeof target !== 'object') {
    target = {}
  }
  if (Array.isArray(source)) {
    return source.slice()
  }
  Object.keys(source).forEach(property => {
    const sourceProperty = source[property]
    if (typeof sourceProperty === 'object') {
      target[property] = objectMerge(target[property], sourceProperty)
    } else {
      target[property] = sourceProperty
    }
  })
  return target
}

/**
 * @param {HTMLElement} element
 * @param {string} className
 */
export function toggleClass(element, className) {
  if (!element || !className) {
    return
  }
  let classString = element.className
  const nameIndex = classString.indexOf(className)
  if (nameIndex === -1) {
    classString += '' + className
  } else {
    classString =
      classString.substr(0, nameIndex) +
      classString.substr(nameIndex + className.length)
  }
  element.className = classString
}

/**
 * @param {string} type
 * @returns {Date}
 */
export function getTime(type) {
  if (type === 'start') {
    return new Date().getTime() - 3600 * 1000 * 24 * 90
  } else {
    return new Date(new Date().toDateString())
  }
}

/**
 * This is just a simple version of deep copy
 * Has a lot of edge cases bug
 * If you want to use a perfect deep copy, use lodash's _.cloneDeep
 * @param {Object} source
 * @returns {Object}
 */
export function deepClone(source) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'deepClone')
  }
  const targetObj = source.constructor === Array ? [] : {}
  Object.keys(source).forEach(keys => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = deepClone(source[keys])
    } else {
      targetObj[keys] = source[keys]
    }
  })
  return targetObj
}

/**
 * @param {Array} arr
 * @returns {Array}
 */
export function uniqueArr(arr) {
  return Array.from(new Set(arr))
}

/**
 * @returns {string}
 */
export function createUniqueString() {
  const timestamp = +new Date() + ''
  const randomNum = parseInt((1 + Math.random()) * 65536) + ''
  return (+(randomNum + timestamp)).toString(32)
}

/**
 * Check if an element has a class
 * @param {HTMLElement} elm
 * @param {string} cls
 * @returns {boolean}
 */
export function hasClass(ele, cls) {
  return !!ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'))
}

/**
 * Add class to element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function addClass(ele, cls) {
  if (!hasClass(ele, cls)) ele.className += ' ' + cls
}

/**
 * Remove class from element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function removeClass(ele, cls) {
  if (hasClass(ele, cls)) {
    const reg = new RegExp('(\\s|^)' + cls + '(\\s|$)')
    ele.className = ele.className.replace(reg, ' ')
  }
}
/**
 * Convert graphql query with object
 * @param {HTMLElement} elm
 * @param {string} cls
 */

export function gsv(p, o) {
  return p.reduce((xs, x) => (xs && xs[x]) ? xs[x] : null, o)
}

export function isImage(content_type) {
  let is_video = false
  if (content_type) {
    is_video = !!(content_type.search(/^image\//g) + 1)
  }
  return is_video
}
export function isVideo(content_type) {
  let is_video = false
  if (content_type) {
    is_video = !!(content_type.search(/^video\//g) + 1)
  }
  return is_video
}

export function getImg1(assets) {
  let url_img = '/images/ant404.png'
  if (assets) {
    if (typeof assets == 'object') {
      if (assets.length) {
        assets.forEach(asset => {
          if (isImage(asset.content_type)) {
            url_img = asset.url
            return url_img
          }
        });
      }
    }
  }
  return url_img
}


// for Vux store
export function getUserInfo(user) {  
  let  company = {
      name: gsv(['company', 'name'], user),
      address: gsv(['company', 'address'], user),
      country_id: gsv(['company', 'country', 'id'], user),
      country_code: gsv(['company', 'country_code'], user),
      region_id: gsv(['company', 'region_id'], user),
      city_id: gsv(['company', 'city_id'], user),
      phone: gsv(['company', 'phone'], user),
      fax: gsv(['company', 'fax'], user),
      website: gsv(['company', 'website'], user),
      second_domain: gsv(['company', 'second_domain'], user),
      postal: gsv(['company', 'postal'], user),
      count_expos: gsv(['company', 'count_expos'], user),
      status: gsv(['company', 'status'], user),
      status_active: gsv(['company', 'status_active'], user),
    }    
  
  return {
    id: user.id,
    admin_id: user.admin_id,
    name: user.name,
    user_name: user.user_name,
    phone_prefix: user.phone_prefix,
    phone: user.phone,
    position: user.position,
    email: user.email,
    company,
    company_id: user.company_id || 0,
    company_name:  user.company_name,
    company_phone:  user.company_phone,
    company_fax:  user.company_fax,
    company_addr: user.company_addr,
    company_country_id: gsv(['company_country', 'id'], user),
    company_country_code: user.company_country_code,
    company_region_id: user.company_region_id,
    company_city_id:  user.company_city_id,
    company_website:  user.company_website,
    gender: user.gender,
    avatar: { url: user.avatarurl },
    collections: user.collections, 
    writer_avatar: gsv(['avatar', 'url'], user.writer),
    status_verified: user.status_verified,
    status_writer: user.status_writer,
    vip_id: gsv(['vip_id'], user.vipinfo),
    vip_id_pending: gsv(['vip_id'], user.pvip),
    vip_transaction_id: gsv(['transaction_id'], user.pvip),
    email_subscribe: gsv(['email'], user.subscribe),
    openid: user.openid,
  }
}

// build query
// data{
//   name:{"zh":"ZhName", "en":"EnName"}
// }
// to
// data{
//   name:{"zh":"ZhName", "en":"EnName"},
//    name_zh: "ZhName",
//    name_en: "EnName"
// }
export function buildQuery(obj_v) {
  if (typeof obj_v != 'object') return null
  // let obj = Object.assign({}, obj_v)
  let obj = obj_v
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const el = obj[key];
      if (typeof el == 'object' && el) {
        let keys = Object.keys(el)
        if (!el.hasOwnProperty('zh') && !el.hasOwnProperty('en')){

        }else{
          if (el.hasOwnProperty('zh')) {
            // console.log(key+"_zh")
            obj[key + "_zh"] = el['zh']
          }else{
            obj[key + "_zh"] = el['en']
          }
          if (el.hasOwnProperty('en')) {
            obj[key + "_en"] = el['en']
          }else{
            obj[key + "_en"] = el['zh']
          }
        }
      }
    }
  }
  return obj
}

export function getNames(categories) {
  if (!categories) return ''
  let str_cate = []
  categories.forEach(cate => {
      str_cate.push(gsv([this.$i18n.locale], cate.name))
  });
  return str_cate.join(', ')
}

/**
 * Get id from  SEO query
 * @param {String} "/company/book-cate2-student.id"
 * @param {number} id
 */
export function buidString(name1) {
  var name = name1
  if (name){
    name = name.replace(/\/+/g, '-')
    name = name.replace(/\s+/g, '-')
  } 
  return name
}
/**
 * Get id from  SEO query
 * @param {String} "/company/book-cate2-student.id"
 * @param {number} id
 */
export function getId(route) {
  const dd= route.split('.')
  const temp_id = dd[0]
  if (/^\d+$/.test(temp_id)) return temp_id
  else return false
}
/**
 * build SEO query
 * @param {String} "/company/id.comapny_name-brand_zh-brand_en"
 * @param {number} id
 * gsv(['name'], item.region), gsv(['name', 'en'], item.mgmodel),gsv(['name', 'zh'], item.mgmodel),
 */
export function getSeoCompany(item){
  // var seo_arr = [item.name.zh, item.major_brand.en, item.major_brand.zh]
  // const brand_en = item.major_brand.en.split(',').filter(rr=>rr).join('-')
  // const brand_zh = item.major_brand.zh.split(',').filter(rr=>rr).join('-')
  // return `/company/${item.id}.${[item.name.zh, brand_en, brand_zh].join('-')}`
  return `/company/${item.id}.${buidString(item.name.en)}`
}
/**
 * build SEO query
 * @param {String} "/product/book-cate2-student.id"
 * @param {number} id
 */
export function getSeoProduct(item){ 
  //  , buidString(gsv(['name', 'en'], item.company))
  var seo_arr = [buidString(item.name.en)]
  seo_arr = seo_arr.filter(rr=>rr)
  return `/product/${item.id}.${seo_arr.join('-')}`
}