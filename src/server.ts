import express, { Request, Response } from "express";
import cors from "cors";
import routes from "./api/routes";
import passport from "./api/passport/passport.config";
import errorHandlerMiddleware from "./api/helpers/errorHandlerMiddleware";

require('dotenv').config();

const app = express();
const PORT = process.env.PORT;

app.use(cors(
    {
        origin: 'http://localhost:5173',
        credentials: true,
        optionsSuccessStatus: 200
    }
));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", async (req: Request, res: Response) => {
  res.status(201).send({
    status: true,
    message: "Hello this is API",
  });
});

app.use(passport.initialize()); 

app.use(errorHandlerMiddleware)
routes(app);


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});