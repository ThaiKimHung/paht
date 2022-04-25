import { nGlobalKeys } from "../../app/keys/globalKey";
import Utils from "../../app/Utils";
// const DomainIOC = Utils.getGlobal(nGlobalKeys.DomainIOC, '')

//https://ioc-cloud.com/api/dashboard/reputa/init
async function init() {
    const res = await Utils.get_api_domain(Utils.getGlobal(nGlobalKeys.DomainIOC, ''), Utils.getGlobal(nGlobalKeys.Authen, ''), `dashboard/reputa/init`, false, false, false);
    return res;
}

//https://ioc-cloud.com/api/dashboard/reputa/statistic-sentiment-by-days
async function getNoiDungTH(idTopic, datefrom, dateto) {
    let strBody = JSON.stringify({
        "topic": idTopic,
        "dateFrom": datefrom,
        "dateTo": dateto
    })
    const res = await Utils.post_api_domain(Utils.getGlobal(nGlobalKeys.DomainIOC, ''), Utils.getGlobal(nGlobalKeys.Authen, ''), `dashboard/reputa/statistic-sentiment-by-days`, strBody, false, false, false);
    Utils.nlog("BODY NOIDUNG:", strBody)
    Utils.nlog("RES NOIDUNG:", res)
    return res;
}

//https://ioc-cloud.com/api/dashboard/reputa/statistic-source-by-days
async function getPhanTramCum(idTopic, datefrom, dateto) {
    let strBody = JSON.stringify({
        "topic": idTopic,
        "dateFrom": datefrom,
        "dateTo": dateto
    })
    const res = await Utils.post_api_domain(Utils.getGlobal(nGlobalKeys.DomainIOC, ''), Utils.getGlobal(nGlobalKeys.Authen, ''), `dashboard/reputa/statistic-source-by-days`, strBody, false, false, false);
    // Utils.nlog("BODY NOIDUNG:", strBody)
    // Utils.nlog("RES NOIDUNG:", res)
    return res;
}

//https://ioc-cloud.com/api/dashboard/reputa/statistic-source-interaction
async function getNguonMXH(idTopic, datefrom, dateto, size = 5) {
    let strBody = JSON.stringify({
        "topic": idTopic,
        "dateFrom": datefrom,
        "dateTo": dateto,
        "size": size
    })
    const res = await Utils.post_api_domain(Utils.getGlobal(nGlobalKeys.DomainIOC, ''), Utils.getGlobal(nGlobalKeys.Authen, ''), `dashboard/reputa/statistic-source-interaction`, strBody, false, false, false);
    Utils.nlog("BODY getNguonMXH:", strBody)
    Utils.nlog("RES getNguonMXH:", res)
    return res;
}

//https://ioc-cloud.com/api/dashboard/reputa/statistic-source-post-domain
async function getNguonBaoChi(idTopic, datefrom, dateto, size = 5) {
    let strBody = JSON.stringify({
        "topic": idTopic,
        "dateFrom": datefrom,
        "dateTo": dateto,
        "size": size
    })
    const res = await Utils.post_api_domain(Utils.getGlobal(nGlobalKeys.DomainIOC, ''), Utils.getGlobal(nGlobalKeys.Authen, ''), `dashboard/reputa/statistic-source-post-domain`, strBody, false, false, false);
    Utils.nlog("BODY getNguonBaoChi:", strBody)
    Utils.nlog("RES getNguonBaoChi:", res)
    return res;
}

// https://ioc-cloud.com/api/traffic/searchViolations
async function getListViPham(status, plate, datefrom, dateto, page, size = 5) {
    let strBody = JSON.stringify({
        "statusDesc": status,
        "plate": plate,
        "startTime": datefrom,
        "endTime": dateto,
        "page": page,
        "size": size
    })
    const res = await Utils.post_api_domain(Utils.getGlobal(nGlobalKeys.DomainIOC, ''), Utils.getGlobal(nGlobalKeys.Authen, ''), `traffic/searchViolations`, strBody, false, false, false);
    Utils.nlog("BODY getListViPham:", strBody)
    Utils.nlog("RES getListViPham:", res)
    return res;
}

//https://ioc-cloud.com/api/dashboard/reputa/news
async function getReputaNews(type = 1, idTopic, datefrom, dateto, page = 0) {
    let strBody = JSON.stringify({
        "type": type,
        "topic": idTopic,
        "dateFrom": datefrom,
        "dateTo": dateto,
        "page": page
    })
    const res = await Utils.post_api_domain(Utils.getGlobal(nGlobalKeys.DomainIOC, ''), Utils.getGlobal(nGlobalKeys.Authen, ''), `dashboard/reputa/news`, strBody, false, false, false);
    Utils.nlog("BODY getReputaNews:", strBody)
    Utils.nlog("RES getReputaNews:", res)
    return res;
}
//https://ioc-cloud.com/api/dashboard/reputa/news-search
async function getReputaNewsSearch(idTopic, datefrom, dateto, page = 0, sources = [], sentiments = [], article_types = []) {
    let strBody = JSON.stringify({
        "topic": idTopic,
        "date_from": datefrom,
        "date_to": dateto,
        "sources": sources,
        "sentiments": sentiments,
        "article_types": article_types,
        "author_ids": [],
        "author_names": [],
        "size": 10,
        "page": page
    })
    const res = await Utils.post_api_domain(Utils.getGlobal(nGlobalKeys.DomainIOC, ''), Utils.getGlobal(nGlobalKeys.Authen, ''), `dashboard/reputa/news-search`, strBody, false, false, false);
    Utils.nlog("BODY getReputaNewsSearch:", strBody)
    Utils.nlog("RES getReputaNewsSearch:", res)
    return res;
}
export {
    init, getNoiDungTH, getPhanTramCum, getNguonMXH, getNguonBaoChi, getReputaNews, getReputaNewsSearch, getListViPham
}