import { nGlobalKeys } from "../../app/keys/globalKey";
import Utils from "../../app/Utils";
import { GetAllYear } from "../../srcAdmin/apis/apiThongKeXLHC";
// const DomainIOC = Utils.getGlobal(nGlobalKeys.DomainIOC, '')

async function departments() {
    const res = await Utils.get_api_domain(Utils.getGlobal(nGlobalKeys.DomainIOC, ''), Utils.getGlobal(nGlobalKeys.Authen, ''), `dashboard/qti-public-service/departments`, false, false, false);
    console.log("domain:", Utils.getGlobal(nGlobalKeys.DomainIOC, ''))
    return res;
}

async function statistics(month = '', code = '') {
    const res = await Utils.get_api_domain(Utils.getGlobal(nGlobalKeys.DomainIOC, ''), Utils.getGlobal(nGlobalKeys.Authen, ''), `dashboard/qti-public-service/statistics?month=${month}&department=${code}`, false, false, false);
    return res;
}

async function home() {
    const res = await Utils.get_api_domain(Utils.getGlobal(nGlobalKeys.DomainIOC, ''), Utils.getGlobal(nGlobalKeys.Authen, ''), `dashboard/vt-medical/home`, false, false, false);
    return res;
}

async function GetListTableau() {
    const res = await Utils.get_api_domain(Utils.getGlobal(nGlobalKeys.DomainIOC, ''), Utils.getGlobal(nGlobalKeys.Authen, ''), `integration/init-dashboard`, false, false, false);
    return res;
}

//integration/trust-token?dashboardId=<id>
async function GetDetailsTableau(Id = '') {
    const res = await Utils.get_api_domain(Utils.getGlobal(nGlobalKeys.DomainIOC, ''), Utils.getGlobal(nGlobalKeys.Authen, ''), `integration/trust-token?dashboardId=${Id}`, false, false, false);
    return res;
}

export {
    departments, statistics, home, GetListTableau, GetDetailsTableau
};