const Property = require("../v1/models/Property");
const propertiesData = require("../propertyData.json");
const { default: mongoose } = require("mongoose");
require("dotenv").config();

// Mongo DB Connections
mongoose
  .connect(
    "mongodb+srv://sean94:nWfd9n56UFEV54SC@cluster0.3d1pt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then((response) => {
    console.log("MongoDB Connection Succeeded.");
    console.log(response.model.db.name);
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
