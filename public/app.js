parcelRequire=function(e,r,n,t){var i="function"==typeof parcelRequire&&parcelRequire,o="function"==typeof require&&require;function u(n,t){if(!r[n]){if(!e[n]){var f="function"==typeof parcelRequire&&parcelRequire;if(!t&&f)return f(n,!0);if(i)return i(n,!0);if(o&&"string"==typeof n)return o(n);var c=new Error("Cannot find module '"+n+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[n][1][r]||r};var l=r[n]=new u.Module(n);e[n][0].call(l.exports,p,l,l.exports,this)}return r[n].exports;function p(e){return u(p.resolve(e))}}u.isParcelRequire=!0,u.Module=function(e){this.id=e,this.bundle=u,this.exports={}},u.modules=e,u.cache=r,u.parent=i,u.register=function(r,n){e[r]=[function(e,r){r.exports=n},{}]};for(var f=0;f<n.length;f++)u(n[f]);if(n.length){var c=u(n[n.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=c:"function"==typeof define&&define.amd?define(function(){return c}):t&&(this[t]=c)}return u}({"TVxt":[function(require,module,exports) {
const e=require("dockerode"),o=new e({socketPath:"/var/run/docker.sock"}),r=e=>{o.pull(e,(e,o)=>new Promise((r,c)=>{o&&c(o),r(e)}))};module.exports={pull:r};
},{}],"GxBQ":[function(require,module,exports) {
const e=require("../middleware/docker-promise"),s=require("express"),t=s.Router();t.post("/create/:name",(s,t)=>{(async s=>{return null===s.match(/(.+):robaas/)&&Promise.reject("This image is not adapted to RoBaaS"),await e.pull(s).catch(e=>Promise.reject(e))})(s.params.name).then(e=>{s.statusCode,JSON.stringify(e);t.json(JSON.stringify(e))}).catch(e=>{t.json(JSON.stringify({status:!1,code:s.statusCode,message:e}))})}),module.exports=t;
},{"../middleware/docker-promise":"TVxt"}],"A2T1":[function(require,module,exports) {
const e=require("express"),i=require("swagger-jsdoc"),r=require("./config/routing/container"),n={swaggerDefinition:{info:{title:"RoBaaS"}},apis:["./index.js"]},o=e(),s=i(n);o.use("/container",r),o.use((e,i,r)=>{i.header("Access-Control-Allow-Origin","*"),i.header("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept"),r()}),module.exports=o.listen(3e3);
},{"./config/routing/container":"GxBQ"}]},{},["A2T1"], null)
//# sourceMappingURL=/app.map