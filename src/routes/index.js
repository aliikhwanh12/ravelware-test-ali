const express = require("express");
const router = express.Router();
const { latestData, yearlyEnergy } = require("../controllers/energyController");

router.get("/latest", latestData);
router.get("/yearly-energy", yearlyEnergy);

router.get("/", (req, res) => {
  res.send("Routes working");
});
router.get("/realtime", (req, res) => {
  res.json({
    message: "Realtime dashboard endpoint",
  });
});

module.exports = router;
