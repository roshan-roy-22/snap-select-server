// const multer = require('multer');

// const storage = multer.diskStorage({
//     destination: (req, file, callback) => {
//         callback(null, './uploads');
//     },
//     filename: (req, file, callback) => {
//         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//         const filename = `${uniqueSuffix}-${file.originalname}`;
//         callback(null, filename);
//     }
// });

// const multerConfig = multer({
//     storage
// });

// module.exports = multerConfig;

const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, './uploads')
    },
    filename: (req, file, callback) => {
        const filename = `image-${Date.now()}-${file.originalname}`
        callback(null, filename)
    }
});

const multerConfig = multer({
    storage
})
module.exports=multerConfig
