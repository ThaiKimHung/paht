import Utils from "../../../../app/Utils";
import { ConfigOnline } from "../../../../app/ConfigOnline";

const serialize = (obj) => {
    var str = [];
    for (var p in obj) {
        if (obj.hasOwnProperty(p)) {
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        }
    }
    return str.join("&");
}

export async function api_TraCuuHocTap(body = {}) {
    try {
        const response = await fetch(ConfigOnline.GD_DomainApi, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Accept-Encoding': 'gzip',
                'Content-Type': 'application/json',
                'Username': ConfigOnline.GD_username,
                'Password': ConfigOnline.GD_password,
                'ReqMessageId': '123',

            },
            body: JSON.stringify(body)
        })
        const res = await response.json();
        return {
            status: res ? 1 : 0,
            data: res ? res : null
        }
    } catch (error) {
        Utils.nlog('gia tri err', error)
        return {
            status: 0,
            data: null
        }
    }
}

// export async function Call_Api(url = '', body = {}) {
//     try {
//         Utils.nlog('gia tri config api hoc tap', ConfigOnline.GD_username + '---' + ConfigOnline.GD_password)
//         let token = await Utils.ngetStore('Token_H', '');
//         Utils.nlog('gia tri token', token)
//         let bodyTempt = JSON.stringify(body);
//         Utils.nlog('gia tri body tempt', bodyTempt)
//         const response = await fetch(ConfigOnline.GD_DomainApi + url, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': 'Bearer '
//                     + token,
//             },
//             body: bodyTempt
//         })
//         if (response?.status === 401) {
//             // Utils.nlog('vao get token')
//             let dataBody = {
//                 'client_id': ConfigOnline.GD_CliendID,
//                 'client_secret': ConfigOnline.GD_ClientSecret,
//                 'grant_type': 'password',
//                 'username': ConfigOnline.GD_username,
//                 'password': ConfigOnline.GD_password,
//             }
//             let responseToken = await fetch('https://id.smartup.edu.vn/connect/token', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
//                 },
//                 body: serialize(dataBody)
//             })
//             // if (responseToken.status === 200) {
//             const resToken = await responseToken.json();
//             Utils.nlog('gia tri token get', resToken.access_token)
//             Utils.nsetStore('Token_H', resToken.access_token)
//             let responses = await fetch(ConfigOnline.GD_DomainApi + url, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Authorization': 'Bearer ' + resToken.access_token
//                 },
//                 body: bodyTempt
//             })
//             const res = await responses.json()
//             Utils.nlog('tra api o get token')
//             return {
//                 status: 1,
//                 data: res
//             }
//         }
//         // }
//         const res = await response.json()
//         Utils.nlog('tra api o ngoai')
//         return {
//             status: 1,
//             data: res
//         }
//     } catch (error) {
//         Utils.nlog('gia tri err', error)
//     }
// }

