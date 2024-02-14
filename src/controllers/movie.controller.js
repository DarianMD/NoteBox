import movieSchema from '../models/movie.model.js'

import urlRecoc from '../libs/movie.lib.js'

export const postmovie = (req, res) => {
    const {url} = req.body;

    const typeHost = urlRecoc(url);

    console.log(typeHost);

    res.send('postmovie');
}
export const getmovie = (req, res) => res.send('getmovie');