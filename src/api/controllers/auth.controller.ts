import { Router, Request, Response, NextFunction } from 'express';
import AuthModule from '../modules/auth.module';
import ResponseHelper from '../helpers/response';
import tokenBlacklistCheck from '../helpers/tokenBlacklistCheck';

const AuthController: Router = Router();

AuthController.post("/register", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const add = await AuthModule.register(req.body, next);
    ResponseHelper.sendResponse(res, add);
  } catch (error) {
    next(error);
  }
});

AuthController.post("/login", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const login = await AuthModule.login(req.body, next);
    ResponseHelper.sendResponse(res, login);
  } catch (error) {
    next(error);
  }
});

AuthController.post("/logout", tokenBlacklistCheck, async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    return res.status(401).json({
      status: false,
      code: 401,
      error: "No token provided"
    });
  }
  const result = await AuthModule.logout(token, next);
  ResponseHelper.sendResponse(res, result);
});

AuthController.get("/current-user", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await AuthModule.getCurrentUser(req,res, next);
    ResponseHelper.sendResponse(res, user);
  } catch (error) {
    next(error);
  }
});



export default AuthController;
