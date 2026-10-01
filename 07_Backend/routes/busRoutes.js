const express = require("express");
const router = express.Router();

const busController = require("../controllers/busController");

router.get("/", busController.getBuses);
router.get("/:id", busController.getBusById);
router.post("/", busController.addBus);
router.put("/:id", busController.updateBus);
router.delete("/:id", busController.deleteBus);

module.exports = router;