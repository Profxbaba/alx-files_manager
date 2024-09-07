import redis from 'redis';

const client = redis.createClient();

export function getUserFromToken(token) {
    return new Promise((resolve, reject) => {
        client.get(token, (err, userJson) => {
            if (err) {
                return reject(err);
            }
            resolve(JSON.parse(userJson));
        });
    });
}
