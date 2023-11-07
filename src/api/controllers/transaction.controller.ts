// import { Router, Request, Response, NextFunction } from 'express';
// import TransactionHistoryModule from '../modules/transaction.module';
// import ResponseHelper from '../helpers/response';
// import passport from '../passport/passport.config';

// const TransactionController: Router = Router();

// TransactionController.get("/", passport.authenticate('jwt', { session: false }), async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const transactionHistory = await TransactionHistoryModule.getTransactionHistory({ user_id: req.user!.id }, next);
//     ResponseHelper.sendResponse(res, transactionHistory);
//   } catch (error) {
//     next(error);
//   }
// });

// export default TransactionController;