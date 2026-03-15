const User = require("../models/user")

async function handelGetAllUser(req, res) {
    const allDbUsers = await User.find({});
    return res.json(allDbUsers);
}

async function handelGetUserById(req, res) {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "user not found" });
    return res.json(user);

}

async function handelUpdateUserById(req, res) {
    await User.findByIdAndUpdate(req.params.id, { lastName: "Bhardwaj" })
    return res.json({ status: "Success" })
}

async function handelDeleteUserById(req, res) {
    await User.findByIdAndDelete(req.params.id)
    return res.json({ status: "Success" })
}

async function handelCreateNewUser(req, res) {
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
    const result = await User.create({
        firstName: body.first_name,
        lastName: body.last_name,
        email: body.email,
        gender: body.gender,
        jobTitle: body.job_title,
    });
    console.log(result)
    return res.status(201).json({ msg: "success" ,id:result._id})

}

module.exports = {
    handelGetAllUser,
    handelGetUserById,
    handelUpdateUserById,
    handelDeleteUserById,
    handelCreateNewUser
}