const { default: axios } = require("axios");
const User = require("../models/User");
const { log } = require("winston");
const JobApplication = require("../models/JobApplication");
const JobPosting = require("../models/JobPosting");
const { transporter } = require("../utils/utils");

const docusignWebhook = async (req, res) => {
  let { data, event } = req.body;

  !data || !event
    ? res.status(400).json({ message: "Invalid webhook payload." })
    : res.status(200).json({ message: "Webhook received successfully." });

  //process the webhook
  // event can be: envelope-completed, recipient-completed, etc
  // console.log(data);
  if (event === "envelope-completed") {
    console.log("The envelope is completed");

    //Find the applicant associated with this envelope
    const contractId = data.envelopeId;
    let applicant = await JobApplication.findOne({ contractId });

    console.log({ event });
    //update the status of the job posting to closed if aplicant is hired
    // let jobPosting =

    //create employee record if applicant is hired
    //send welcome email to the new employee
    //create employee email account in  zoho

    if (applicant) {
      console.log("Applicant found, updating status to hired");

      //send email to applicant
      // await sendEmail({
      //   to: applicant.email,
      //   subject: "Congratulations! You're Hired",
      //   text: `Dear ${applicant.name},\n\nWe are pleased to inform you that you have been hired for the position of ${applicant.position} at our company. Welcome aboard!\n\nBest regards,\nCompany HR Team`,
      // });
      //update applicant status to hired
      const updatedApplicant = await JobApplication.findOneAndUpdate(
        { contractId },
        { status: "hired" },
        { new: true }
      );
      console.log(updatedApplicant);

      console.log("------------------------");

      console.log("Applicant status updated to hired:", updatedApplicant);
      console.log("-----------------------------------");
      console.log("Proceeding with post-hire processes...");
      console.log("-----------------------------------");
      //create employee email account in zoho
      let zohoPayload = {
        firstName: applicant.firstName,
        lastName: applicant.lastName,
        displayName: `${applicant.firstName} ${applicant.lastName}`,
        primaryEmail: `${applicant.firstName}.${applicant.lastName}@boylerinmail.eu`,
        password: "Temp$Password123",
        role: "User",
        status: "active",
        forceChangePassword: true,
      };

      async function createZohoUser(user) {
        try {
          const response = await axios.post(
            `https://mail.zoho.com/api/organization/${process.env.ZOHO_ORG_ID}/users`,
            user,
            {
              headers: {
                Authorization: `Zoho-oauthtoken ${ACCESS_TOKEN}`,
                "Content-Type": "application/json",
              },
            }
          );

          console.log("Zoho user created:", response.data);
          return response.data;
        } catch (error) {
          console.error(
            "Error creating Zoho user:",
            error.response?.data || error.message
          );
          throw error;
        }
      }

      //get zoho access token using the refresh token
      async function getZohoAccessToken() {
        try {
          const response = await axios.post(
            "https://accounts.zoho.eu/oauth/v2/token",
            null,
            {
              params: {
                refresh_token: process.env.ZOHO_REFRESH_TOKEN,
                client_id: process.env.ZOHO_CLIENT_ID,
                client_secret: process.env.ZOHO_CLIENT_SECRET,
                grant_type: "refresh_token",
              },
            }
          );
          ACCESS_TOKEN = response.data.access_token;
          console.log("Zoho Access Token:", ACCESS_TOKEN);
          return ACCESS_TOKEN;
        } catch (error) {
          console.error(
            "Error fetching Zoho access token:",
            error.response?.data || error.message
          );
          throw error;
        }
      }
      let zohoAccessToken = await getZohoAccessToken();

      console.log("Zoho Access Token retrieved:", zohoAccessToken);

      // Call the function
      // let createdZohoUser = await createZohoUser(newUser);
      let createdZohoUser = await createZohoUser(zohoPayload);

      console.log("Created Zoho User:", createdZohoUser);

      //create employee record if applicant is hired
      // const newEmployee = new User({

      // create employee email account in zoho
      // await createZohoEmailAccount(applicant);

      //for testing purposes only
      //set the applicaant status to shortlisted so we can send another envelope directly

      applicant.status = "shortlisted";
      await applicant.save();
    } else {
      console.log("No applicant found for this envelopeId");
    }
  } else {
    console.log("Event type not currently handled:", event);
  }
};

module.exports = {
  docusignWebhook,
};
