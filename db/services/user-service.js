const userRepo = require('../repositories/user-repo');

class UserService {
    constructor(repo) {
        this.userRepo = repo;
    }
    async register(userInfo) {
        const user = await this.userRepo.registerUser(userInfo);
        return user;
    }
    async updateUserInfoWithSecretKey(userEmailAndSecretKey) {
        const user = await this.userRepo.addUserSecretKey(userEmailAndSecretKey);
        return user;
    }
    async verifyUserLoginInfo(userInfo) {
        const user = await this.userRepo.verifyUserCredentials(userInfo);
        return user;
    }
    async extractUserSecretKey(userEmail) {
        const userSecretKey = await this.userRepo.getUserSecretKey(userEmail);
        return userSecretKey;
    }
}

const userService = new UserService(userRepo);
module.exports = userService;
