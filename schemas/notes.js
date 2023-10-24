const mongoose = require('mongoose');
const { Schema } = mongoose


const NotesSchema = Schema({
    text: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    }
})

// Models
const Notes = mongoose.model("notes", NotesSchema)

// Export All
exports.Notes = Notes