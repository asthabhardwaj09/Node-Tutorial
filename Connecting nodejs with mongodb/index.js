const express = require("express")
const fs = require("fs")
const mongoose = require("mongoose")
const app = express();
PORT = 9000;
app.use(express.json());

//contection
mongoose.connect("mongodb://127.0.0.1:27017/youtube")
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log("Mango Error", err));

//Schema

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    jobTitle: {
        type: String
    },
    gender: {
        type: String
    },
})

const User = mongoose.model("user", userSchema)

//Middleware
app.use(express.urlencoded({ extended: false }))
app.use((req, res, next) => {
    fs.appendFile('log.txt', `\n${Date.now()}:${req.ip}:${req.method}:${req.path}`,
        (err, data) => {
            next()
        })
    // return res.json({msg:"Hello from middleware 1"})
    // next()

})

//Routes

app.get("/users", async (req, res) => {
    const allDbUsers = await User.find({});
    const html = `
    <ul>
    ${allDbUsers
            .map((user) => `<li>${user.firstName}-${user.email}</li>`).join("")}
    </ul>
    `;
    res.send(html);
})

//User data
app.get("/api/users", async (req, res) => {
    // console.log(req.headers);
    const allDbUsers = await User.find({})

    res.setHeader("X-myname", "astha") //Always add X to custom header
    return res.json(allDbUsers);
});


app
    .route("/api/users/:id")
    .get(async (req, res) => {
        const user = await User.findById(req.params.id)
        if (!user) { //cannot write user!==id because user is a object and id is number
            return res.status(400).json({ message: "user not found" })
        }
        return res.json(user);
    })
    // .patch(async (req, res) => {
    //     await User.findByIdAndUpdate(
    //         req.params.id,
    //         { firstName: "changed" }
    //     );
    //     return res.json({ status: "success" });
    // })
    .patch(async (req, res) => {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        return res.json(updatedUser);
    })

    .delete(async (req, res) => {
        await User.findByIdAndDelete(req.params.id)
        return res.json({ status: "Sucess" })
    });



app.post('/api/users', async (req, res) => {
    const body = req.body;
    if (!body ||
        !body.firstName ||
        !body.lastName ||
        !body.gender ||
        !body.email ||
        !body.jobTitle
    ) {
        return res.status(400).json({ msg: "All fields are req..." })
    }
    const result = await User.create({
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        gender: body.gender,
        jobTitle: body.jobTitle
    });
    console.log("Result", result)
    return res.status(201).json({ msg: "success" })


})




app.listen(PORT, () => console.log(`Server is renderend at ${PORT}`));


