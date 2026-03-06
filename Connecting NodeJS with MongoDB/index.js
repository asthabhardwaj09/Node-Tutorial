const express = require("express")
const fs = require("fs")
const mongoose= require("mongoose")
// const users = require("./MOCK_DATA.json")

const app = express();
PORT = 8000;

//
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
    }
})

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

app.get("/users", (req, res) => {
    const html = `
    <ul>
    ${users
        .map((user) => `<li>${user.first_name}-${user.email}</li>`)
        .join("")}
    </ul>
    `;
    res.send(html);
})

//User data
app.get("/api/users",(req, res) => {
    // console.log(req.headers);
    res.setHeader("X-myname", "astha") //Always add X to custom header
    return res.json(users);
});

// Searching user through id

// app.get("/api/users/:id", (req, res) => {
//     const id = Number(req.params.id);
//     const user = users.find((user) => user.id === id);
//     return res.json(user);
// })

app
    .route("/api/users/:id")
    .get((req, res) => {
        const id = Number(req.params.id);
        const user = users.find((user) => user.id === id);
        // console.log(user); //you can check by this        
        if (!user) { //cannot write user!==id because user is a object and id is number
            return res.status(400).json({ message: "user not found" })
        }
        return res.json(user);
    })
    .patch((req, res) => {
        const id = Number(req.params.id);

        const index = users.findIndex(user => user.id === id);
        if (index === -1) {
            return res.status(404).json({ message: "User not found" });
        }
        // merge old data with new data
        users[index] = {
            ...users[index], //old data
            ...req.body, //new data
            id: users[index].id // protect id (Even if user send a fake id it will not be changed)
        };
        fs.writeFile("./MOCK_DATA.json", JSON.stringify(users, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ message: "Failed to update file" });
            }
            return res.json({
                status: "SUCCESS",
                updatedUser: users[index]
            });
        });
    })
    .delete((req, res) => {
        let id = Number(req.params.id);
        const index = users.findIndex(user => user.id === id)
        if (index === -1) {
            return res.json("User not found")
        }
        users.splice(index, 1)
        fs.writeFile("./MOCK_DATA.json", JSON.stringify(users, null, 2), (err) => {
            if (err) {
                return res.json({ message: "Failed to update file" });
            }

            return res.json({ status: "SUCCESS" });
        });
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
    return res.status(201).json({msg:"success"})
});


// app.patch('/api/users',(req,res)=>{
//     return res.json({status:"pending"})
// })

// app.delete('/api/users',(req,res)=>{
//     return res.json({status:"pending"})
// })



app.listen(PORT, () => console.log(`Server is renderend at ${PORT}`));


