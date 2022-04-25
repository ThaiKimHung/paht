const { nGlobalKeys } = require("../../../../app/keys/globalKey");
const { default: Utils } = require("../../../../app/Utils");

///dashboard/gli-env/station?stationType=4
async function DanhSachTramQuanTrac(typeQuanTrac) {
    try {
        const DOMAIN_IOC = Utils.getGlobal(nGlobalKeys.IOC_DOMAIN_PLEIKU, '') //pleiku
        const TOKEN_IOC = Utils.getGlobal(nGlobalKeys.IOC_TOKEN_PlEIKU, '') //pleiku
        var myHeaders = new Headers();
        myHeaders.append("Authorization", TOKEN_IOC, TOKEN_IOC);
        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };
        let response = await fetch(`${DOMAIN_IOC}dashboard/gli-env/station?stationType=${typeQuanTrac}`, requestOptions)
        response = await response.json();
        
        return response;
    } catch (error) {
        Utils.nlog("[LOG] ERRROR IOC", error);
        return -1;
    }
}

///dashboard/gli-env/aqi?stationId=29193837159241197135471379451
async function GetAQI_TramQuanTrac(IdTram) {
    try {
        const DOMAIN_IOC = Utils.getGlobal(nGlobalKeys.IOC_DOMAIN_PLEIKU, '') //pleiku
        const TOKEN_IOC = Utils.getGlobal(nGlobalKeys.IOC_TOKEN_PlEIKU, '') //pleiku
        var myHeaders = new Headers();
        myHeaders.append("Authorization", TOKEN_IOC);
        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };
        let response = await fetch(`${DOMAIN_IOC}dashboard/gli-env/aqi?stationId=${IdTram}`, requestOptions)
        response = await response.json();
        
        return response;
    } catch (error) {
        Utils.nlog("[LOG] ERRROR IOC", error);
        return -1;
    }
}

//dashboard/gli-env/data-hour
async function ChiTietChiSoTramKhongKhi(body) {
    try {
        const DOMAIN_IOC = Utils.getGlobal(nGlobalKeys.IOC_DOMAIN_PLEIKU, '') //pleiku
        const TOKEN_IOC = Utils.getGlobal(nGlobalKeys.IOC_TOKEN_PlEIKU, '') //pleiku
        var myHeaders = new Headers();
        myHeaders.append("Authorization", TOKEN_IOC);
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify(body);

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        let response = await fetch(`${DOMAIN_IOC}dashboard/gli-env/data-hour`, requestOptions)
        response = await response.json();
        
        return response;
    } catch (error) {
        Utils.nlog("[LOG] ERRROR IOC", error);
        return -1;
    }
}

//dashboard/gli-env/qi-data
async function ChiTietChiSoTramNuoc(body) {
    try {
        const DOMAIN_IOC = Utils.getGlobal(nGlobalKeys.IOC_DOMAIN_PLEIKU, '') //pleiku
        const TOKEN_IOC = Utils.getGlobal(nGlobalKeys.IOC_TOKEN_PlEIKU, '') //pleiku
        var myHeaders = new Headers();
        myHeaders.append("Authorization", TOKEN_IOC);
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify(body);

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        let response = await fetch(`${DOMAIN_IOC}dashboard/gli-env/qi-data`, requestOptions)
        response = await response.json();
        
        return response;
    } catch (error) {
        Utils.nlog("[LOG] ERRROR IOC", error);
        return -1;
    }
}

export default {
    DanhSachTramQuanTrac, GetAQI_TramQuanTrac, ChiTietChiSoTramKhongKhi, ChiTietChiSoTramNuoc
}