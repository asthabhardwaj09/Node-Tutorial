const User = require("../models/user")

async function handelGetAllUSers(req, res) {
    const allDbUsers = await User.find({});
    return res.json(allDbUsers);
}

async function handelgetUserById() {
    const user = await User.findById(req.params.id)
    if (!user) {
        return res.status(400).json({ message: "user not found" })
    }
    return res.json(user);
}

async function handelupdateUserById() {
    await User.findByIdAndUpdate(
        req.params.id,
        { firstName: "changed" }
    );
    return res.json({ status: "success" });

}

module.exports = {
    handelgetUserById,
    handelgetUserById,
    handelupdateUserById,

}