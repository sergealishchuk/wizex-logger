const _ = require("lodash");
const { ROLES } = require("../../../constants");
const { Projects, sequelize } = require('../../../models');
const { Op } = require("sequelize");
const {
  handleSequelizeErrors,
  createErrorMessage,
} = require('../../../utils');

const wizexCode = 'var wToken="_wToken_",remoteUrl="_remoteUrl_",HttpRequest={request:function(e){"string"==typeof e&&(e={url:e}),e.url=e.url||"",e.method=e.method||"get",e.data=e.data||{};var t=function(e,t){var r,a=[];for(var s in e)a.push(s+"="+encodeURIComponent(e[s]));return""!=(r=a.join("&"))?t?0>t.indexOf("?")?"?"+r:"&"+r:r:""};return({host:{},process:function(e){var r=this;return this.xhr=null,window.ActiveXObject?this.xhr=new ActiveXObject("Microsoft.XMLHTTP"):window.XMLHttpRequest&&(this.xhr=new XMLHttpRequest),this.xhr&&(this.xhr.onreadystatechange=function(){if(4==r.xhr.readyState&&200==r.xhr.status){var t=r.xhr.responseText;!0===e.json&&"undefined"!=typeof JSON&&(t=JSON.parse(t)),r.doneCallback&&r.doneCallback.apply(r.host,[t,r.xhr])}else 4==r.xhr.readyState&&r.failCallback&&r.failCallback.apply(r.host,[r.xhr]);r.alwaysCallback&&r.alwaysCallback.apply(r.host,[r.xhr])}),"get"==e.method?this.xhr.open("GET",e.url+t(e.data,e.url),!0):(this.xhr.open(e.method,e.url,!0),this.setHeaders({"X-Requested-With":"XMLHttpRequest","Content-type":"application/json; charset=utf-8"})),e.headers&&"object"==typeof e.headers&&this.setHeaders(e.headers),setTimeout(function(){"get"==e.method?r.xhr.send():r.xhr.send(JSON.stringify(e.data))},20),this},done:function(e){return this.doneCallback=e,this},fail:function(e){return this.failCallback=e,this},always:function(e){return this.alwaysCallback=e,this},setHeaders:function(e){for(var t in e)this.xhr&&this.xhr.setRequestHeader(t,e[t])}}).process(e)}};"undefined"==typeof window||window.Wizex||(window.Wizex={log:function(e){let t={};"object"!=typeof e&&"undefined"!==String(e)&&(t={message:e}),HttpRequest.request({url:remoteUrl,method:"post",data:t,headers:{"X-WIZEX":wToken}})}});';

module.exports = async (req, res) => {
  const {
    query: { key },
  } = req;
  console.log('key:', req, key);
  try {
    const result = await Projects.findOne({
      where: {
        apiKey: key,
      },
      raw: true,
    });

    if (!result) {
      return {
        error: createErrorMessage("key not found"),
      };
    }

    res.writeHead(200, { "Content-Type": "text/html" });
    // https://krasimirtsonev.com/blog/article/Cross-browser-handling-of-Ajax-requests-in-absurdjs
    // https://www.toptal.com/developers/javascript-minifier
    const str = wizexCode
      .replace('_wToken_', 'mywebtoken')
      .replace('_remoteUrl_', 'http://192.168.0.108:4223/rest/loghook');

    res.write(str);
    res.end();
  } catch (e) {
    console.log(e);
    res.status(400).json(
      {
        error: createErrorMessage("Error get article"),
        ERROR_CODE: "ERROR_GET_ARTICLE"
      }
    );
  }
};
