import { MongoClient } from 'mongodb';
import { getUserFromToken } from '../utils/redis'; // Adjust path if needed

const dbUrl = 'mongodb://localhost:27017';
const dbName = 'file_manager_db';

async function getShow(req, res) {
    const { id } = req.params;
    const token = req.headers['x-token'];

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const user = await getUserFromToken(token);
        if (!user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const client = await MongoClient.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true });
        const db = client.db(dbName);
        const filesCollection = db.collection('files');

        const file = await filesCollection.findOne({ _id: id, userId: user._id });
        if (!file) {
            return res.status(404).json({ error: 'Not Found' });
        }

        res.json(file);
        client.close();
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

async function getIndex(req, res) {
    const { parentId = 0, page = 0 } = req.query;
    const token = req.headers['x-token'];

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const user = await getUserFromToken(token);
        if (!user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const client = await MongoClient.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true });
        const db = client.db(dbName);
        const filesCollection = db.collection('files');

        const limit = 20;
        const skip = page * limit;

        const files = await filesCollection
            .find({ parentId, userId: user._id })
            .skip(skip)
            .limit(limit)
            .toArray();

        res.json(files);
        client.close();
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export default {
    getShow,
    getIndex,
};
