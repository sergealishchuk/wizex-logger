const _ = require("lodash");
const { Projects } = require('../../../models');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const {
  createErrorMessage,
} = require('../../../utils');
const config = require('../../../config/config');

const { JWT_SECRET_KEY } = process.env;

const { frontend: { host }, server: { baseUrl } } = config;

const wizexCode = 'var wToken="_wToken_",remoteUrl="_remoteUrl_",wSessionId="_wSessionId_",HttpRequest={request:function(e){"string"==typeof e&&(e={url:e}),e.url=e.url||"",e.method=e.method||"get",e.data=e.data||{};var t=function(e,t){var s,r=[];for(var a in e)r.push(a+"="+encodeURIComponent(e[a]));return""!=(s=r.join("&"))?t?0>t.indexOf("?")?"?"+s:"&"+s:s:""};return({host:{},process:function(e){var s=this;return this.xhr=null,window.ActiveXObject?this.xhr=new ActiveXObject("Microsoft.XMLHTTP"):window.XMLHttpRequest&&(this.xhr=new XMLHttpRequest),this.xhr&&(this.xhr.onreadystatechange=function(){if(4==s.xhr.readyState&&200==s.xhr.status){var t=s.xhr.responseText;!0===e.json&&"undefined"!=typeof JSON&&(t=JSON.parse(t)),s.doneCallback&&s.doneCallback.apply(s.host,[t,s.xhr])}else 4==s.xhr.readyState&&s.failCallback&&s.failCallback.apply(s.host,[s.xhr]);s.alwaysCallback&&s.alwaysCallback.apply(s.host,[s.xhr])}),"get"==e.method?this.xhr.open("GET",e.url+t(e.data,e.url),!0):(this.xhr.open(e.method,e.url,!0),this.setHeaders({"X-Requested-With":"XMLHttpRequest","Content-type":"application/json; charset=utf-8"})),e.headers&&"object"==typeof e.headers&&this.setHeaders(e.headers),setTimeout(function(){"get"==e.method?s.xhr.send():s.xhr.send(JSON.stringify(e.data))},20),this},done:function(e){return this.doneCallback=e,this},fail:function(e){return this.failCallback=e,this},always:function(e){return this.alwaysCallback=e,this},setHeaders:function(e){for(var t in e)this.xhr&&this.xhr.setRequestHeader(t,e[t])}}).process(e)}};"undefined"==typeof window||window.Wizex||(window.Wizex={log:function(e){let t="object"!=typeof e&&"undefined"!==String(e)?{message:e}:e;HttpRequest.request({url:remoteUrl,method:"post",data:t,headers:{"X-WIZEX":wToken,"X-WIZEX-SESSION-ID":wSessionId}})}});';
const wizexError = '"undefined"==typeof window||window.Wizex||(window.Wizex={log:function(){console.error("LOGGER: Invalid key or token is corrupted. Contact the administrator for help.")}});';
const wizexNotActive = '"undefined"==typeof window||window.Wizex||(window.Wizex={log:function(){}});'

module.exports = async (req, res) => {
  const {
    query: { key },
  } = req;
  try {
    const result = await Projects.findOne({
      where: {
        apiKey: key,
      },
      raw: true,
    });

    let TokenIsValid = false;
    let projectIsActive = false;

    if (result) {
      const { token, active } = result;
      projectIsActive = active;
      try {
        tokenPayload = jwt.verify(token, JWT_SECRET_KEY);
        TokenIsValid = true;
      } catch (e) { }
    }

    res.writeHead(200, { "Content-Type": "text/html" });
    let scriptCode;

    if (!active) {
      scriptCode = wizexNotActive
    } else if (!TokenIsValid) {
      scriptCode = wizexError
    } else {
      scriptCode = wizexCode
        .replace('_wToken_', token)
        .replace('_wSessionId_', uuidv4())
        .replace('_remoteUrl_', `${host}${baseUrl}/loghook`);
    }

    res.write(scriptCode);
    res.end();
  } catch (e) {
    console.log(e);
    res.status(400).json(
      {
        error: createErrorMessage("Error get script"),
        ERROR_CODE: "ERROR_GET_SCRIPT"
      }
    );
  }
};


/*
  // https://krasimirtsonev.com/blog/article/Cross-browser-handling-of-Ajax-requests-in-absurdjs
  // https://www.toptal.com/developers/javascript-minifier
*/
