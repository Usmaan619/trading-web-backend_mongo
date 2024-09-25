import toobusy from "toobusy-js";

const tooBusyMiddleware = (req, res, next) => {
  if (toobusy()) {
    res.status(503).send("Server too busy!");
  } else {
    next();
  }
};

export default tooBusyMiddleware;
