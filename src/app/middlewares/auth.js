import jwt from 'jsonwebtoken';
import { promisify } from 'util';

import authConfig from '../../config/auth';

export default async (req, res, next) => {
  // read token
  const token = req.headers.authorization;

  // const [_, token] = authHeader.split(' ');

  if (!token) {
    res.status(401).json({ error: 'Token not provided' });
  }

  // extrair token do id
  try {
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);

    req.userId = decoded.id;

    return next();
  } catch (error) {
    return res.status(401).json({ error: 'Token invalid' });
  }
};
