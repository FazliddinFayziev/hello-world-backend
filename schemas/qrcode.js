const mongoose = require('mongoose');
const { Schema } = mongoose

const QrCodeSchema = Schema({
    logoLetter: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    smallText: {
        type: String,
        required: true,
    },
    icons: [
        {
            instagram: {
                type: String,
                required: false
            },
            telegram: {
                type: String,
                required: false
            },
            facebook: {
                type: String,
                required: false
            },
            twitter: {
                type: String,
                required: false
            },
            github: {
                type: String,
                required: false
            },
            linkedIn: {
                type: String,
                required: false
            },
            website: {
                type: String,
                required: false
            },
            youtube: {
                type: String,
                required: false
            }
        }
    ]

})

// Models
const QrCode = mongoose.model("qrcode", QrCodeSchema);

// Exporting All
exports.QrCode = QrCode;