const userModel = require('./user.model');

module.exports.createUser = async ({
    username,password,description
}) => {
    if (!description || !username || !password) {
        throw new Error('All fields are required');
    }

    const user=await userModel.create({
        username,
        password,
        description
    })

    return user;
}