const multer = require('multer');
const ApiError = require('../utils/apiError');


const multerOptions = () => {
    
    const multerStorage = multer.memoryStorag();

    const multerFilter = function (req,file,cb) {
        if (file.mimetype.startWith('image')) {
            cb(null,true);
        } else {
            cb(new ApiError('Only Image Allowed',400));
        }
    };

    const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

    return upload;
};

exports.uploadSingleImage = (fieldName) => multerOptions().single(fieldName);

exports.uploadMixOfImage = (arrayOfFields) =>
    multerOptions().fields(arrayOfFields);