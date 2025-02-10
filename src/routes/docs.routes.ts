import express from "express";
import { apiDocs } from "../config/apiDocs";

const router = express.Router();

router.get("/", (req, res) => {
  res.json(apiDocs);
});

export default router;
