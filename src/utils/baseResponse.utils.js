const baseResponse = (res, success, status, message, payload = null) => {
  return res.status(status).json({
    succes: success, 
    message,
    payload,
  });
};

module.exports = baseResponse;
