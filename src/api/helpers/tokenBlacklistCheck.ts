import { Request, Response, NextFunction } from 'express';
import { isTokenBlacklisted } from '../helpers/tokenBlacklist';

const tokenBlacklistCheck = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  
  if (!token) {
    return res.status(401).json({
      status: false,
      code: 401,
      error: "Authorization header missing or improperly formed."
    });
  }

  if (isTokenBlacklisted(token)) {
    return res.status(401).json({
      status: false,
      code: 401,
      error: "This token is blacklisted. Please log in again."
    });
  }

  next();
};

export default tokenBlacklistCheck;
