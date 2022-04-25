import signalr from 'react-native-signalr';
import { appConfig } from '../../app/Config';
import Utils from '../../app/Utils';
var connection = '';// signalr.hubConnection(`${appConfig.domain}/signalr`)
var proxy = () => { };// connection.createHubProxy('simpleHub');

function CreateNewConect() {

    let URL = `${appConfig.domain}signalr`;
    Utils.nlog("[domain]", URL);
    connection = signalr.hubConnection(URL);


    proxy = connection.createHubProxy('simpleHub');
}
const reTurnConnect = () => {
    return connection;
}
const reTurnProxy = () => {
    return proxy;
}

const dataSocket = {
    connection: reTurnConnect,
    proxy: reTurnProxy,
    CreateNewConect
}
export default dataSocket