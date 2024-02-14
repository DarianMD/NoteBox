/*const https = require('https');
const fs = require('fs');
const cheerio = require('cheerio'); */

import * as url from 'url';

/*function fetchData(url, page, userID){
    return new Promise((resolve, rejects) =>
    {
        https.get(url, function(res){
            res.setEncoding('utf8');
            let rawData = '';

        }
            


    
)}*/



export default function urlRecon(urlWeb){
    

    let dominio = url.parse(urlWeb, true);
    let host = dominio.host;

    dominio = host.replace(/^www\.|\.com$/gi, '');

    return dominio;
}

