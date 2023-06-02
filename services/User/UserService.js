const UserRepository = require("../../repositories/User/UserRepository");

const UserService = class {
    constructor() {
        this.userRepository = new UserRepository();
    }

    login = async (payload) => {
        //
    };
};

module.exports = UserService;
