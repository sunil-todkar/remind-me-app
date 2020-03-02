// This is main process of Electron, started as first thing when your
// app starts. It runs through entire life of your application.
// It doesn't have any windows which you can see on screen, but we can open
// window from here.

import path from "path";
import url from "url";
import { app, BrowserWindow, Tray, Menu, nativeImage } from "electron";
import { devMenuTemplate } from "./menu/dev_menu_template";
import createWindow from "./helpers/window";
import env from "env";

const AutoLaunch = require("auto-launch");
const prompt = require("electron-prompt");
var fs = require("fs");
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const homePath = app.getPath("appData");
const folderName = `${homePath}/Clarion_RemindMe_App`;
const iconPath = path.join(__dirname, "../build/icon.png");
const trayIconPath = path.join(__dirname, "icon.png");
let tray = null;
let mainWindow;
let parser = require("xml2js").parseString;
let object2xml = require("object-to-xml");
let affirmArray = [];

// Save userData in separate folders for each environment.
// Thanks to this you can use production and development versions of the app
// on same machine like those are two separate apps.
if (env.name !== "production") {
  const userDataPath = app.getPath("userData");
  app.setPath("userData", `${userDataPath} (${env.name})`);
}

app.on("ready", () => {
  app.setAppUserModelId(" ");
  mainWindow = createWindow("main", {
    width: 1000,
    height: 600,
    show: false,
    icon: path.join(__dirname, "../build/icon.png")
  });

  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "app.html"),
      protocol: "file:",
      slashes: true
    })
  );

  if (env.name === "development") {
    mainWindow.openDevTools();
  }
});

let parsingXML = response => {
  var myXMLData;
  parser(response, (err, data) => {
    if (data) {
      let res =
        data["s:Envelope"]["s:Body"][0]["GetAffirmationsResponse"][0][
          "GetAffirmationsResult"
        ][0]["a:string"];

      res.forEach(element => {
        let jjj = element.split("=")[2].split("/&gt;")[0];
        affirmArray.push(`${jjj}`);
      });
      let fileContent = { ...affirmArray };

      myXMLData = object2xml(fileContent);
    }
  });
  return myXMLData;
};

// open email dialog
app.on("ready", () => {
  let myFilePath = `${homePath}/Clarion_RemindMe_App`;
  console.log("myFilePath", myFilePath);
  if (!fs.existsSync(folderName)) {
    prompt({
      label: "Please Enter Your Email Id",
      value: "",
      alwaysOnTop: true,
      menuBarVisible: false,
      icon: iconPath,
      inputAttrs: {
        type: "email",
        required: true
      },
      type: "input"
    })
      .then(res => {
        if (res === null) {
        } else {
          let regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          let validEmail = false;
          validEmail = regEx.test(String(res).toLowerCase());
          if (validEmail) {
            try {
              if (!fs.existsSync(folderName)) {
                fs.mkdirSync(folderName, { recursive: true });
                fs.writeFile(`${myFilePath}/userConfig.txt`, res, err => {
                  if (err) {
                    console.log(
                      "An error ocurred creating the file " + err.message
                    );
                  }
                  getXMLData();
                });
              } else {
              }
            } catch (err) {
              console.error(err);
            }
          } else {
            return false;
          }
        }
      })
      .catch(console.error);
  } else {
    getXMLData();
  }
});

// read email file and post it
function getXMLData() {
  fs.readFile(`${folderName}/userConfig.txt`, "utf-8", (err, data) => {
    if (err) {
      console.log("An error ocurred reading the file :" + err.message);
      return;
    } else {
      const body = `<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">
      <s:Body>
          <GetAffirmations xmlns="http://tempuri.org/">
              <emailId>${data}</emailId>
          </GetAffirmations>
      </s:Body>
      </s:Envelope>`;
      const baseURL = "http://192.168.120.123:8080/RemindMeService.svc";

      const Http = new XMLHttpRequest();
      Http.open("POST", baseURL);
      Http.setRequestHeader(
        "SoapAction",
        "http://tempuri.org/IRemindMeService/GetAffirmations"
      );
      Http.setRequestHeader("Content-Type", "text/xml");
      Http.send(body);

      Http.onreadystatechange = function() {
        let AffirmationFullPath = `${folderName}/AffirmationMessages`;

        if (Http.readyState == 4) {
          if (this.status === 200) {
            let xmlData = parsingXML(Http.responseText);
            console.log("****xml data ****", xmlData);

            // Write Affirmations File Here
            try {
              if (!fs.existsSync(AffirmationFullPath)) {
                fs.mkdirSync(AffirmationFullPath, { recursive: true });
                fs.writeFile(
                  `${AffirmationFullPath}/AffirmationMessages.xml`,
                  xmlData,
                  err => {
                    if (err) {
                      console.log(
                        "An error ocurred creating the file " + err.message
                      );
                    }

                    mainWindow.reload();

                    // send mypath to preload.js
                    mainWindow.webContents.on("did-finish-load", () => {
                      mainWindow.webContents.send("pingPath", homePath);
                    });
                  }
                );
              }
            } catch (err) {
              console.error(err);
            }
          } else {
            // Write Error File Here
            try {
              if (!fs.existsSync(AffirmationFullPath)) {
                fs.mkdirSync(AffirmationFullPath, { recursive: true });
                fs.writeFile(
                  `${AffirmationFullPath}/ErrorLog.txt`,
                  Http.statusText,
                  err => {
                    if (err) {
                      console.log(
                        "An error ocurred creating the file " + err.message
                      );
                    }

                    mainWindow.reload();

                    // send mypath to preload.js
                    mainWindow.webContents.on("did-finish-load", () => {
                      mainWindow.webContents.send("pingPath", homePath);
                    });
                  }
                );
              } else {
                fs.writeFile(
                  `${AffirmationFullPath}/ErrorLog.txt`,
                  Http.statusText,
                  err => {
                    if (err) {
                      console.log(
                        "An error ocurred creating the file " + err.message
                      );
                    }

                    mainWindow.reload();

                    // send mypath to preload.js
                    mainWindow.webContents.on("did-finish-load", () => {
                      mainWindow.webContents.send("pingPath", homePath);
                    });
                  }
                );
              }
            } catch (err) {
              console.error(err);
            }
          }
        }
      };
    }
  });
}

// auto launch
app.on("ready", () => {
  let autoLaunch = new AutoLaunch({
    name: "Remind Me 0.0.0",
    path: app.getPath("exe")
  });
  autoLaunch.isEnabled().then(isEnabled => {
    if (!isEnabled) autoLaunch.enable();
  });
});

// Tray icon
app.on("ready", () => {
  tray = new Tray(nativeImage.createFromPath(trayIconPath));
  console.log("Tray Icon", trayIconPath);
  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Suspend for 30 min",
      click: function() {
        mainWindow.webContents.send("time", 1800000);
      }
    },
    {
      label: "Update Affirmations",
      click: function() {
        mainWindow.webContents.send("time", 0);
      }
    }
  ]);
  tray.setToolTip("Remind-Me");
  tray.setContextMenu(contextMenu);
});

// Single Instance
/** Check if single instance, if not, simply quit new instance */
let isSingleInstance = app.requestSingleInstanceLock();
if (!isSingleInstance) {
  app.quit();
}
// Behaviour on second instance for parent process- Pretty much optional
app.on("second-instance", (event, argv, cwd) => {
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
  }
});

app.on("window-all-closed", () => {
  app.quit();
});
