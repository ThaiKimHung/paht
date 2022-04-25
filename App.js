
import React, { Component, Fragment } from 'react';
import { Dimensions, Platform, StatusBar, Text, TextInput } from 'react-native';
import { AppStack } from './src/routers/screen'
import { createAppContainer } from 'react-navigation';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { appConfig } from './app/Config';
import withCodePush from './codepush';
import Utils from './app/Utils';
import SplashScreen from 'react-native-splash-screen'
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux'
import { store, persistor } from './srcRedux/store';
import PushNoti from './srcAdmin/screens/main/ThongBao/PushNoti';
import FlashMessage from 'react-native-flash-message';

import { nkey } from './app/keys/keyStore';
import AppCodeConfig from './app/AppCodeConfig';
import { resetStore } from './srcRedux/actions';
import RNRestart from 'react-native-restart';
import AsyncStorage from '@react-native-community/async-storage';
import ModalThongBaoHome from './srcAdmin/screens/ModalThongBaoHome';
import { SetLandsCape } from './srcRedux/actions/theme/Theme';
import { heightStatusBar, isLandscape, StyleGlobal, versionIOS } from './styles/styles';
import { IsLoading } from './components';

import analytics from '@react-native-firebase/analytics';
import { firebase } from '@react-native-firebase/auth';
import FontSize from './styles/FontSize';
import { setJSExceptionHandler, setNativeExceptionHandler, getJSExceptionHandler } from "react-native-exception-handler";
import apis from './src/apis';
import DeviceInfo from 'react-native-device-info';
import { ROOTGlobal } from './app/data/dataGlobal';

export function apiLogEx(typeEX = 'JSException', name = '---', message = '---', isFatal = false) {
	if (!__DEV__) {
		try {
			// your error handler function
			let brand = DeviceInfo.getBrand();
			let systemName = DeviceInfo.getSystemName();
			let systemVersion = DeviceInfo.getSystemVersion();

			let err = `[${typeEX}]:${systemName} - ${brand} -(OS:${systemVersion}) -[appVer]:${appConfig.version} -[${ROOTGlobal.isScreenNameNow}]-->>`
			err += `[>>>>]: ${isFatal ? isFatal : '---'} ${name} ${message} [Time]:`

			apis.ApiApp.writeLogError(err);
			Utils.nlog(message);
		} catch (error) {
			Utils.nlog(typeEX, error); // So that we can see it in the ADB logs in case of Android if needed
		}
	}
}


//--LOG BUG khi RELEASE APP về cho DEV
const errorHandler = (e, isFatal) => {
	apiLogEx('JSException', e.name, e.message, isFatal);
};

setJSExceptionHandler(errorHandler);

setNativeExceptionHandler((errorString) => {
	apiLogEx('NativeException', '---', errorString);
});
const currentHandler = getJSExceptionHandler();
//--------------

//tracking
function getActiveRouteName(navigationState) {
	if (!navigationState) {
		return null;
	}
	const route = navigationState.routes[navigationState.index];
	// dive into nested navigators
	if (route.routes) {
		return getActiveRouteName(route);
	}
	return route.routeName;
}
//end
const prefix = appConfig.deeplinkApp + '://';
const AppContainer = createAppContainer(AppStack);
class App extends Component {
	constructor(props) {
		super(props);
		Text.defaultProps = Text.defaultProps || {};
		Text.defaultProps.allowFontScaling = false;
		TextInput.defaultProps = TextInput.defaultProps || {};
		TextInput.defaultProps.allowFontScaling = false;
		Text.defaultProps = Text.defaultProps || {};
		Text.defaultProps.allowFontScaling = false;
		KeyboardAwareScrollView.defaultProps = KeyboardAwareScrollView.defaultProps || {};
		KeyboardAwareScrollView.defaultProps.keyboardShouldPersistTaps = 'handled'
		TextInput.defaultProps = TextInput.defaultProps || {};
		TextInput.defaultProps.autoCapitalize = "none";
		TextInput.defaultProps.autoCorrect = false;
		TextInput.defaultProps.spellCheck = false;
		nthisApp = this;
		nthisPopUp = {}
		this.isLanscapeChange = false;
	}
	async componentDidMount() {
		firebase.app();
		// ...
		const appInstanceId = await analytics().getAppInstanceId();
		await analytics().logAppOpen()
		//xử lý xoá redux nếu version cũ
		// CodeRedux: 1,
		const verCodeRedux = await Utils.ngetStore(nkey.CodeRedux, 0, AppCodeConfig.APP_CONGDAN);
		if (Number(verCodeRedux) < appConfig.CodeRedux) {
			await AsyncStorage.clear();
			store.dispatch(resetStore())
			await Utils.nsetStore(nkey.CodeRedux, appConfig.CodeRedux);
			RNRestart.Restart();
		}
		//end
		SplashScreen.hide();
		if (Platform.OS == 'android') {
			StatusBar.setTranslucent(true)
			StatusBar.setBarStyle('light-content')
			StatusBar.setBackgroundColor('transparent')
		}
		Dimensions.addEventListener('change', ({ window: { width, height } }) => {
			StyleGlobal.isLansacpeFirst = true;
			if (versionIOS) {
				let temp = width;
				width = height;
				height = temp;
			}
			if (width < height) {
				if (this.isLanscapeChange) {
					FontSize.ChangeFontSize(width, height);
					store.dispatch(SetLandsCape(false));
					this.isLanscapeChange = false;
				}
			} else {
				if (!this.isLanscapeChange) {
					FontSize.ChangeFontSize(height, width);
					store.dispatch(SetLandsCape(true));
					this.isLanscapeChange = true;
				}
			}
		})
	}

	render() {
		return (
			<Provider store={store}>
				<PersistGate persistor={persistor} loading={null}>
					<AppContainer uriPrefix={prefix}

						onNavigationStateChange={async (prevState, currentState, action) => {
							const currentRouteName = getActiveRouteName(currentState);
							const previousRouteName = getActiveRouteName(prevState);

							if (previousRouteName !== currentRouteName) {
								Utils.nlog("[vao]", currentRouteName)
								ROOTGlobal.isScreenNameNow = currentRouteName;
								await analytics().logScreenView(
									{
										screen_class: currentRouteName,
										screen_name: currentRouteName,
									}
								)
							}
						}}
						ref={navigatorRef => {
							Utils.setTopLevelNavigator(navigatorRef);
						}}
					>
					</AppContainer>
					<ModalThongBaoHome />
					<FlashMessage position="top" style={{ paddingTop: Platform.OS == 'android' ? heightStatusBar() : heightStatusBar() / 2 }} />
					<PushNoti keygloblaVal={"popUpTinTuc"} />
					{/* popUpAll phải nằm Trên cùng, Ko dc đổi */}
					<PushNoti keygloblaVal={"popUpAll"} />
					{/* <NotificationPopup ref={ref => this.popup = ref} /> */}
					<IsLoading ref={Utils.refLoading} />
				</PersistGate>
			</Provider >
		)
	}
}


export default withCodePush(App);