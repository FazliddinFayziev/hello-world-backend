const path = require('path');

// Define file filter function
const fileFilter = (req, file, cb) => {
    var ext = path.extname(file.originalname);
    if (
        ext !== '.png' &&
        ext !== '.jpg' &&
        ext !== '.gif' &&
        ext !== '.jpeg'
    ) {
        req.fileValidationError = 'Only images are allowed.';
        return cb(null, false);
    }
    cb(null, true);
};

exports.fileFilter = fileFilter