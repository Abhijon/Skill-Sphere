const Job = require("../models/job");
const Application = require("../models/application");
const sendEmail = require("../utils/sendEmail");
const axios = require("axios");

exports.updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    // Ensure status is valid
    if (!["accepted", "rejected"].includes(status)) {
      return res
        .status(400)
        .json({ message: "Invalid status. Use 'accepted' or 'rejected'." });
    }

    const application = await Application.findById(req.params.applicationId)
      .populate("job")
      .populate("candidate", "email name"); // Get candidate details

    if (!application)
      return res.status(404).json({ message: "Application not found" });

    // Ensure the recruiter owns the job
    if (application.job.postedBy.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You can only update applications for your jobs." });
    }

    // Update status
    application.status = status;
    await application.save();

    // Send email notification
    const emailSubject = `Your Job Application has been ${status}`;
    const emailText = `Dear ${
      application.candidate.name
    },\n\nYour application for "${
      application.job.title
    }" has been ${status}.\n\n${
      status === "accepted"
        ? "Congratulations! We will contact you soon."
        : "We appreciate your effort and encourage you to apply for future opportunities."
    }\n\nBest Regards,\nRecruitment Team`;

    await sendEmail(application.candidate.email, emailSubject, emailText);

    res.json({ message: `Application ${status} successfully! Email sent.` });
  } catch (error) {
    console.error("Error updating application status:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.postJob = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "recruiter") {
      return res.status(403).json({ message: "Only recruiters can post jobs" });
    }

    const {
      title,
      description,
      skillsRequired,
      location,
      salaryRange,
      assessmentRequired,
      assessmentQuestions,
      minimumScore,
    } = req.body;

    // Basic validation
    if (
      !title ||
      !description ||
      !skillsRequired ||
      !location ||
      !salaryRange
    ) {
      return res
        .status(400)
        .json({ message: "All required fields must be provided." });
    }

    // Validate assessment questions if assessmentRequired is true
    if (assessmentRequired) {
      if (!assessmentQuestions || assessmentQuestions.length === 0) {
        return res.status(400).json({
          message:
            "Assessment questions are required if assessment is enabled.",
        });
      }

      for (const question of assessmentQuestions) {
        if (
          !question.question ||
          !question.options ||
          question.options.length < 2 ||
          !question.correctAnswer
        ) {
          return res.status(400).json({
            message:
              "Each assessment question must have a question, at least two options, and a correct answer.",
          });
        }
      }
    }

    const newJob = new Job({
      title,
      description,
      skillsRequired,
      location,
      salaryRange,
      assessmentRequired,
      assessmentQuestions: assessmentRequired ? assessmentQuestions : [],
      minimumScore: assessmentRequired ? minimumScore : 0,
      postedBy: req.user.id,
    });

    await newJob.save();
    res.status(200).json({ message: "Job posted successfully!", job: newJob });
  } catch (error) {
    console.error("Error posting job:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getAllJobs = async (req, res) => {
  const jobs = await Job.find().populate("postedBy", "organization");
  res.json(jobs);
};

exports.applyForJob = async (req, res) => {
  try {
    const { coverLetter, score } = req.body;
    const job = await Job.findById(req.params.jobId);

    if (!job) return res.status(404).json({ message: "Job not found" });

    if (req.user.role !== "candidate") {
      return res
        .status(403)
        .json({ message: "Only candidates can apply for jobs" });
    }

    // ✅ Check if the user has already applied
    if (job.applicants.includes(req.user.id)) {
      return res
        .status(400)
        .json({ message: "You have already applied for this job." });
    }

    // ✅ Add applicant ID to job's `applicants` array
    job.applicants.push(req.user.id);
    await job.save();

    // ✅ Save the application **(without prediction)**
    const application = new Application({
      job: req.params.jobId,
      candidate: req.user.id,
      coverLetter,
      score,
    });

    await application.save();
    res.status(201).json({ message: "Application submitted successfully!" });
  } catch (error) {
    console.error("Error applying for job:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getJobApplications = async (req, res) => {
  // ✅ Ensure only recruiters can access this route
  if (req.user.role !== "recruiter") {
    return res
      .status(403)
      .json({ message: "Only recruiters can view job applications" });
  }

  const job = await Job.findById(req.params.jobId);
  if (!job) return res.status(404).json({ message: "Job not found" });

  // ✅ Ensure recruiter can only view applications for their own jobs
  if (job.postedBy.toString() !== req.user.id) {
    return res
      .status(403)
      .json({ message: "You can only view applications for your jobs" });
  }

  const applications = await Application.find({
    job: req.params.jobId,
  }).populate("candidate", "name email");
  res.json(applications);
};
