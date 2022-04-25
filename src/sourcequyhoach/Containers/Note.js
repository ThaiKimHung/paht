import LinkAPI, { isObject, onPostRequest, onUploadRequest } from './Config';
import moment from 'moment';
import store from '../../srcRedux/store';

export function checkPermissionAddNote(account, onSuccess) {

    let onProcess = (statusCode, response) => {
        if (statusCode === 200 && isObject(response)) {
            statusCode = 'failed';
            if (response.Code === '000') {
                statusCode = 200;
                response = response.Data === "1";
            }
        }
        else
            statusCode = 'failed';
        onSuccess(statusCode, response)
    },
        payload = {
            account,
        };
    onPostRequest(LinkAPI.checkPermissionAddNote, onProcess, payload)
}

export function uploadImage(payload, onSuccess) {

    let onProcess = (statusCode, response) => {
        if (statusCode === 200 && response.Code === "000") {
            response = {
                ...payload,
                urlImage: response.Data
            };
        }
        else
            statusCode = 'failed';
        onSuccess(statusCode, response);
    },
        thuadat = {
            soto: payload.soto,
            sothua: payload.sothua,
            madvhc: payload.kvhcid
        };
    onUploadRequest(LinkAPI.uploadHinhAnh(thuadat), onProcess, payload.urlImage)
}

export function createNote(payload, onSuccess) {
    let onProcess = (statusCode, response) => {
        if (!(statusCode === 200 && response.Code === "000"))
            statusCode = 'failed';
        onSuccess(statusCode);
    };
    onPostRequest(LinkAPI.createGhiChu, onProcess, payload);
}

export function loadListNoteByThuaDat(payload, onSuccess) {
    let { tendangnhap } = store.getState()['userInfo'];
    let onProcess = (statusCode, response) => {
        if (statusCode === 200 && isObject(response)) {
            statusCode = 'failed';
            if (response.Code === '000' && Array.isArray(response.Data)) {
                statusCode = 200;
                response = response.Data;
                response = response.map(e => ({
                    ...e,
                    thoigian: moment(e.thoigian, 'YYYY-MM-DD hh:mm:ss').format('DD/MM/YYYY HH:mm'),
                    noidung: e.type === 1 ? processNoiDung(e.NoiDung) : e.NoiDung,
                    isTrueCreator: tendangnhap === e.WriterName
                }));
            }
        }
        else
            statusCode = 'failed';
        onSuccess(statusCode, response)
    };
    onPostRequest(LinkAPI.loadListNoteByThuaDat, onProcess, payload)
}

export function loadListNoteByAccount(onSuccess) {

    let onProcess = (statusCode, response) => {
        if (statusCode === 200 && isObject(response)) {
            statusCode = 'failed';
            if (response.Code === '000' && Array.isArray(response.Data)) {
                statusCode = 200;
                response = response.Data;
                response = response.map(e => ({
                    ...e,
                    thoigian: moment(e.thoigian, 'YYYY-MM-DD hh:mm:ss').format('DD/MM/YYYY HH:mm'),
                    noidung: e.type === 1 ? processNoiDung(e.NoiDung) : e.NoiDung,
                    isTrueCreator: true,
                    SoThua: e.SoThua.trim(),
                    SoTo: e.SoTo.trim()
                }));
            }
        }
        else
            statusCode = 'failed';
        onSuccess(statusCode, response)
    };
    onPostRequest(LinkAPI.loadListNoteByAccount, onProcess, {})
}

function processNoiDung(noidung) {
    if (noidung) {
        let pathImage = LinkAPI.root + "Images/";
        noidung = noidung.split("|");
        noidung = noidung.map(e => pathImage + e);
        return noidung;
    }
    else
        return []

}

export function removeNote(idNote, onSuccess) {
    let onProcess = (statusCode, response) => {
        if (statusCode === 200 && isObject(response)) {
            statusCode = 'failed';
            if (response.Code === '000')
                statusCode = 200;
        }
        else
            statusCode = 'failed';
        onSuccess(statusCode)
    },
        payload = {
            id: idNote
        };
    onPostRequest(LinkAPI.xoaGhiChu, onProcess, payload);
}
