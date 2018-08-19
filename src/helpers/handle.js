module.exports = {
  createAPIResponse: (res, msg, statusCode, pullMessage, runMessage) => {
    msg.statusCode = statusCode;
    msg.message = {
      pull: pullMessage,
      container: runMessage
    };

    res.json(msg);
  },
  listAPIResponse: (res, statusCode, containerInfo) => {
    msg.statusCode = statusCode;
    msg.info = JSON.stringify(containerInfo);

    res.json(msg);
  }
}