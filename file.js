 const fs= require("fs");

//Sync

// fs.writeFileSync("./test.txt","Hey anyone is there?")


//Async

// fs.writeFile("./test.txt","Hey anyone is there Async?",(err)=>{})


//Sync Read
//Sync always return something

// const result=fs.readFileSync("./contact.txt","utf-8")
// console.log(result)


//Async it always except the callback

// fs.readFile("./contact.txt","utf-8",(err,result)=>{
//     if(err){
//         console.log('Error',err);       
//     }else{
//         console.log(result);     
//     }
// })


// fs.appendFileSync("./test.txt",new Date().getDate().toLocaleString())


fs.appendFileSync("./test.txt",`Hey there\n`)

// fs.copyFileSync("./test.txt","./copy.txt")

// fs.unlinkSync("./copy.txt")

// console.log(fs.statSync("./test.txt"))
// console.log(fs.statSync("./test.txt").isFile())

// fs.mkdirSync("my-doc")

fs.mkdirSync("my-doc/a/b",{recursive:true})