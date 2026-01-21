const http = require("http");
const fs = require('fs')

const myServer = http.createServer((req, res) => {
    // console.log(req.headers)
    const log = `${Date.now()}:${req.url}:New Req Recieved\n`
    fs.appendFile('log.txt', log, (err, data) => {
        switch (req.url) {
            case '/':
                res.end("HomePage")
                break
            case '/About':
                res.end("Welcome to about page")
                break
            case '/Contact':
                res.end("Welcome to contact page")
            default:
                res.end('404 error')
        }
        // res.end("Hello From Astha Server")
    })

})

myServer.listen(8000, () => console.log("server started"));
