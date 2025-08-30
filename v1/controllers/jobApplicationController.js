const { add } = require("winston");
const { transporter } = require("../utils/utils");
const JobApplication = require("../models/JobApplication");
const JobPosting = require("../models/JobPosting");
const JobRole = require("../models/JobRole");
const { getAccessToken } = require("../utils/docusign_auth");
const fs = require("fs");
const path = require("path");
const { default: axios } = require("axios");

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
    const application = await JobApplication.findById(app_id)
      .populate("jobPosting")
      .populate("position");

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
      const mailOptions = {
        from: process.env.GOOGLE_EMAIL,
        to: application.email,
        subject: "Shortlist Notification",
        text: `Dear ${application.firstName},\n\nCongratulations! You have been moved to the shortlist for the position of ${application.jobPosting.title}. Our team will contact you soon with further details.\n\nBest regards,\nCompany HR Team`,
      };

      //send the email
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email:", error);
        } else {
          console.log("Email sent:", info.response);
        }
      });
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
      subject: `Application Received - ${savedApplication._id}`,
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

const offerJobApplication = async (req, res) => {
  const { app_id } = req.params;

  const application = await JobApplication.findById(app_id)
    .populate("jobPosting")
    .populate({
      path: "position",
      populate: { path: "hiringManager", select: "fName lName email" },
    });

  if (!application) {
    return res.status(404).json({ message: "Application not found" });
  } else if (application.status === "offered") {
    // return res
    //   .status(400)
    //   .json({ message: "Application is already in offered status" });
  } else {
    application.status = "offered";
    await application.save();

    // Prepare and send offer email
    const mailOptions = {
      from: process.env.GOOGLE_EMAIL,
      to: application.email,
      subject: "Job Offer",
      text: `Dear ${application.firstName},\n\n Congratulations! You have received a job offer for the position of ${application.position.title} in ${application.country}. Our hiring manager, ${application.position.hiringManager.fName} ${application.position.hiringManager.lName}, will be in touch with you shortly to discuss the next steps. The contract offer will be sent out soon to your email.\n\nBest regards,\nCompany HR Team`,
    };

    const emailSent = await transporter.sendMail(mailOptions);

    if (!emailSent) {
      return res
        .status(500)
        .json({ message: "Error sending offer email to applicant" });
    } else {
      //send the docusign contract
      let { access_token } = await getAccessToken();

      console.log("Access Token:", application);

      // console.log(access_token);

      // Path to your PDF file in the project folder
      const filePath = path.join(__dirname, "../../contract.pdf");

      // Read file and convert to Base64
      const pdfBase64 = fs.readFileSync(filePath, { encoding: "base64" });

      // console.log(pdfBase64);

      const envelopeDefinition = {
        emailSubject: "Please sign the contract",
        documents: [
          {
            documentBase64: pdfBase64,
            name: "Contract", // Can be different from actual file name
            fileExtension: "pdf",
            documentId: "1",
          },
        ],
        recipients: {
          signers: [
            {
              email: application.email,
              name: `${application.firstName} ${application.lastName}`,
              recipientId: "1",
              routingOrder: 1,
              tabs: {
                signHereTabs: [
                  {
                    anchorString: "**candidate_signature**",
                    anchorYOffset: "0",
                    anchorUnits: "pixels",
                    anchorXOffset: "0",
                  },
                ],
                textTabs: [
                  {
                    anchorString: "**firstName**",
                    anchorYOffset: "0",
                    anchorUnits: "pixels",
                    anchorXOffset: "0",
                    value: application.firstName,
                    readOnly: true,
                  },
                  {
                    anchorString: "**lastName**",
                    anchorYOffset: "0",

                    anchorUnits: "pixels",
                    anchorXOffset: "0",
                    value: application.lastName,
                    readOnly: true,
                  },
                  {
                    anchorString: "**email**",
                    anchorYOffset: "0",
                    anchorUnits: "pixels",
                    anchorXOffset: "0",
                    value: application.email,
                    readOnly: true,
                  },
                  {
                    anchorString: "**address**",
                    anchorYOffset: "0",
                    anchorUnits: "pixels",
                    anchorXOffset: "0",
                    value: application.address,
                    readOnly: true,
                  },
                  {
                    anchorString: "**phone**",
                    anchorYOffset: "0",
                    anchorUnits: "pixels",
                    anchorXOffset: "0",
                    value: application.phone,
                    readOnly: true,
                  },

                  {
                    anchorString: "**city**",
                    anchorYOffset: "0",
                    anchorUnits: "pixels",
                    anchorXOffset: "0",
                    value: application.city,
                    readOnly: true,
                  },
                  {
                    anchorString: "**country**",
                    anchorYOffset: "0",
                    anchorUnits: "pixels",
                    anchorXOffset: "0",
                    value: application.country,
                    readOnly: true,
                  },

                  {
                    anchorString: "**jobTitle**",
                    anchorYOffset: "0",
                    anchorUnits: "pixels",
                    anchorXOffset: "0",
                    value: application.position.title,
                    readOnly: true,
                  },
                  {
                    anchorString: "**salary**",
                    anchorYOffset: "0",
                    anchorUnits: "pixels",
                    anchorXOffset: "0",
                    value: application.position.lowSalary,
                    readOnly: true,
                  },
                  {
                    anchorString: "**employmentType**",
                    anchorYOffset: "0",
                    anchorUnits: "pixels",
                    anchorXOffset: "0",
                    value: application.jobPosting.employmentType,
                    readOnly: true,
                  },
                  {
                    anchorString: "**location**",
                    anchorYOffset: "0",
                    anchorUnits: "pixels",
                    anchorXOffset: "0",
                    value: "Ireland",
                    readOnly: true,
                  },
                  {
                    anchorString: "**benefit1**",
                    anchorYOffset: "0",
                    anchorUnits: "pixels",
                    anchorXOffset: "0",
                    value: application.jobPosting.benefits[0] || "N/A",
                    readOnly: true,
                  },
                  {
                    anchorString: "**benefit2**",
                    anchorYOffset: "0",
                    anchorUnits: "pixels",
                    anchorXOffset: "0",
                    value: application.jobPosting.benefits[1] || "N/A",
                    readOnly: true,
                  },
                  {
                    anchorString: "**benefit3**",
                    anchorYOffset: "0",
                    anchorUnits: "pixels",
                    anchorXOffset: "0",
                    value: application.jobPosting.benefits[2] || "N/A",
                    readOnly: true,
                  },
                  {
                    anchorString: "**hiringManagerName**",
                    anchorYOffset: "0",
                    anchorUnits: "pixels",
                    anchorXOffset: "0",
                    value: `${application.position.hiringManager.fName} ${application.position.hiringManager.lName}`,
                    readOnly: true,
                  },
                  {
                    anchorString: "**hiringManagerEmail**",
                    anchorYOffset: "0",
                    anchorUnits: "pixels",
                    anchorXOffset: "0",
                    value: application.position.hiringManager.email,
                    readOnly: true,
                  },
                ],

                dateSignedTabs: [
                  {
                    anchorString: "**candidate_date**",
                    anchorYOffset: "0",
                    anchorUnits: "pixels",
                    anchorXOffset: "0",
                  },
                ],
              },
            },
            {
              email: application.position.hiringManager.email,
              name: `${application.position.hiringManager.fName} ${application.position.hiringManager.lName}`,
              recipientId: "2",
              routingOrder: 2,
              tabs: {
                signHereTabs: [
                  {
                    anchorString: "**manager_signature**",
                    anchorYOffset: "0",
                    anchorUnits: "pixels",
                    anchorXOffset: "0",
                  },
                ],
                dateSignedTabs: [
                  {
                    anchorString: "**manager_date**",
                    anchorYOffset: "0",
                    anchorUnits: "pixels",
                    anchorXOffset: "0",
                  },
                ],
              },
            },
          ],
        },

        status: "sent", // "sent" to send immediately, "created" to save as draft
      };

      const createEnvelopeUrl = `${process.env.DOCUSIGN_BASE_URL}/restapi/v2.1/accounts/${process.env.DOCUSIGN_ACCOUNT_ID}/envelopes`;

      const createdEnvelopeResponse = await axios.post(
        createEnvelopeUrl,
        envelopeDefinition,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (createdEnvelopeResponse.status === 201) {
        application.contractId = createdEnvelopeResponse.data.envelopeId;
        application.contractStatus = "sent";

        let updatedApp = await application.save();

        return res.status(200).json({
          message: "Contract sent via DocuSign successfully",
          application: updatedApp,
        });
      } else {
        console.log(createdEnvelopeResponse.request.data);
        return res
          .status(500)
          .json({
            message:
              "Error creating envelope in DocuSign please contact your system admin",
          });
      }
    }
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
  offerJobApplication,
};
