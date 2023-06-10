const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        validate:{
            validator(username) {
                return username.length > 0;
            },
            message: 'Username cannot be empty'
        },
        require:[true, 'username is required']
    },
    email:{
        type:String,
        validate:{
            validator(email) {
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
            },
            message: 'Please enter a valid email address'
        },
        require:[true, 'email is required']
    },
    password:{
        type:String,
        validate:{
            validator(pwd) {
                return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/.test(pwd);
            },
            message: 'Password  must contain uppercase and lowercase letters and  with lengths of minimum of 8 digits'
        },
        require:[true, 'password is required']
    },
    refreshToken:{
        type:[String]
    }
});

const User = mongoose.model('user', userSchema);
module.exports = User;
