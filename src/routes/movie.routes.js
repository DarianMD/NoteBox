import { Router } from "express";
import { postmovie , getmovie} from "../controllers/movie.controller.js";

const movieRoutes = Router();

movieRoutes.post('/postmovie', postmovie)
movieRoutes.get('/getmovie', getmovie)

export default movieRoutes;