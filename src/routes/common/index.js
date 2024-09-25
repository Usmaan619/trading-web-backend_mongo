import express from "express";
import {
  get,
  list,
  create,
  update,
  remove,
} from "../../controllers/common/index.js";
import models from "../../models/index.js";

const router = express();

router.get("/:collection", list(models));
router.get("/:collection/:_id", get(models));
router.post("/:collection/create", create(models));
router.patch("/:collection/:_id", update(models));
router.delete("/:collection/:_id", remove(models));

export default router;
