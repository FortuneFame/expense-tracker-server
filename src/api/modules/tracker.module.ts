// import { NextFunction } from 'express';
// import prisma from '../helpers/database';


// class Tracker {
//     async getTracker(req: CustomRequest, next: NextFunction): Promise<TrackerResponse | void> {
        
//         try {
//             const trackerData = await prisma.tracker.findMany({
//                 where: {
//                     user_id: req.user_id,
//                 },
//                 include: {
//                     user: {
//                         include: {
//                             Income: true,
//                             Expense: true,
//                         }
//                     }
//                 },
//             });

//             console.log(trackerData);

//             return {
//                 status: true,
//                 code: 200,
//                 message: "All Tracker Data with Income and Expense",
//                 data: trackerData,
//             };
//         } catch (error) {
//             console.error("getTracker Error: ", error);
//             next(error);
//         }
//     }
// }


// export default new Tracker();
