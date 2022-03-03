const path = require("path");
const notes = require(path.resolve("src/data/notes-data"));


// middleware functions

function noteExists(req, res, next) {
  const noteId = Number(req.params.noteId);
  const foundNote = notes.find((note) => note.id === noteId);
  
  if (foundNote) {
    return next();
  } else {
    return next({
      status: 404,
      message: `Note id not found: ${noteId}`,
    });
  }
};

function hasText(req, res, next) {
  const { data: { text } = {} } = req.body;
  
  if (text) {
    return next();
  }
  return next({ status: 400, message: "A 'text' property is required." });
};

// route handler for GET endpoint

function list(req, res) {
  res.json({ data: notes });
}

// route handler for POST endpoint

function createNote(req, res, next) {
  const { data: { text } = {} } = req.body;

  const newNote = {
    id: notes.length + 1, // Assign the next ID
    text,
  };
  notes.push(newNote);
  res.status(201).json({ data: newNote });
}

// route handler for /notes:/noteId path

function readNote(req, res, next) {
  const noteId = Number(req.params.noteId);
  const foundNote = notes.find((note) => note.id === noteId);
  res.json({ data: foundNote });
}

// route handler for PUT endpoint

function update(req, res) {
  const { noteId } = req.params;
  const foundNote = notes.find((note) => note.id === Number(noteId));
  const originalNote = foundNote.text;
  const { data: { text } } = req.body;
  
  if (originalNote !== text) {
    foundNote.text = text; 
  }
  
  res.json({ data: foundNote });
}

// route handler for DELETE endpoint

function destroy(req, res) {
  const { noteId } = req.params;
  const index = notes.findIndex((note) => note.id === Number(noteId));
  
  notes.splice(index, 1);
  
  res.sendStatus(204);
}

// exports

module.exports = {
  list,
  create: [hasText, createNote],
  read: [noteExists, readNote],
  update: [noteExists, hasText, update],
  delete: [noteExists, destroy]
}


