// app.get("/users", (req, res) => {
//     const html = `
//     <ul>
//         ${users.map((user) => `<li>${user.first_name}</li>`).join("")}
//     </ul>
//     `;
//     res.send(html)
// });


const express = require("express")
const fs = require("fs")
// let users = require("./MOCK_DATA.json") =======>>>> when we use filter method on delete http method
const users = require("./MOCK_DATA.json")

const app = express();
PORT = 8000;


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



//     users = users.filter(user => user.id !== id);

//     fs.writeFile("./MOCK_DATA.json", JSON.stringify(users, null, 2), (err) => {
//         if (err) {
//             return res.status(500).json({ message: "Failed to update file" });
//         }

//         return res.json({ status: "SUCCESS" });
//     });
// });


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

    const newUser = { ...body, id: users.length + 1 };
    users.push(newUser);

    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err) => {
        if (err) {
            return res.status(500).json({ msg: "Failed to save data" });
        }
        return res.status(201).json({ status: "SUCCESS", id: newUser.id });
    });
});


// app.patch('/api/users',(req,res)=>{
//     return res.json({status:"pending"})
// })

// app.delete('/api/users',(req,res)=>{
//     return res.json({status:"pending"})
// })



app.listen(PORT, () => console.log(`Server is renderend at ${PORT}`));



//const user = users.find((user)=>user.id===id);

// 👉 user temporary hota hai jab tak check chal raha hai
// 👉 match milte hi wahi object bahar aa kar final user ban jaata hai

// find() ka RULE (yaad rakhna 📌)

// JavaScript engine ko pehle se bola hua hota hai:

// “Array ke har element par function chalao
// agar function true bole →
// wahi element return karo
// aur turant ruk jao”

// Isliye:

// ❌ jo match nahi karta → throw away

// ✅ jo match karta → return