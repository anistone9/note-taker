const router = require("express").Router();
const fs = require('fs');
const uuid = require('../helpers/uuid');

//GET route to read the db.json file and return all the saved notes as JSON
router.get('/api/notes', (req, res) => {
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
router.post('/api/notes', (req, res) => {
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
            id: uuid(),
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

//DELETE route to remove a specific note
router.delete('/api/notes/:id', (req, res) => { 
    const noteId = req.params.id;

    //Read all the notes from db.json
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.log(err);
        } else {
            const parsedNotes = JSON.parse(data);

    //Filter note that matches the parameter ID
   const deletedNotes = parsedNotes.filter(note => note.id !== noteId);

    //Write updated notes back to the file
    fs.writeFile('./db/db.json', JSON.stringify(deletedNotes, null, 4), 
    (writeErr) => 
        writeErr 
        ? console.error(writeErr)
        : console.info('Successfully updated notes')
        );
    res.json(deletedNotes);
};
});
});

module.exports = router;
