const Property = require("../v1/models/Property");
const propertiesData = require("../propertyData.json");
const { default: mongoose } = require("mongoose");
require("dotenv").config();

// Mongo DB Connections
mongoose
  .connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((response) => {
    console.log("MongoDB Connection Succeeded.");
  })
  .catch((error) => {
    console.log("Error in DB connection: " + error);
  });
// console.log(propertiesData);

const seedProperties = async () => {
  console.log(propertiesData);

  try {
    await Property.deleteMany({});
    const properties = await Property.insertMany(propertiesData);
    console.log("Properties seeded successfully");
  } catch (error) {
    console.log("Error seeding properties: ", error.message);
  }
};

seedProperties();
