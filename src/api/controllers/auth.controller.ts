import { Router, Request, Response, NextFunction } from 'express';
import AuthModule from '../modules/auth.module';
import ResponseHelper from '../helpers/response';

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

export default AuthController;
