//Import express package
const express = require('express');
const path = require('path');
const notesData = require('./db/db.json');
const PORT = process.env.PORT || 3001;

//Helper method for generating unique ids
const uuid = require('./helpers/uuid');

//Initialize the app vairable by setting it to the value of express()
const app = express();

//Set up the Express app to handle data parsing (middleware for parsing json and urlencoded data)
app.use(express.urlencoded({ extended: true}));
app.use(express.json());

//Serve css files and js files from the public directory, allowing to reference files with their relative path
//Add a static middleware for serving assets in the public folder
app.use(express.static('public'));

//GET route to return the 'notes.html' file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'notes.html'));
})

//GET route to return the 'index.html' file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
})

//GET route for api/notes to read the db.json file and return all saved notes as JSON
app.get('/api/notes', (req, res) => res.json(notesData));

//POST route to add new notes to the db.json file and return it to the client
app.post('/api/notes', (req, res) => {
    //Log that a POST request was received
    console.info(`${req.method} request received to add a note`);

    //Destructuring assignment for the items in the req.body
    const { title, text } = req.body;

    //If all the required properties are present
    if (title && text) {
        //Create new variable for the object to save
        const newNote = {
            title,
            text,
            note_id: uuid(),
        };

        const response = {
            status: 'success',
            body: newNote,
        };

        console.log(response);
        res.status(201).json(response);
    } else {
        res.status(500).json('Error in posting note');
    }
});

app.listen(PORT, () =>
console.log(`App listening at http://localhost:${PORT}`)
)