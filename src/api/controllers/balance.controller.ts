import { Router, Request, Response, NextFunction } from 'express';
import passport from 'passport';
import BalanceModule from '../modules/balance.module';
import ResponseHelper from '../helpers/response';

const BalanceController: Router = Router();

BalanceController.get("/", passport.authenticate('jwt', { session: false }), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const balance = await BalanceModule.getBalance({ id: req.user!.id }, next);
    ResponseHelper.sendResponse(res, balance);
  } catch (error) {
    next(error);
  }
});

export default BalanceController;