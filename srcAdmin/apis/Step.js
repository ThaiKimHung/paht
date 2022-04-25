import Utils from "../../app/Utils";
import AppCodeConfig from "../../app/AppCodeConfig";

const PREFIX = 'api/step/Lite'

async function ListThaoTac(token = '') {
    const res = await Utils.get_api(PREFIX, false, false, true, AppCodeConfig.APP_ADMIN)
    return res;
};

export {
    ListThaoTac
}