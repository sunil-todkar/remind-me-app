const fs = require("fs"),
  xml2js = require("xml2js");

let textAffMessages = [];
let parser = new xml2js.Parser();
var remindHomePath;

// Getting home path from main process
require("electron").ipcRenderer.on("pingPath", (event, message) => {
  // console.log("message", message);
  remindHomePath = message;
  fs.readFile(
    `${remindHomePath}/Clarion_RemindMe_App/AffirmationMessages/AffirmationMessages.xml`,
    function(err, data) {
      parser.parseString(data, function(err, result) {
        console.log("Result", result);
        let ApiAffMessages =
          result["s:Envelope"]["s:Body"][0]["GetAffirmationsResponse"][0][
            "GetAffirmationsResult"
          ][0]["a:string"];
        ApiAffMessages.forEach(element => {
          textAffMessages.push(element.split("=")[2].split("'")[1]);
        });
      });
    }
  );
});

const { readFileSync } = require("fs");

window.readConfig = function() {
  return textAffMessages;
};
