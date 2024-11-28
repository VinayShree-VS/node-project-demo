
const connectDB = require("./config/DB");
const app = require("./server");
require('dotenv').config();


const PORT = process.env.PORT || 8000;

app.listen(PORT, async ()=>{
    try {
        await connectDB(process.env.DB_URL);
        console.log(`Sever started on ${PORT}`);
      } catch (e) {
        console.log(e);
      }
});

































// const myServer = http.createServer((req, res)=>{
//     if(req.url === "/favicon.ico") return res.end();
//     const log = `${Date.now()} ${req.url} New Request Recived \n`;
//     const myUrl = url.parse(req.url);
//     console.log(myUrl);
//     console.log(req.method);
//     fs.appendFile("log.txt",log,(err,data)=>{
//         console.log(req.url);
//         if(req.url == '/'){
//             res.end("Home Page");
//         }else if(req.url == '/about'){
//             res.end("i am vinay");
//         }else{
//             res.end("404");
//         };
//     });
// });
// myServer.listen(8000,()=>{
//     console.log("Sever started on 8000");
// });