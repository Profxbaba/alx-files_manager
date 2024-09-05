import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import redis from '../utils/redis.js';
import dbClient from '../utils/db';

class FilesController {
  static async postUpload(req, res) {
    const { name, type, parentId, isPublic = false, data } = req.body;
    const token = req.headers['x-token'];

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!name) {
      return res.status(400).json({ error: 'Missing name' });
    }

    if (!type || !['folder', 'file', 'image'].includes(type)) {
      return res.status(400).json({ error: 'Missing type' });
    }

    if (type !== 'folder' && !data) {
      return res.status(400).json({ error: 'Missing data' });
    }

    try {
      // Retrieve user ID from Redis using the token
      const userId = await redisClient.get(`auth_${token}`);
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Validate parentId if provided
      if (parentId) {
        const db = dbClient.db('files_manager');
        const parent = await db.collection('files').findOne({ _id: new ObjectId(parentId) });

        if (!parent) {
          return res.status(400).json({ error: 'Parent not found' });
        }

        if (parent.type !== 'folder') {
          return res.status(400).json({ error: 'Parent is not a folder' });
        }
      }

      let localPath = null;

      // Save file data to disk if type is not 'folder'
      if (type !== 'folder') {
        const folderPath = process.env.FOLDER_PATH || '/tmp/files_manager';
        if (!fs.existsSync(folderPath)) {
          fs.mkdirSync(folderPath, { recursive: true });
        }

        const fileId = uuidv4();
        localPath = path.join(folderPath, fileId);

        // Write the file content to disk
        fs.writeFileSync(localPath, Buffer.from(data, 'base64'));
      }

      // Save file metadata to database
      const db = dbClient.db('files_manager');
      const newFile = {
        userId: new ObjectId(userId),
        name,
        type,
        isPublic,
        parentId: parentId ? new ObjectId(parentId) : 0,
        localPath,
      };

      const result = await db.collection('files').insertOne(newFile);
      const file = result.ops[0];

      res.status(201).json({
        id: file._id.toString(),
        userId: file.userId.toString(),
        name: file.name,
        type: file.type,
        isPublic: file.isPublic,
        parentId: file.parentId.toString(),
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export default FilesController;
