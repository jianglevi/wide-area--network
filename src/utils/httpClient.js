import LoginManager from './loginManager'

const baseURL = '/Hanvon/'

// 将 json 对象参数   序列化  成  字符串
function encodedParams(params) {
  var ret = ''
  if (params) {
    for (var key in params) {
      ret += (ret ? '&' : '') + key + '=' + params[key]
    }
  }
  return ret
}

// 获取 参数  衔接 字符
function getLinkChar(url) {
  if (url.indexOf('?') > 0) {
    return '&'
  }
  return '?'
}

// 将服务器  返回的字符串  解析成  json 对象
function parseResult(text, url){
  try {
    var json = JSON.parse(text)
    // console.log('url: ', url, ' code:',json.result)
    return json
  }catch (e) {
    console.error('请求：',url , "json 解析出错！ result text:", text)
  }
  return null
}



function ajaxRequest(method, url, params, success) {
  var ajax = new XMLHttpRequest();
  //格式化参数
  var paramsString = params ? encodedParams(params) : ''
  //拼接get请求参数
  if (method === 'GET' && paramsString) {
    url += getLinkChar(url) + paramsString
  }

  //设置请求方法，请求路径,
  ajax.open(method, baseURL + url) 
  //设置请求带cookie
  ajax.withCredentials = true 

  //监听异常
  ajax.onerror = function (e) {
    // 通过发送请求到服务器，验证用户是否已登录
    LoginManager.validateLoginByRequest()
  }

  //请求发送
  if (method === 'POST') {
    ajax.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
    // post请求 发送的数据 写在 send方法中
    // 格式 name=jack&age=18 字符串的格式
    ajax.send(paramsString)
  } else {
    ajax.send()
  }

  // 监听返回。
  ajax.onreadystatechange = function () {
    var readyState =  ajax.readyState
    var status = ajax.status
    if (readyState == 4 && status == 200) {
      var ret = parseResult(ajax.responseText, url)
      if(ret.result===404){
        LoginManager.clearLoginStatus_toLoginPage()
        return
      }
      success(ret)
    }
  }

}

export default {
  get: function (url, params, success) {
    return ajaxRequest('GET', url, params, success)
  },
  post: function (url, params, success) {
    return ajaxRequest('POST', url, params, success)
  },
}
