const express = require('express');
const path = require('path');
const { readFromFile, readAndAppend } = require('./helpers/fsUtils');

const PORT = 3001;

const app = express();

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware to serve up static assets from the public folder
app.use(express.static('public'));

app.get('/api/notes', (req, res) => {
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});

app.get('/notes', (req, res)=> res.sendFile(path.join(__dirname, 'public/notes.html'))
);

app.post('/api/notes', (req, res) => {
    const { title, text } = req.body;

    if (req.body) {
        const noteNew = {
            title,
            text,
            id: uuid(),
        };

        readAndAppend(noteNew, './db/db.json');
        res.json('Note added successfully');
    } else {
        res.error('Error in adding note');
    }


});

app.get('*', (req, res) => res.sendFile(path.join(__dirname, '/public/index.html'))
);



app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
