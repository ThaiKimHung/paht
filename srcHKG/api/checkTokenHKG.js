import Utils from '../../app/Utils';
import { appConfig } from '../../app/Config';
const url = appConfig.domain + `api/hop-khong-giay/checktoken`;//'https://hkg.tayninh.gov.vn/services/WebService.asmx/checktoken';
function checkDangnhapHKG(token) {
    var paramsString = `token=${token}`;
    Utils.nlog("token000000", token)
    return fetch(url,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                Token: 'rpNuGJebgtBEp0eQL1xKnqQG'
            },
            body: paramsString
        })
        .then((response) => response.json());
    // .then((responseJson) => {
    // console.log(responseJson.thongbao);
    // });
}

module.exports = checkDangnhapHKG;
