const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 600 }); // TTL de 10 minutos

const cacheMiddleware = (req, res, next) => {
    const key = req.originalUrl || req.url;
    const cachedData = cache.get(key);
    
    if (cachedData) {
        return res.status(200).json(cachedData);
    } else {
        const originalJson = res.json;
        
        res.json = (body) => {
            cache.set(key, body);
            originalJson.call(res, body); // Chamando a função original res.json para enviar a resposta
        };
        
        next();
    }
};

module.exports = cacheMiddleware;
