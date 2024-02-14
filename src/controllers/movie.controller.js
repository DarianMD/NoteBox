import movieSchema from '../models/movie.model.js'

import fetchData from '../libs/movie.lib.js'

export const postmovie = (req, res) => {
    const {url} = req.body;

    fetchData(url, null);

    res.send('postmovie');
}
export const getmovie = (req, res) => res.send('getmovie');