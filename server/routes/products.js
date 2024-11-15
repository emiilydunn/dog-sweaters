import express from 'express';
import multer from 'multer';

const router = express.Router();

//Set up Multer for image handling 

//Multer setup to upload images
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/images/'); // save uploaded files in `public/images` folder
    },
    filename: function (req, file, cb) {
      //Get file extension
      const ext = file.originalname.split('.').pop();
      //Generate unique filename - current timestamp + random number between 0 and 1000.
      const uniqueFilename = Date.now() + '-' + Math.round(Math.random() * 1000) + '.' + ext;
      cb(null, uniqueFilename);
    }
  });
  const upload = multer({ storage: storage });



//Routes
//Get all products
router.get('/all', (req, res) => {
    res.send('All Products');
});
//Purchase
router.get('/purchase', (req, res) => {
    res.send('Purchase');
});
//Get product by ID
router.get('/:id', (req, res) => {
    res.send('Product by ID');
});



export default router;