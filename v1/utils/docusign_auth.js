// utils.js
const fs = require("fs");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const path = require("path"); // Import the path module
require("dotenv").config(); // Load environment variables from .env
const {
  DOCUSIGN_USER_ID,
  DOCUSIGN_INTEGRATION_KEY,
  DOCUSIGN_JWT_AUTH_URL,
  DOCUSIGN_TOKEN_URL,
} = process.env;

const getAccessToken = async () => {
  try {
    const privateKeyPath = path.join(__dirname, "../../private_key.pem");
    const PRIVATE_KEY = fs.readFileSync(privateKeyPath, "utf8");
    // JWT claims
    const jwtPayload = {
      iss: DOCUSIGN_INTEGRATION_KEY,
      sub: DOCUSIGN_USER_ID,
      aud: `${DOCUSIGN_JWT_AUTH_URL}`,
      iat: Math.floor(Date.now() / 1000),
      exp: 1767125730, // Token valid for 1 hour
      scope: "signature impersonation",
    };

    // res.json("Hello");

    // Generate JWT token
    const jwtToken = jwt.sign(jwtPayload, PRIVATE_KEY, { algorithm: "RS256" });

    // // Axios configuration to request the access token
    const tokenConfig = {
      method: "post",
      url: DOCUSIGN_TOKEN_URL,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: new URLSearchParams({
        grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
        assertion: jwtToken,
      }).toString(),
    };

    // Request the access token using axios
    const tokenResponse = await axios(tokenConfig);

    if (tokenResponse.status === 200) {
      const accessToken = tokenResponse.data.access_token;
      return { access_token: accessToken };
    } else {
      return tokenResponse.error;
    }
  } catch (error) {
    console.error(
      "Error generating JWT token or requesting access token:",
      error
    );

    return { status: 500, message: error.message };
  }
};

module.exports = {
  getAccessToken,
};
