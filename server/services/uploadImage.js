import multer from 'multer';
import cloudinary from 'cloudinary';

cloudinary.config({
  cloud_name: 'larrystone',
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

/**
 * @description - Upload image to memory with multer
 *
 * @param {object} req - HTTP request
 *
 * @param {object} res - HTTP response
 *
 * @returns {Promise} promise - Asynchronous response
 */
export const uploadWithMulter = (req, res) => {
  const promise = new Promise((resolve, reject) => {
    multer({
      storage: multer.memoryStorage(),
      limits: { fileSize: 200 * 1024 * 1024, files: 1 },
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
          return callback(new Error('Only Images are allowed !'), false);
        }

        callback(null, true);
      }
    }).single('image')(req, res, (error) => {
      if (error) {
        reject(error);
      }
      resolve(req);
    });
  });
  return promise;
};

export default cloudinary.uploader;
