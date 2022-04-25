/**
 * @format
 */

import { AppRegistry, YellowBox, Platform } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { startNetworkLogging } from 'react-native-network-logger';

startNetworkLogging({ maxRequests: 40 });
YellowBox.ignoreWarnings(["", ""]);

if (Platform.OS == 'android')
    AppRegistry.registerHeadlessTask('RNCallKeepBackgroundMessage', () => ({ name, callUUID, handle }) => {
        // Make your call here

        return Promise.resolve();
    });
AppRegistry.registerComponent(appName, () => App);
