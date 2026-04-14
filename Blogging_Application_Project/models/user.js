const { createHmac, randomBytes } = require('node:crypto');
const { Schema, model } = require('mongoose')

const userSchema = new Schema({
    fullname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    salt: {
        type: String,
    },
    password: {
        type: String,
        required: true,
    },
    profileImageUrl: {
        type: String,
        default: '/images/profile_image.webp',
    },
    role: {
        type: String,
        enum: ['USER', 'ADMIN'],
        default: 'USER'
    }
},
    {
        timestamps: true
    }
)

userSchema.pre("save", function () {
    if (!this.isModified('password')) {
        return;
    }

    const salt = randomBytes(16).toString();
    const hashedPassword = createHmac('sha256', salt)
        .update(this.password)
        .digest('hex');

    this.salt = salt;
    this.password = hashedPassword;
});


userSchema.statics.matchPassword = async function(email, password) {
    const user = await this.findOne({ email })
    console.log(user);
    if (!user) throw new Error("User not found!")

    const salt = user.salt
    const hashedPassword = user.password

    const userProvidedHash = createHmac('sha256', salt)
        .update(password)      
        .digest('hex')

    if (hashedPassword !== userProvidedHash)  
        throw new Error("Incorrect Password")

    return { ...user._doc, password: undefined, salt: undefined }  
    
}

const User=model('user',userSchema)

module.exports = User;