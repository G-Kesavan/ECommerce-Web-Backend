const sendToken = (user, statusCode, res, message) => {
  const token = user.getJwToken();
  const option = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EX_TIME * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: true,
    sameSite: "None",
  };
  res.status(statusCode).cookie("token", token, option).json({
    success: true,
    message: message,
    user,
  });
};
module.exports = sendToken;
