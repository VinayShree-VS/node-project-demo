const fs = require("fs");
const {formateDate} = require("../utility/common_utils");

function logReqRes(fileName){
    return (req,res,next)=>{
        if(req.url === "/favicon.ico") return res.end();
        const log = `[${formateDate(Date.now())}] ${req.method} - ${req.url} New Request Recived \n`;
        fs.appendFile(fileName,log,(err,data)=>{
            next();
        });
    };
};

module.exports = {logReqRes};