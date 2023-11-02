import { NextFunction } from 'express';
import prisma from '../helpers/database';

interface TrackerRequestBody {
  id: number;
}

interface TrackerResponse {
  status: boolean;
  code: number;
  message?: string;
  data?: any;
  error?: string | unknown;
}

class Tracker {
    async getTracker(body: TrackerRequestBody, next: NextFunction): Promise<TrackerResponse | void> {
        try {
            const getTracker = await prisma.tracker.findMany({
                where: {
                    user_id: body.id,
                },
            });
            console.log(getTracker);

            return {
                status: true,
                code: 200,
                message: "All Tracker Data",
                data: getTracker,
            };
        } catch (error) {
            console.error("getTracker Error: ", error);
            next(error);
        }
    }
}

export default new Tracker();
