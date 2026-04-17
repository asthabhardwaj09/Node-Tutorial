const express = require('express')
const fs = require('fs')
const zlib =require('zlib')
const status = require('express-status-monitor')

const app= express()

const PORT =8000

app.use(status())

// app.get('/', (req, res) => {
//   fs.readFile("./sample.txt", "utf8", (err, data) => {
//     if (err) {
//       return res.status(500).json({ error: "Read error" });
//     }
//     res.json({ content: data });
//   });
// })


app.get("/" ,(req,res)=>{
    const stream=fs.createReadStream('./sample.txt',"utf-8");
    stream.on("data",()=>(chunk)=> res.write(chunk));
    stream.on("end",()=> res.send())
})

// stream read (sample.txt) ---> zipper ----> fs writeStream 

fs.createReadStream('./sample.txt').pipe(
    zlib.createGzip().pipe(fs.createWriteStream('./sample.zip'))
);



app.listen(PORT,()=>{
    console.log(`Server is running at PORT ${PORT}`)
})
