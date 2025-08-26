const { add } = require("winston");
const { transporter } = require("../utils/utils");
const JobApplication = require("../models/JobApplication");
const JobPosting = require("../models/JobPosting");
const JobRole = require("../models/JobRole");

// Create a new job application

// const approveJobApplication = async (req, res) => {
// }

const addApplicantShortlist = async (req, res) => {
  const { app_id } = req.params;

  console.log(req.params);

  // console.log(applicantID);

  const { id } = req.user;
  console.log(id);

  try {
    //application id from param
    const application = await JobApplication.findById(app_id);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    if (application.status === "shortlisted") {
      return res
        .status(400)
        .json({ message: "Application is already shortlisted" });
    } else {
      application.status = "shortlisted";
      await application.save();
      return res.status(200).json({
        message: "Application status updated to shortlisted",
        application,
      });
    }
  } catch (err) {
    console.error("Error shortlisting application:", err);
    res.status(500).json({ message: "Server error shortlisting application" });
  }
};

const getShortlistedApplicantsByJobPostingID = async (req, res) => {
  const { job_posting_id } = req.params;

  try {
    // const shortlistedApplicants = await JobApplication.find({
    //   jobPosting: job_posting_id,
    //   status: "shortlisted",
    // })
    //   .populate("jobPosting")
    //   .populate("position");

    const shortlistedApplicants = await JobApplication.find({
      jobPosting: job_posting_id,
      status: "shortlisted",
    });

    res.status(200).json(shortlistedApplicants);
  } catch (err) {
    console.error("Error fetching shortlisted applicants:", err);
    res
      .status(500)
      .json({ message: "Server error fetching shortlisted applicants" });
  }
};

const createJobApplication = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      address,
      city,
      country,
      linkedIn,
      portfolio,
      jobPosting,
      position,
      cv,
      coverLetter,
    } = req.body;

    // Ensure jobPosting and position exist
    const posting = await JobPosting.findById(jobPosting);
    const role = await JobRole.findById(position);

    if (!posting || !role) {
      res.status(404).json({ message: "Invalid job posting or job role" });
    }

    //check if the job application already exists
    const existingApplication = await JobApplication.findOne({
      email,
      jobPosting,
    });

    if (existingApplication) {
      return res.status(400).json({
        message:
          "Application already exists for this job posting with this email",
      });
    }

    const newApplication = new JobApplication({
      firstName,
      lastName,
      email,
      phone,
      address,
      city,
      country,
      linkedIn,
      portfolio,
      jobPosting,
      position,
      cv,
      coverLetter,
    });

    const savedApplication = await newApplication.save();
    //set the mail options
    const mailOptions = {
      from: process.env.GOOGLE_EMAIL,
      to: email,
      subject: "Application Received",
      text: `Dear ${firstName},\n\nThank you for applying for the position of ${role.title} at ${posting.title}. We have received your application and will review it shortly.\n\nBest regards,\nCompany HR Team`,
    };

    //send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    });

    res.status(201).json(savedApplication);
  } catch (err) {
    console.error("Error creating job application:", err);
    res.status(500).json({ message: "Server error creating job application" });
  }
};

const rejectJobApplication = async (req, res) => {
  const { app_id } = req.params;

  try {
    const application = await JobApplication.findById(app_id)
      .populate("jobPosting")
      .populate("position");

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    if (application.status === "rejected") {
      return res
        .status(400)
        .json({ message: "Application is already rejected" });
    }

    application.status = "rejected";
    await application.save();

    // Prepare and send rejection email
    const mailOptions = {
      from: process.env.GOOGLE_EMAIL,
      to: application.email,
      subject: "Application Update",
      text: `Dear ${application.firstName},\n\nThank you for your interest in the position of ${application.position.title} at ${application.jobPosting.title}. We regret to inform you that your application was not successful at this time.\n\nWe appreciate your effort and encourage you to apply for future openings.\n\nBest regards,\nCompany HR Team`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending rejection email:", error);
      } else {
        console.log("Rejection email sent:", info.response);
      }
    });

    res.status(200).json({
      message: "Application status updated to rejected and email sent",
      application,
    });
  } catch (err) {
    console.error("Error rejecting application:", err);
    res.status(500).json({ message: "Server error rejecting application" });
  }
};

// Get all applications (admin or HR only)
const getAllJobApplications = async (req, res) => {
  try {
    const applications = await JobApplication.find()
      .populate("jobPosting")
      .populate("position");
    res.status(200).json(applications);
  } catch (err) {
    console.error("Error fetching job applications:", err);
    res.status(500).json({ message: "Server error fetching job applications" });
  }
};

// Get application by ID
const getJobApplicationById = async (req, res) => {
  try {
    const { id } = req.params;
    const application = await JobApplication.findById(id)
      .populate("jobPosting")
      .populate("position");

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.status(200).json(application);
  } catch (err) {
    console.error("Error fetching application:", err);
    res.status(500).json({ message: "Server error fetching job application" });
  }
};

module.exports = {
  createJobApplication,
  getAllJobApplications,
  getJobApplicationById,
  addApplicantShortlist,
  getShortlistedApplicantsByJobPostingID,
  rejectJobApplication,
  // approveJobApplication
};
