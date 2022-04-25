import LinkAPI, { onPostRequest } from './Config';
import { getShapeColor } from '../Styles/Colors';
import setup from './setup';
import Type from '../Redux/Type';
import { onShowOnPanel } from './PanelInfo';
import { Alert } from 'react-native';
import { getQuyHoachByDocument } from './QuyHoach';
import { store } from '../../../srcRedux/store';

export function getListHuyen(onSuccess) {
    let onProcess = ({ statusCode, response }) => {
        if (statusCode === 200) {
            response = response.map((e) => ({
                id: e.MaHuyen,
                active: e.MaHuyen === setup.huyenId,
                name: e.Ten,
                searchID: e.MaDVHC,
            }));
            statusCode = 200;
        }
        onSuccess(statusCode, response);
    };
    onPostRequest(LinkAPI.getTreeDVHC(setup.tinhId, 1), onProcess);
}

export function getListXa(huyenId, onSuccess) {
    let onProcess = ({ statusCode, response }) => {
        if (statusCode === 200) {
            response = response.map((e) => ({
                id: e.MaXa,
                active: true,
                name: e.Ten,
                searchID: e.MaDVHC.toString(),
            }));
            let allItem = [setup.allDistrict];
            response = allItem.concat(response);
        }
        onSuccess(statusCode, response);
    };
    onPostRequest(LinkAPI.getTreeDVHC(huyenId, 2), onProcess);
}

export function getSearchList(route, payload, onSuccess) {
    let onProcess = ({ statusCode, response }) => {
        if (statusCode === 200) {
            response = response.map((e) => ({
                ...e,
                SOTHUA: e.SOTHUA.trim(),
                MucDichSDD: getListMDSD(e.MucDichSDD),
                MADVHC: e.MaDVHC ? e.MaDVHC.toString() : '',
                ...getShapeColor(e.GhiChu_dkqsdd),
            }));
            onSuccess(200, response);
        } else {
            onSuccess(statusCode, []);
        }
    },
        linkCallAPI =
            route === 'byName' ? LinkAPI.searchByName : LinkAPI.searchByToThua;

    if (route === 'byToThua' && payload.MaDvhc)
        getQuyHoachByDocument(payload)

    onPostRequest(linkCallAPI, onProcess, payload);
}

function getListMDSD(strMDSD) {
    let result = [];
    if (strMDSD) {
        if (strMDSD[strMDSD.length - 1] === '|') {
            strMDSD = strMDSD.slice(0, -1);
        }
        strMDSD = strMDSD.split('|');
        if (strMDSD.length) {
            strMDSD = strMDSD.filter((e) => !!e);
            strMDSD = strMDSD.map((e) => e.trim());
            strMDSD = strMDSD.filter((e) => !!e);
            result = strMDSD;
        }
    }
    return result;
}

export const onLoadInfoByThuaDat = (payload) => {
    let onSuccess = (statusCode, response) => {
        if (statusCode === 200 || statusCode === 201) {
            if (response.length) {
                response = response[0];
                store.dispatch({ type: Type.PANEL_INFO.DATA, value: response })
                onShowOnPanel();
            } else {
                Alert.alert(
                    'Thông báo',
                    'Không tìm thấy dữ liệu bản đồ',
                    [
                        {
                            text: 'Đồng ý', onPress: () => {
                            }, style: 'cancel',
                        },
                    ],
                    { cancelable: false },
                );
            }
        }
    };
    getSearchList('byToThua', payload, onSuccess);
};
