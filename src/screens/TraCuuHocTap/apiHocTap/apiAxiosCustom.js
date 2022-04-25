import axios, { AxiosInstance } from 'axios';
import Utils from '../../../../app/Utils';
import { appConfig } from '../../../../app/Config';
import { ConfigOnline } from '../../../../app/ConfigOnline';

const apiCus = axios.create({
    baseURL: appConfig.domain,
    timeout: 180000,
});

apiCus.interceptors.request.use(async config => {
    // const token = await Utils.ngetStore('Token_H', '');
    // Utils.nlog('gia tri token luu store', token)
    // if (token) {
    //     config.headers.Authorization = 'Bearer ' + token;
    // }
    return config;
});

const serialize = (obj) => {
    var str = [];
    for (var p in obj) {
        if (obj.hasOwnProperty(p)) {
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        }
    }
    return str.join("&");
}


// apiCus.interceptors.response.use(
//     response => response,
//     async error => {
//         const originalRequest = error.config;
//         Utils.nlog('gia tri config', error.response.status)
//         if (
//             error.response.status === 401 ||
//             error.response.data.messge === 'invalid token'
//         ) {
//             let dataBody = {
//                 'client_id': ConfigOnline.GD_CliendID,
//                 'client_secret': ConfigOnline.GD_ClientSecret,
//                 'grant_type': 'password',
//                 'username': ConfigOnline.GD_username,
//                 'password': ConfigOnline.GD_password,
//             }
//             Utils.nlog('gia tri data body', dataBody)
//             apiCus.post(ConfigOnline.GD_DomainAuth + '/connect/token', serialize(dataBody))
//                 .then(res => {
//                     const { access_token } = res.data
//                     Utils.nlog('gia tri token khi get then', access_token)
//                     Utils.nsetStore('Token_H', access_token)
//                     apiCus.defaults.headers.Authorization = 'Bearer ' + access_token;
//                     originalRequest.headers.Authorization = 'Bearer ' + access_token;
//                     return apiCus(originalRequest);
//                 })
//                 .catch(err => Utils.nlog('lỗi get api token', err))
//         }
//         return Promise.reject(error);
//     },
// );

export default apiCus;

