import mediachema from '../models/media.model.js'

import fetchData from '../libs/media.lib.js'

export const postmedia = (req, res) => {
    const {url} = req.body;

    fetchData(url, null);

    res.send('postmovie');
}
export const getmedia = (req, res) => res.send('getmovie');