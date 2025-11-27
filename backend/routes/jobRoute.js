const express = require("express");
const { authenticate } = require("../middleware/authenticate");
const wrapAsync = require("../utils/wrapAsync");
const {
  postJob,
  getAllJobs,
  applyForJob,
  getJobApplications,
  updateApplicationStatus,
} = require("../controllers/jobController");

const router = express.Router();

router.post("/", authenticate, wrapAsync(postJob));
router.get("/", wrapAsync(getAllJobs));
router.post("/:jobId/apply", authenticate, wrapAsync(applyForJob));
router.get("/:jobId/applications", authenticate, wrapAsync(getJobApplications));
router.put(
  "/:jobId/applications/:applicationId",
  authenticate,
  wrapAsync(updateApplicationStatus)
);

module.exports = router;
