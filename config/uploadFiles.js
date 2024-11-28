const multer = require('multer');
const path = require('path');

// Set up storage options for multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      return cb(null, './uploads');
    },
    filename: (req, file, cb) => {
      return cb(null, `${Date.now()}-${file.originalname}`);
    }
  });

// File filter for the /uploadProfileImage route (allowing only certain file types)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(file.originalname.toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  
  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Only .jpeg, .jpg, .png, and .gif files are allowed'), false);
  }
};



// Set up multer for the specific route, with fileFilter and storage options
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // Optional: Limit file size to 5MB
});

module.exports = {upload};