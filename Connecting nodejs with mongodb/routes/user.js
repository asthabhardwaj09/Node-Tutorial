const express=require("express")
const{handelGetAllUSers,handelgetUserById,handelupdateUserById}=require("../controllers/user")

const router =express.Router();

// router.get("/", async (req, res) => {
//     const allDbUsers = await User.find({});
//     const html = `
//     <ul>
//     ${allDbUsers
//             .map((user) => `<li>${user.firstName}-${user.email}</li>`).join("")}
//     </ul>
//     `;
//     res.send(html);
// })

//REST API
//User data

// router.get("/", async (req, res) => {
//     // console.log(req.headers);
//     const allDbUsers = await User.find({})
//     return res.json(allDbUsers);
// });

router.get("/",handelGetAllUSers);

router
    .route("/:id")
    .get(handelgetUserById)
    // .get(async (req, res) => {
        // const user = await User.findById(req.params.id)
        // if (!user) { //cannot write user!==id because user is a object and id is number
        //     return res.status(400).json({ message: "user not found" })
        // }
        // return res.json(user);
    // })

    // .patch(async (req, res) => {
    //     await User.findByIdAndUpdate(
    //         req.params.id,
    //         { firstName: "changed" }
    //     );
    //     return res.json({ status: "success" });
    // })

    .patch(handelupdateUserById)

    // .patch(async (req, res) => {
    //     const updatedUser = await User.findByIdAndUpdate(
    //         req.params.id,
    //         req.body,
    //         { new: true }
    //     );

    //     return res.json(updatedUser);
    // })

    .delete(async (req, res) => {
        await User.findByIdAndDelete(req.params.id)
        return res.json({ status: "Sucess" })
    });



router.post('/', async (req, res) => {
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

module.exports=router
