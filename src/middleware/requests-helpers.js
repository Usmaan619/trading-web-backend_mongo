import pkg from 'lodash';

import pk from 'rest-api-errors';
const { APIError } = pk;


const STATUSES = {
  SUCCESS: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  UNPROCESSABLE_ENTITY: 422,
};

/**
 *
 * @param {*} res
 * @param {*} data
 * @param {*} status
 */
const sendResponse = (res, data, status = STATUSES.SUCCESS) =>
  res.status(status).json(data).end();

const sendOne = pkg((res, entity) => {
  if (!entity) {
    throw new APIError();
  }

  return sendResponse(res, entity);
});

const sendList = pkg((res, entityList) => sendResponse(res, entityList));
const sendCreated = pkg((res, entity) => sendResponse(res, entity));
const sendUpdated = pkg((res, updatedEntity) =>
  sendResponse(res, updatedEntity)
);
const sendDeleted = pkg((res) =>
  sendResponse(res, null, STATUSES.NO_CONTENT)
);
const sendNotFound = pkg((res) =>
  sendResponse(
    res,
    { success: false, message: "Not found" },
    STATUSES.NOT_FOUND
  )
);
const sendError = pkg((res, entity) =>
  sendResponse(res, entity, STATUSES.UNPROCESSABLE_ENTITY)
);
const sendAccepted = (res) => () => sendResponse(res, null);

export {
  sendOne,
  sendList,
  sendCreated,
  sendUpdated,
  sendDeleted,
  sendAccepted,
  sendNotFound,
  sendError,
  sendResponse,
};
