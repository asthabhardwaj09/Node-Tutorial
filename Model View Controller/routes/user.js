const express = require("express")
const {handelGetAllUser, handelGetUserById, handelUpdateUserById, handelDeleteUserById,handelCreateNewUser} = require("../controllers/user")

const router = express.Router()


// router.get("/users", async(req, res) => {
//     const allDbUsers=await User.find({})
//     const html = `
//     <ul>
//     ${allDbUsers
//         .map((user) => `<li>${user.firstName}-${user.email}</li>`)
//         .join("")}
//     </ul>
//     `;
//     res.send(html);
// })


//User data

router.route("/").get(handelGetAllUser).post(handelCreateNewUser);


router
    .route("/:id")
    .get(handelGetUserById)
    .patch(handelUpdateUserById)
    .delete(handelDeleteUserById);


module.exports=router;