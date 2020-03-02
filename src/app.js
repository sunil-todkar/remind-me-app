import "./stylesheets/main.css";
import "./helpers/context_menu.js";
import "./helpers/external_links.js";
import { remote } from "electron";
import jetpack from "fs-jetpack";

const fs = require("fs"),
  xml2js = require("xml2js");
const { ipcRenderer } = require("electron");

const app = remote.app;
const appDir = jetpack.cwd(app.getAppPath());
let notif;
let interval;
let _timeout;
let count = 0;
let textAffMessages = [];
let noify_time;
let parser = new xml2js.Parser();
var remindHomePath = app.getPath("appData");

const manifest = appDir.read("package.json", "json");

const osMap = {
  win32: "Windows",
  darwin: "macOS",
  linux: "Linux"
};

fs.readFile(
  `${remindHomePath}/Clarion_RemindMe_App/AffirmationMessages/AffirmationMessages.xml`,
  "utf-8",
  function(err, data) {
    console.log("data--", data);

    console.log("Result", data);
    data = data.split("'");

    data.forEach((element, index) => {
      if (index % 2 === 0) {
      } else {
        textAffMessages.push(element);
      }
    });

    interval = setInterval(() => {
      create_notification();
    }, 15000);
  }
);

function create_notification() {
  count++;
  notif = new Notification("Affirmation", {
    body: textAffMessages[count],
    silent: true,
    icon: "../app/icon.png"
  });
  if (count == textAffMessages.length - 1) {
    count = 0;
  }
  setTimeout(() => {
    notif.close();
  }, 50);
}

ipcRenderer.on("time", (event, data) => {
  if (data != 0) {
    console.log(event, typeof data);
    clearInterval(interval);
    _timeout = setTimeout(() => {
      interval = setInterval(() => {
        create_notification();
      }, 15000);
    }, data);
  } else {
    console.log(event, data);
    clearInterval(interval);
    clearTimeout(_timeout);
    interval = setInterval(() => {
      create_notification();
    }, 15000);
  }
});
// window.onload = doNotify;
