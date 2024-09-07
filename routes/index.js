import express from 'express';
import FilesController from '../controllers/FilesController';

const router = express.Router();

// GET /files/:id => FilesController.getShow
router.get('/files/:id', FilesController.getShow);

// GET /files => FilesController.getIndex
router.get('/files', FilesController.getIndex);

export default router;
