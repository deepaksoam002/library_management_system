const bcrypt = require('bcrypt');

async function handlePasswordHashing (password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
};

module.exports = {
    handlePasswordHashing,
}