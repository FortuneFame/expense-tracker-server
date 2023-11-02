import { Router, Request, Response, NextFunction } from 'express';
import passport from 'passport';
import TrackerModule from '../modules/tracker.module';
import ResponseHelper from '../helpers/response';

const TrackerController: Router = Router();

TrackerController.get("/", passport.authenticate('jwt', { session: false }), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const list = await TrackerModule.getTracker({ id: req.user!.id }, next);
    ResponseHelper.sendResponse(res, list);
  } catch (error) {
    next(error);
  }
});

export default TrackerController;
