import * as urlF from 'url';
import * as cheerio from 'cheerio';
import * as fs from 'fs';
import * as https from 'https';
import * as axios from 'axios';


import mediachema from '../models/media.model.js'
import * as media from '../libs/media.lib.js'

export const postmedia = (req, res) => {
    const {url} = req.body;

    let dominio = urlF.parse(url, true);
    let httpUrl;


    const hostInput = {
        dominio: urlF.parse(url, true),
        hostname: media.urlHost(dominio.href),
        httpUrl: null,
        userID: null,
        hostData: null,
        page: null,
        titleAtribute: null,
        ratingAtribute: null,
        fileRoute: null,
        type: null
    }


    console.log(hostInput);

  
    switch (hostInput.hostname){
        case media.HOST_ENUM.filmaffinity.hostname:
            if(dominio.query.p == null && hostInput.page == null){
                hostInput.page = 1;
            }
            else{
            hostInput.page = hostInput.dominio.query.p;
            }
            hostInput.userID = dominio.query.user_id;
            httpUrl = 'https://www.filmaffinity.com/es/userratings.php?user_id='+ dominio.query.user_id+'&p='+ hostInput.page

            hostInput.type = media.HOST_ENUM.filmaffinity.typeMedia
            break;
        case media.HOST_ENUM.imdb.hostname:
            dominio.pathname = dominio.pathname.replace('ratings','');
            httpUrl = 'https://www.imdb.com/'+ dominio.pathname +'/ratings';
            break;
         case media.HOST_ENUM.letterboxd.hostname:
            dominio.pathname = dominio.pathname.replace('films/','');
            httpUrl = 'https://letterboxd.com' + dominio.pathname + 'films/';
            break;
        case media.HOST_ENUM.rateyourmusic.hostname:
            httpUrl = dominio.href;
    }

    hostInput.fileRoute = ('./src/tmp/'+media.urlHost(url) + '_' + hostInput.userID + '_' + hostInput.page + '.html');
    console.log(hostInput);




    //media.fetchData(dominio, httpUrl, fileRoute, user_id, hostData, page, null);
    


    res.send('postmovie');
}
export const getmedia = (req, res) => res.send('getmovie');