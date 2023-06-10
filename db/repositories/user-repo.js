const User = require('../schemas/user-schema');

class UserRepo {
    constructor(model) {
        this.userModel = model;
    }
    async registerUser(userInfo) {
        const user =  await this.userModel.create({ username:userInfo.username, email:userInfo.email, password:userInfo.password });
        await user.save();
        return user;
    }
    async addUserSecretKey(userEmailAndSecretKey) {
        const user = await this.userModel.findOne({ email:userEmailAndSecretKey.userEmail });
        user.secretKey = userEmailAndSecretKey.userSecretKey;
        await user.save();
        return user;
    }
    async verifyUserCredentials(userInfo) {
        const user = await this.userModel.findOne({ $and:[{ email:userInfo.email }, { password:userInfo.password }] });
        return user;
    }
    async getUserSecretKey(userEmail) {
        const user = await this.userModel.findOne({ email:userEmail });
        return user.secretKey;
    }
}

const userRepo = new UserRepo(User);
module.exports = userRepo;
