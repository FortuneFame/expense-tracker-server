import { Response } from "express";

class ResponseHelper {
  sendResponse(res: Response, data: any) {
    try {

      if (data.code) {

        res.status(data.code);
        delete data.code;

        res.send(data);
        return true;
      }
      res.status(data && data.status ? 200 : 400);
      res.send(data);

    } catch (error) {

      res.status(400).send({
        status: false,
        error,
        
      });
    }
  }
}

export default new ResponseHelper();
