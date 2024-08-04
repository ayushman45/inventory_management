let bcrypt = require('bcryptjs')
const saltRounds = bcrypt.genSaltSync(10);

export const encrypt = async (password) => {
    const hashedPassword = await bcrypt.hashSync(password, saltRounds);
    return hashedPassword;

}

export const compare = async (password, hashedPassword) => {
    return await bcrypt.compareSync(password, hashedPassword);

}