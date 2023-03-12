//Import express package
const express = require('express');
const path = require('path');
const fs = require('fs');
const apiRoutes = require("./routes/apiRoutes");
const htmlRoutes = require("./routes/htmlRoutes");

//Helper method for generating unique ids
const uuid = require('./helpers/uuid');

const PORT = 3001;

//Initialize the app variable by setting it to the value of express()
const app = express();

//Set up the Express app to handle data parsing (middleware for parsing json and urlencoded data)
app.use(express.urlencoded({ extended: true}));
app.use(express.json());

//Serve css files and js files from the public directory, allowing to reference files with their relative path
//Add a static middleware for serving assets in the public folder
app.use(express.static('public'));
app.use("/", apiRoutes);
app.use("/", htmlRoutes);

app.listen(PORT, () => console.log(`App listening at http://localhost:${PORT}`));