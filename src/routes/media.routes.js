import { Router } from "express";
import { postmedia , getmedia} from "../controllers/media.controller.js";

const mediaRoutes = Router();

mediaRoutes.post('/postmedia', postmedia)
mediaRoutes.get('/getmedia', getmedia)

export default mediaRoutes;