const sendToken = (user, statusCode, res ) => {
    const token = user.getJwToken();

    const option = {
        expires: new Date(Date.now() + process.env.COOKIE_EX_TIME * 24 * 60 * 60 * 100),
        httpOnly:true
    }
    res.status(statusCode).cookie('token',token,option).json({
        success:true,
        user,
        token 
    })
}
module.exports = sendToken