const express = require('express');
const router = express.Router();
const { Notes } = require('../schemas/notes');
const { validateNotes } = require('../functions/validate');




// =======================================================>
// Get All Notes ( GET )
// =======================================================>

router.get('/allnotes', async (req, res) => {
    try {

        // Get and send notes.
        const notes = await Notes.find().sort({ _id: -1 });
        res.send(notes);

    } catch (error) {

        // handle error
        res.status(500).json({ error: 'There is a problem' });

    }
});

// =======================================================>
// Post Single Note ( POST )
// =======================================================>

router.post('/uploadnote', async (req, res) => {
    try {

        // check validation of note
        const { error } = validateNotes(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        // new note
        const { text, time } = req.body;
        const note = new Notes({
            text,
            time
        })

        // save and send product
        const savedNote = await note.save();
        res.status(200).send(savedNote);

    } catch (error) {

        // handle error
        console.log(error);
        res.status(500).json({ error: 'There is a problem' });

    }
});

// =======================================================>
// Edit Single Note ( PUT )
// =======================================================>

router.put('/editnote', async (req, res) => {
    try {

        // get id
        const { noteId } = req.query;

        // validation check
        const { error } = validateNotes(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        }

        // id validation check
        const noteRealId = await Notes.findById(noteId);
        if (!noteRealId) {
            return res.status(404).send("Note id is not found")
        }

        // update note
        const updateNoteObj = {
            text: req.body.text,
            time: req.body.time
        }

        // update and send ready Note
        const updatedNote = await Notes.findByIdAndUpdate(noteId, updateNoteObj, { new: true });
        const updatedReadyNote = await updatedNote.save();
        res.send(updatedReadyNote);

    } catch (error) {

        // handle error
        console.log(error);
        res.status(500).json({ error: 'There is a problem' });

    }
});

// =======================================================>
// Delete Single Note ( DELETE )
// =======================================================>

router.delete('/deletenote', async (req, res) => {
    try {

        // get id
        const { noteId } = req.query

        // id validation check
        const noteRealId = await Notes.findById(noteId);
        if (!noteRealId) {
            return res.status(404).send("Note id is not found");
        }

        // delete note
        const note = await Notes.findByIdAndDelete({ _id: noteId });
        res.status(200).send(note);

    } catch (error) {

        // handle error
        res.status(500).json({ error: 'There is a problem' });

    }
})


module.exports = router;