parcelRequire=function(e,r,n,t){var i="function"==typeof parcelRequire&&parcelRequire,o="function"==typeof require&&require;function u(n,t){if(!r[n]){if(!e[n]){var f="function"==typeof parcelRequire&&parcelRequire;if(!t&&f)return f(n,!0);if(i)return i(n,!0);if(o&&"string"==typeof n)return o(n);var c=new Error("Cannot find module '"+n+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[n][1][r]||r};var l=r[n]=new u.Module(n);e[n][0].call(l.exports,p,l,l.exports,this)}return r[n].exports;function p(e){return u(p.resolve(e))}}u.isParcelRequire=!0,u.Module=function(e){this.id=e,this.bundle=u,this.exports={}},u.modules=e,u.cache=r,u.parent=i,u.register=function(r,n){e[r]=[function(e,r){r.exports=n},{}]};for(var f=0;f<n.length;f++)u(n[f]);if(n.length){var c=u(n[n.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=c:"function"==typeof define&&define.amd?define(function(){return c}):t&&(this[t]=c)}return u}({"TVxt":[function(require,module,exports) {
const e=require("dockerode"),o=new e({socketPath:"/var/run/docker.sock"}),r=e=>{o.pull(e,(e,o)=>new Promise((r,c)=>{o&&c(o),r(e)}))};module.exports={pull:r};
},{}],"GxBQ":[function(require,module,exports) {
const e=require("../middleware/docker-promise"),s=require("express"),t=s.Router();t.post("/create/:name",(s,t)=>{(async s=>{if(null===s.match(/(.+):robaas/))return Promise.reject("This image is not adapted to RoBaaS");return await e.pull(s).catch(e=>Promise.reject(e))})(s.params.name).then(e=>{s.statusCode,JSON.stringify(e);t.json(JSON.stringify(e))}).catch(e=>{t.json(JSON.stringify({status:!1,code:s.statusCode,message:e}))})}),t.post("/",(e,s)=>s.send("aa")),module.exports=t;
},{"../middleware/docker-promise":"TVxt"}],"F1JO":[function(require,module,exports) {
const r=require("swagger-express"),i=require("fs"),e=require("path"),n=()=>{return i.readdirSync(e.join(__dirname,"../config/routing")).map(r=>e.join(__dirname,"../config/routing/"+r))},o=n=>{const o=i.readdirSync(e.join(__dirname,"../config/routing")).map(r=>e.join(__dirname,"../config/routing/"+r));console.log(o),r.init(n.app,{apiVersion:"1.0",swaggerVersion:"1.0",swaggerURL:"/docs",swaggerJSON:"/api-docs",swaggerUI:e.join(__dirname,"../swagger"),basePath:"http://localhost:3000",apis:o,middleware:(r,i)=>{}})};module.exports=o;
},{}],"A2T1":[function(require,module,exports) {
const e=require("express"),r=require("./config/routing/container"),o=require("./config/swagger"),t=e();o({app:t}),t.use("/container",r),t._router.stack.forEach(function(e){e.route&&e.route.path&&console.log(e.route.path)}),t.use((e,r,o)=>{r.header("Access-Control-Allow-Origin","*"),r.header("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept"),o()}),module.exports=t.listen(3e3);
},{"./config/routing/container":"GxBQ","./config/swagger":"F1JO"}]},{},["A2T1"], null)
//# sourceMappingURL=/app.map