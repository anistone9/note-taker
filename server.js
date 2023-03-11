//Import express package
const express = require('express');
const path = require('path');
const fs = require('fs');

//Is this still needed, since writeFile and readFile need the actual path?
const notesData = require('./db/db.json');

//Helper method for generating unique ids
const uuid = require('./helpers/uuid');

const PORT = process.env.PORT || 3001;

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
    res.sendFile(path.join(__dirname, '/public/notes.html'));
});

//GET route to return the 'index.html' file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

//GET route for api/notes to read the db.json file and return all saved notes as JSON
app.get('/api/notes', (req, res) => {
    console.info(`${req.method} request received for notes`);
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
        console.log(err);
    } else {
        //Convert string into JSON object
        const parsedNotes = JSON.parse(data);
        res.json(parsedNotes);
    }
    });
});

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

        //Obtain existing notes
        fs.readFile('./db/db.json', 'utf8', (err, data) => {
            if (err) {
                console.log(err);
            } else {
                const parsedNotes = JSON.parse(data);

                //Add a new note
                parsedNotes.push(newNote);

                //Write updated notes back to the file
                fs.writeFile('./db/db.json', JSON.stringify(parsedNotes, null, 4),
                (writeErr) => 
                    writeErr 
                    ? console.error(writeErr)
                    : console.info('Successfully updated notes')
                );
            }
        });

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