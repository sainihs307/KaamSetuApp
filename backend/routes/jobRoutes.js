import express from "express";
import auth from "../middleware/auth.js";
import Job from "../models/Job.js";
import Application from "../models/Application.js";
import User from "../models/User.js";
const router = express.Router();

// ─── GET ALL JOBS ─────────────────────────────────────────────────────────────
// AFTER:
// AFTER:



// ✅ 🔥 ADD THIS HERE (POST ROUTE)
router.post("/", auth, async (req, res) => {
  try {
    console.log("🔥 BODY:", req.body);
    console.log("🔥 USER:", req.user);

    const newJob = new Job({
      ...req.body,
      posterId: req.user._id,   // ✅ FIXED
      status: "pending",
    });

    const savedJob = await newJob.save();

    res.status(201).json(savedJob);
  } catch (err) {
    console.error("🔥 FULL ERROR:", err);   // ✅ VERY IMPORTANT
    res.status(500).json({ error: err.message }); // send real error
  }
});


// ─── GET ALL JOBS ─────────────────────────────────────────────────────────────
router.get("/", async (req, res) => {
  try {
    const jobs = await Job.find({
      status: { $nin: ["completed", "cancelled"] },
    });

    const formatted = await Promise.all(
      jobs.map(async (job) => {
        let posterName = "User";
        try {
          if (job.posterId && job.posterId.length === 24) {
            const user = await User.findById(job.posterId).select("name");
            if (user?.name) posterName = user.name;
          }
        } catch (_) {}
        return {
          ...job.toObject(),
          postedBy: { name: posterName },
        };
      })
    );

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ─── MY PAST REQUESTS (completed + cancelled) ─────────────────────────────────
// GET /api/jobs/my-past-requests/:userId

router.get("/my-requests/:userId", async (req, res) => {
  try {
    const jobs = await Job.find({
      posterId: req.params.userId,   // ✅ IMPORTANT
      status: { $nin: ["completed", "cancelled"] },
    }).sort({ createdAt: -1 });

    res.json(jobs);
  } catch (err) {
    console.error("🔥 MY REQUESTS ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});

router.get("/my-past-requests/:userId", async (req, res) => {
  try {
    const jobs = await Job.find({
      posterId: req.params.userId,
      status: { $in: ["completed", "cancelled"] },
    }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── UPDATE JOB STATUS ────────────────────────────────────────────────────────
// PATCH /api/jobs/:id/status
// Body: { status: "pending" | "in_progress" | "completed" | "cancelled" }
router.patch("/:id/status", async (req, res) => {
  const { status } = req.body;
  try {
    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true },
    );
    if (!updatedJob) return res.status(404).json({ error: "Job not found" });
    res.status(200).json(updatedJob);
  } catch (err) {
    res.status(500).json({ error: "Failed to update status" });
  }
});

// ─── MARK JOB AS COMPLETED ────────────────────────────────────────────────────
// PATCH /api/jobs/:id/complete
// Only the job poster (employer) can mark their own job as completed.
// Job must be in "in_progress" / "in-progress" state to be completed.
router.patch("/:id/complete", auth, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ error: "Job not found" });

    // Only the poster can mark it complete
    if (job.posterId.toString() !== req.user.id) {
      return res.status(403).json({ error: "Not authorized" });
    }

    const currentStatus = (job.status || "").trim().toLowerCase();
    if (!["in_progress", "in-progress"].includes(currentStatus)) {
      return res.status(400).json({
        error:
          "Only jobs that are currently in progress can be marked complete.",
        current_status: job.status,
      });
    }

    job.status = "completed";
job.completedAt = new Date();
await job.save();

// Mark the accepted application as completed so worker sees Rate button
// Mark the accepted application as completed so worker sees Rate button
const acceptedApp = await Application.findOneAndUpdate(
  { jobId: job._id, status: "accepted" },
  { status: "completed", completedAt: new Date() },
  { new: true }
).populate("workerId", "_id name");

const workerId = acceptedApp?.workerId?._id || acceptedApp?.workerId || null;

res.status(200).json({ message: "Job marked as completed", job, workerId });
  } catch (err) {
    console.error("🔥 [COMPLETE ERROR]", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ─── DELETE JOB (only pending jobs) ──────────────────────────────────────────
// DELETE /api/jobs/:id
router.delete("/:id", async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      console.log(`❌ [DELETE] Job ${req.params.id} not found.`);
      return res.status(404).json({ error: "Job not found in database." });
    }

    console.log(`--- Delete Request for ID: ${req.params.id} ---`);
    console.log(`Raw Status from DB: "${job.status}"`);

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

export default router;
