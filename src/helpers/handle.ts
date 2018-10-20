module.exports = {
  createAPIResponse: (res, msg, statusCode, pullMessage, runMessage) => {
    msg.statusCode = statusCode;
    res.json(msg);
  },
  listAPIResponse: (res, msg, statusCode, containerInfo) => {
    msg.statusCode = statusCode;
    msg.info = JSON.stringify(containerInfo);

    res.json(msg);
  },
  removeAPIResponse: (res, msg, statusCode, message) => {
    msg.statusCode = statusCode;
    msg.message = message;

    res.json(msg);
  }
}