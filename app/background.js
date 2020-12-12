!function(e){var t={};function n(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)n.d(r,o,function(t){return e[t]}.bind(null,o));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=16)}([function(e,t){e.exports=require("electron")},function(e,t){e.exports=require("fs-jetpack")},function(e,t){e.exports=require("path")},function(e){e.exports=JSON.parse('{"name":"production","description":"Add here any environment specific stuff you like."}')},function(e,t){e.exports=require("fs")},function(e,t){e.exports=require("xml2js")},function(e,t){e.exports=require("url")},function(e,t){e.exports=require("auto-launch")},function(e,t){e.exports=require("electron-prompt")},function(e,t){e.exports=require("xmlhttprequest")},function(e,t){e.exports=require("object-to-xml")},,,,,,function(e,t,n){"use strict";n.r(t);var r=n(2),o=n.n(r),i=n(6),s=n.n(i),a=n(0);var l=n(1),c=n.n(l),p=(e,t)=>{const n=c.a.cwd(a.app.getPath("userData")),r=`window-state-${e}.json`,o={width:t.width,height:t.height};let i,s={};var l;return l=(()=>{let e={};try{e=n.read(r,"json")}catch(e){}return Object.assign({},o,e)})(),s=a.screen.getAllDisplays().some(e=>((e,t)=>e.x>=t.x&&e.y>=t.y&&e.x+e.width<=t.x+t.width&&e.y+e.height<=t.y+t.height)(l,e.bounds))?l:(()=>{const e=a.screen.getPrimaryDisplay().bounds;return Object.assign({},o,{x:(e.width-o.width)/2,y:(e.height-o.height)/2})})(),i=new a.BrowserWindow(Object.assign({},t,s)),i.on("close",()=>{i.isMinimized()||i.isMaximized()||Object.assign(s,(()=>{const e=i.getPosition(),t=i.getSize();return{x:e[0],y:e[1],width:t[0],height:t[1]}})()),n.write(r,s,{atomic:!0})}),i},u=n(3);const d=n(7),f=n(8);var m=n(4),h=n(9).XMLHttpRequest;const g=a.app.getPath("appData"),y=`${g}/Clarion_RemindMe_App`,x=o.a.join(__dirname,"../build/icon.png"),b=o.a.join(__dirname,"icon.png");let w,v=null,S=n(5).parseString,A=n(10),j=[];if("production"!==u.name){const e=a.app.getPath("userData");a.app.setPath("userData",`${e} (${u.name})`)}a.app.on("ready",()=>{a.app.setAppUserModelId(" "),w=p("main",{width:1e3,height:600,show:!1,icon:o.a.join(__dirname,"../build/icon.png")}),w.loadURL(s.a.format({pathname:o.a.join(__dirname,"app.html"),protocol:"file:",slashes:!0})),"development"===u.name&&w.openDevTools()});function M(){m.readFile(`${y}/userConfig.txt`,"utf-8",(e,t)=>{if(e)console.log("An error ocurred reading the file :"+e.message);else{const e=`<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">\n      <s:Body>\n          <GetAffirmations xmlns="http://tempuri.org/">\n              <emailId>${t}</emailId>\n          </GetAffirmations>\n      </s:Body>\n      </s:Envelope>`,n="http://192.168.120.123:8080/RemindMeService.svc",r=new h;r.open("POST",n),r.setRequestHeader("SoapAction","http://tempuri.org/IRemindMeService/GetAffirmations"),r.setRequestHeader("Content-Type","text/xml"),r.send(e),r.onreadystatechange=function(){let e=`${y}/AffirmationMessages`;if(4==r.readyState)if(200===this.status){let o=(t=r.responseText,S(t,(e,t)=>{if(t){t["s:Envelope"]["s:Body"][0].GetAffirmationsResponse[0].GetAffirmationsResult[0]["a:string"].forEach(e=>{let t=e.split("=")[2].split("/&gt;")[0];j.push(`${t}`)});let e={...j};n=A(e)}}),n);console.log("****xml data ****",o);try{m.existsSync(e)||(m.mkdirSync(e,{recursive:!0}),m.writeFile(`${e}/AffirmationMessages.xml`,o,e=>{e&&console.log("An error ocurred creating the file "+e.message),w.reload(),w.webContents.on("did-finish-load",()=>{w.webContents.send("pingPath",g)})}))}catch(e){console.error(e)}}else try{m.existsSync(e)?m.writeFile(`${e}/ErrorLog.txt`,r.statusText,e=>{e&&console.log("An error ocurred creating the file "+e.message),w.reload(),w.webContents.on("did-finish-load",()=>{w.webContents.send("pingPath",g)})}):(m.mkdirSync(e,{recursive:!0}),m.writeFile(`${e}/ErrorLog.txt`,r.statusText,e=>{e&&console.log("An error ocurred creating the file "+e.message),w.reload(),w.webContents.on("did-finish-load",()=>{w.webContents.send("pingPath",g)})}))}catch(e){console.error(e)}var t,n}}})}a.app.on("ready",()=>{let e=`${g}/Clarion_RemindMe_App`;console.log("myFilePath",e),m.existsSync(y)?M():f({label:"Please Enter Your Email Id",value:"",alwaysOnTop:!0,menuBarVisible:!1,icon:x,inputAttrs:{type:"email",required:!0},type:"input"}).then(t=>{if(null===t);else{let n=!1;if(n=/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(String(t).toLowerCase()),!n)return!1;try{m.existsSync(y)||(m.mkdirSync(y,{recursive:!0}),m.writeFile(`${e}/userConfig.txt`,t,e=>{e&&console.log("An error ocurred creating the file "+e.message),M()}))}catch(e){console.error(e)}}}).catch(console.error)}),a.app.on("ready",()=>{let e=new d({name:"Remind Me 0.0.0",path:a.app.getPath("exe")});e.isEnabled().then(t=>{t||e.enable()})}),a.app.on("ready",()=>{v=new a.Tray(a.nativeImage.createFromPath(b)),console.log("Tray Icon",b);const e=a.Menu.buildFromTemplate([{label:"Suspend for 30 min",click:function(){w.webContents.send("time",18e5)}},{label:"Update Affirmations",click:function(){w.webContents.send("time",0)}}]);v.setToolTip("Remind-Me"),v.setContextMenu(e)}),a.app.requestSingleInstanceLock()||a.app.quit(),a.app.on("second-instance",(e,t,n)=>{w&&(w.isMinimized()&&w.restore(),w.focus())}),a.app.on("window-all-closed",()=>{a.app.quit()})}]);
//# sourceMappingURL=background.js.map