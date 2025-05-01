const multer = require('multer');

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true); 
  } else {
    cb(new Error('Only .jpg or .png files are allowed!'), false); 
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter
});

module.exports = upload;
