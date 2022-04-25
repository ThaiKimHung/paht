import React, { useState, useEffect, useRef } from 'react'
import PropsType from 'prop-types'
import { View, Text, ActivityIndicator, TouchableOpacity, Image } from 'react-native'
import AutoHeightWebView from 'react-native-autoheight-webview';
import Utils from '../app/Utils';
import { colors } from '../styles';
import { reText } from '../styles/size';
import { Images } from '../src/images';
import { nstyles } from '../styles/styles';
import { isArray } from 'lodash';

const AutoHeightWebViewCus = (props) => {
    const { textLoading = '', colorLoading = '', onLoadEndCus = () => { }, source = {}, ...other } = props;
    var { html = '', uri = '' } = source || {};
    const ref = useRef(null)
    const [Loading, setLoading] = useState(true);
    const [UriCurrent, setUriCurrent] = useState(uri);
    const [UriFirst, setUriFirst] = useState('')

    const onNavigationStateChange = (navState) => {
        Utils.nlog("uri---------", navState.url)
        // setCanGoBack(navState.canGoBack)
        if (navState.url != 'about:blank') {
            Utils.openWeb({ props }, navState.url, { isShowUrl: true })
            setTimeout(() => {
                gobackRef();
            }, 1000);
            if (navState.url == uri) {
                setUriFirst('');
                setUriCurrent(navState.url);
            } else {
                if (UriCurrent == '') {
                    setUriFirst(navState.url);
                }
                setUriCurrent(navState.url);
            }
        } else {
            setUriCurrent(uri);
        }
    };
    //bắt goback theo 2 trường hợp
    const gobackRef = () => {

        if (html) {
            if (UriCurrent == UriFirst) {
                setUriFirst('');
                setUriCurrent('');
            } else {
                ref.current.goBack();
            }
        } else {

            ref.current.goBack();
        }
    }
    let stylesCustom = [{ width: '100%', opacity: 0.99, minHeight: 300 }];
    if (isArray(other.style))
        stylesCustom = [...stylesCustom, ...other.style];
    else
        stylesCustom.push(other.style);
    if (html) { // Cho IMG tăng Width lên giống WEB ngoài.
        html = Utils.replaceAll(html, "figure", "div")
    }
    return (
        <>

            {
                //nếu uri đúng  và uriCurrent k phải là uri thì cho back
                // (html && UriFirst) || (uri && UriCurrent != uri) ? //-Open trang rieng, ko mo chung
                false ?
                    <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity onPress={gobackRef} style={{
                            flexDirection: 'row', paddingRight: 10, paddingBottom: 10,
                            alignItems: 'center',
                            borderWidth: 0, borderBottomWidth: 0.5,
                        }} >
                            <Image source={Images.icBack}
                                resizeMode='center' style={[{ tintColor: colors.black_80, width: 30, height: 20 }]} />
                            <View style={{
                                backgroundColor: colors.blueGrey_20,
                                borderRadius: 30,
                                paddingVertical: 10,
                                paddingHorizontal: 10
                            }}>
                                <Text numberOfLines={1}>
                                    {'Quay lại'}
                                </Text>

                            </View>
                            <TouchableOpacity onPress={() => Utils.openWeb(this, UriCurrent)} style={{
                                backgroundColor: colors.greenyBlue,
                                borderRadius: 30,
                                paddingVertical: 10,
                                paddingHorizontal: 10,
                                marginLeft: 10
                            }}>
                                <Text style={{ color: colors.white }}>Toàn màn hình</Text>
                            </TouchableOpacity>
                        </TouchableOpacity>
                    </View>
                    : null
            }
            <AutoHeightWebView
                // androidHardwareAccelerationDisabled
                source={UriCurrent ? { "uri": UriCurrent } : { "html": html }}
                onLoadEnd={(syntheticEvent) => {
                    const { nativeEvent } = syntheticEvent;
                    Utils.nlog('data load', nativeEvent)
                    setLoading(nativeEvent.loading);
                    if (nativeEvent.url != "about:blank")
                        onLoadEndCus();
                }}
                ref={ref}
                showsVerticalScrollIndicator={false}
                // customScript={`document.body.style.background = 'white';`}
                // Them style span overflow để tránh bị scroll

                customStyle={`
                                                * {
                                                
                                                    resize: both;
                                                    overflow: auto;
                                                    font-size: 15px;
                                                    line-height:20px;
                                                    text-align: justify;
                                                }
                                                body {
                                                    padding-top: 15px;
                                                }
                                                span {
                                                    display: block;
                                                    overflow: hidden;
                                                }
                                            `}
                files={[{
                    type: 'text/css',
                    rel: 'stylesheet'
                }]}
                scalesPageToFit={false}
                viewportContent={'width=device-width,  user-scalable=no'}
                onNavigationStateChange={onNavigationStateChange}
                {...other}
                style={stylesCustom}
                scrollEnabled={(html && UriFirst) || (uri && UriCurrent != uri) ? true : props.scrollEnabled}

            />
            {
                Loading ?
                    <>
                        <ActivityIndicator size={'small'} color={colorLoading} />
                        <Text style={{ textAlign: 'center', color: colors.grayLight, paddingVertical: 10, fontSize: reText(12) }}>{textLoading}</Text>
                    </>
                    : null
            }

        </>
    )
}
AutoHeightWebViewCus.propTypes = {
    source: PropsType.any,
    textLoading: PropsType.string,
    colorLoading: PropsType.string,
    onLoadEndCus: PropsType.func,
    scrollEnabled: PropsType.bool

}
AutoHeightWebViewCus.defaultProps = {
    source: '',
    textLoading: 'Đang tải',
    colorLoading: '',
    onLoadEndCus: () => { },
    scrollEnabled: false
};
export default AutoHeightWebViewCus
