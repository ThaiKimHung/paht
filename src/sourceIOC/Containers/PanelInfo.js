import Type from '../Redux/Type';
import { Animated } from 'react-native';
import Animation from '../Styles/Animation';
import { store } from '../../../srcRedux/store';


export const onShowOffPanel = () => {
    store.dispatch({ type: Type.PANEL_INFO.SHOWING_MODE, value: 'off' })
    store.dispatch({ type: Type.PANEL_INFO.DATA, value: {} })
    let { animatedTranslateY } = store.getState()['panelInfo']
    Animated.spring(animatedTranslateY, {
        ...Animation.INFO_OFF,
    }).start();
    store.dispatch({ type: Type.PANEL_INFO.CURRENT_ANIMATED_VALUE, value: Animation.INFO_OFF.toValue })
    store.dispatch({ type: Type.HIEN_TRANG.DATA_POLYGON_PICKER, value: "" })
    store.dispatch({ type: Type.HIEN_TRANG.MAKER_COORDINATE, value: "" })
};

export const onShowMediumPanel = () => {
    store.dispatch({ type: Type.PANEL_INFO.SHOWING_MODE, value: 'medium' });
    let { animatedTranslateY, heightBanner } = store.getState()['panelInfo']
    Animated.spring(animatedTranslateY, {
        ...Animation.INFO_MEDIUM,
        toValue: heightBanner - 46,
    }).start();
    store.dispatch({ type: Type.PANEL_INFO.CURRENT_ANIMATED_VALUE, value: heightBanner - 46 });
};

export const onShowOnPanel = () => {

    let { animatedTranslateY } = store.getState()['panelInfo'];

    store.dispatch({ type: Type.PANEL_INFO.SHOWING_MODE, value: 'on' });

    store.dispatch({ type: Type.QUY_HOACH_PANEL.SET_SHOWING_OFF });

    Animated.spring(animatedTranslateY, {
        ...Animation.INFO_ON,
    }).start();
    store.dispatch({ type: Type.PANEL_INFO.CURRENT_ANIMATED_VALUE, value: Animation.INFO_ON.toValue });
};
