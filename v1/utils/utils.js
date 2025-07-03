const { v4: uuidv4 } = require("uuid");

const traceMiddleware = (req, res, next) => {
  // Generate a new unique trace token for each request
  const traceToken = uuidv4();

  req.traceToken = traceToken; // Attach to request object

  // Set trace token in response headers for debugging & tracing across services
  res.setHeader("X-Trace-Token", traceToken);

  next();
};

const isEmpty = (value) => {
  return (
    value === undefined ||
    value === null ||
    (typeof value === "string" && value.trim() === "") ||
    (Array.isArray(value) && value.length === 0) ||
    (typeof value === "object" && Object.keys(value).length === 0)
  );
};

const verifyAdminOrAgent = (req, res, next) => {
  // const

  let { role } = req.user;

  if (!role.includes("admin") && !role.includes("agent")) {
    logger.error({
      data: {
        status: 500,
        traceToken: req.traceToken,
        apiAction: "ROLE_VERFICATION",
        apiEndpoint: req.originalUrl,
        method: req.method,
        mess: "USER DOESN'T HAVE ACCESS TO THIS RESOURCE, NEEDS TO BE AN AGENT OR ADMIN",
      },
    });
    return res
      .status(403)
      .json({ message: "Access Denied: Only Agents and Admins" });
  }
  next();
};
const verifyAdminOrHR = (req, res, next) => {
  // const

  let { role } = req.user;

  if (!role.includes("admin") && !role.includes("hr")) {
    logger.error({
      data: {
        status: 500,
        traceToken: req.traceToken,
        apiAction: "ROLE_VERFICATION",
        apiEndpoint: req.originalUrl,
        method: req.method,
        mess: "USER DOESN'T HAVE ACCESS TO THIS RESOURCE, NEEDS TO BE AN AGENT OR ADMIN",
      },
    });
    return res
      .status(403)
      .json({ message: "Access Denied: Only Agents and Admins" });
  }
  next();
};

module.exports = {
  isEmpty,
  verifyAdminOrAgent,
  verifyAdminOrHR,
  traceMiddleware,
};
