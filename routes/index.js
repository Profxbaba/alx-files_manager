import express from 'express';
import FilesController from '../controllers/FilesController.js'; // Ensure this path and file extension

const router = express.Router();

router.post('/files', FilesController.postUpload);

export default router;
