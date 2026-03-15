const { timeStamp } = require("console");
const express = require("express")
const fs = require("fs")
const mongoose= require("mongoose");
const { type } = require("os");

const app = express();
PORT = 8000;

//connection of mongoose

mongoose
    .connect("mongodb://127.0.0.1:27017/youtube-app-1")
    .then(()=>console.log("MongoDB connected"))
    .catch((err)=>console.log("Mongo Error",err))

//Schema

const userSchema=new mongoose.Schema({
    firstName:{
        type:String,
        required: true
    },
    lastName:{
        type:String,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    jobTitle:{
        type:String,
        unique:true
    },
    gender:{
        type:String,
    },
    },
    {timestamps:true }
);

//schema - Model
const User=mongoose.model("user",userSchema)


//Middleware
app.use(express.urlencoded({ extended: false }))
app.use(express.json());
app.use((req, res, next) => {
    fs.appendFile('log.txt', `\n${Date.now()}:${req.ip}:${req.method}:${req.path}`,
        (err, data) => {
            next()
        })
    // return res.json({msg:"Hello from middleware 1"})
    // next()

})

//Routes

app.get("/users", async(req, res) => {
    const allDbUsers=await User.find({})
    const html = `
    <ul>
    ${allDbUsers
        .map((user) => `<li>${user.firstName}-${user.email}</li>`)
        .join("")}
    </ul>
    `;
    res.send(html);
})


//User data
app.get("/api/users", async (req, res) => {
    try {
        const allDbUsers = await User.find({});
        res.setHeader("X-myname", "astha");
        return res.json(allDbUsers);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
});

// Searching user through id

// app.get("/api/users/:id", (req, res) => {
//     const id = Number(req.params.id);
//     const user = users.find((user) => user.id === id);
//     return res.json(user);
// })

app
    .route("/api/users/:id")
    .get(async (req, res) => {
        const user = await User.findById(req.params.id);
        // console.log(user); //you can check by this        
        if (!user) { //cannot write user!==id because user is a object and id is number
            return res.status(400).json({ message: "user not found" })
        }
        return res.json(user);
    })
    .patch(async(req, res) => {
        await User.findByIdAndUpdate(req.params.id,{lastName:"Bhardwaj"})
        return res.json({status:"Success"})
        })
    .delete(async(req, res) => {
        await User.findByIdAndDelete(req.params.id)
        return res.json({status:"Success"})
    });



app.post('/api/users', async (req, res) => {
    const body = req.body;

    if (
        !body ||
        !body.first_name ||
        !body.last_name ||
        !body.gender ||
        !body.email ||
        !body.job_title
    ) {
        return res.status(400).json({ msg: "All fields are required" });
    }
    const result= await User.create({
        firstName: body.first_name,
        lastName: body.last_name,
        email: body.email,
        gender: body.gender,
        jobTitle: body.job_title,
    });
    console.log(result)
    return res.status(201).json({msg:"success"})
});


// app.patch('/api/users',(req,res)=>{
//     return res.json({status:"pending"})
// })

// app.delete('/api/users',(req,res)=>{
//     return res.json({status:"pending"})
// })



app.listen(PORT, () => console.log(`Server is renderend at ${PORT}`));


