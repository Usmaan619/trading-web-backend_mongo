import {
  sendCreated,
  sendNotFound,
  sendList,
} from "../../middleware/requests-helpers.js";

import _ from "lodash";

export const create = (models) => async (req, res, next) => {
  const {
    params: { collection },
  } = req;
  if (typeof models[collection] === "function") {
    try {
      const data = new models[collection](req.body);
      await data.save();
      return sendCreated(res, data);
    } catch (error) {
      next(error);
    }
  } else {
    sendNotFound(res);
  }
};

export const get = (Models) => async (req, res, next) => {
  const {
    params: { collection, _id },
  } = req;
  if (typeof Models[collection] === "function") {
    try {
      const data = await Models[collection].findOne({ _id });
      sendList(res, { data });
    } catch (error) {
      next(error);
    }
  } else {
    sendNotFound(res);
  }
};

export const list = (Models) => async (req, res, next) => {
  let {
    query: { limit, skip, search },
    params: { collection },
  } = req;
  skip = skip ? parseInt(skip, 10) : 0;
  limit = limit ? parseInt(limit, 10) : 100;

  try {
    const query = {};
    if (search) {
      _.extend(query, { title: new RegExp(`${search}`, "i") });
    }
    const data = await Models[collection]
      .find(query)
      .skip(skip)
      .limit(limit)
      .sort({ _id: -1 });

    return sendList(res, { data });
  } catch (error) {
    next(error);
  }
};

export const remove = (Models) => async (req, res, next) => {
  const {
    params: { collection, _id },
  } = req;

  if (typeof Models[collection] === "function") {
    try {
      const data = await Models[collection].findOne({ _id });
      _.extend(data, req.body);
      await data.remove();
      res.status(200).send({ data });
    } catch (error) {
      next(error);
    }
  } else {
    sendNotFound(res);
  }
};

export const update = (Models) => async (req, res, next) => {
  const {
    params: { collection, _id },
  } = req;

  if (typeof Models[collection] === "function") {
    try {
      const data = await Models[collection].findOne({ _id });
      _.extend(data, req.body);
      await data.save();
      res.status(200).send({ data });
    } catch (error) {
      next(error);
    }
  } else {
    sendNotFound(res);
  }
};
