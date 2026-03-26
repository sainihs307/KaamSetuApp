import express from "express";
import Job from "../models/Job.js"; // ✅ Remember the .js extension!
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const jobs = await Job.find();   // 🔥 fetch from DB
    res.json(jobs);                  // return jobs
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🚀 Route to create a job
router.post("/create", async (req, res) => {
  try {
    const newJob = new Job(req.body);
    const savedJob = await newJob.save();
    res.status(201).json(savedJob);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 📋 Route to get my requests
router.get("/my-requests/:userId", async (req, res) => {
  try {
    const jobs = await Job.find({ posterId: req.params.userId }).sort({
      createdAt: -1,
    });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ 1. Update Job Status (Move from Pending -> In-Progress -> Completed)
router.patch("/:id/status", async (req, res) => {
  const { status } = req.body;
  try {
    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true },
    );
    res.status(200).json(updatedJob);
  } catch (err) {
    res.status(500).json({ error: "Failed to update status" });
  }
});
router.delete("/:id", async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      console.log(`❌ [DELETE] Job ${req.params.id} not found.`);
      return res.status(404).json({ error: "Job not found in database." });
    }

    // 🔥 LOGGING: This will show up in Niraj's terminal
    console.log(`--- Delete Request for ID: ${req.params.id} ---`);
    console.log(`Raw Status from DB: "${job.status}"`);

    // 🔥 THE BULLETPROOF CHECK
    // .trim() removes spaces, .toLowerCase() ignores Capital letters
    const cleanStatus = (job.status || "").trim().toLowerCase();

    if (cleanStatus !== "pending") {
      console.log(`❌ [BLOCKED] Status is "${cleanStatus}", not "pending"`);
      return res.status(400).json({
        error: "Could not delete. It might be in progress.",
        server_saw_status: job.status,
      });
    }

    await Job.findByIdAndDelete(req.params.id);
    console.log("✅ [SUCCESS] Job deleted from database.");
    res.status(200).json({ message: "Job deleted successfully" });
  } catch (err) {
    console.error("🔥 [SERVER ERROR]", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
export default router; // ✅ Correct way for ES Modules
