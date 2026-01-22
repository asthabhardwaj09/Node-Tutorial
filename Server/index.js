const http = require("http");
const fs = require('fs')
const url = require('url')

const myServer = http.createServer((req, res) => {
    if (req.url==='/favicon.ico') return res.end;
    // console.log(req.headers)
    const log = `${Date.now()}:${req.url}:New Req Recieved\n`
    const myUrl= url.parse(req.url,true)
    console.log(myUrl);
    fs.appendFile('log.txt', log, (err, data) => {
        switch (myUrl.pathname) {
            case '/':
                res.end("HomePage")
                break
            case '/About':
                res.end("Welcome to about page")
                break
            case '/Contact':
                const qp=myUrl.query.search
                res.end(`${qp} it is a dog name german saford`)
                break
            default:
                res.end('404 error')
        }
        // res.end("Hello From Astha Server")
    })

})

myServer.listen(8000, () => console.log("server started"));
