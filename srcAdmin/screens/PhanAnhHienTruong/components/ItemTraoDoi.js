import React, { Component, Fragment } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import PropTypes from 'prop-types';
import { nstyles, colors, sizes } from '../../../../styles';
import styles from '../styles';
export default class ItemTraoDoi extends Component {
    constructor(props) {
        super(props);
        // this.nthisItemDanhSach = nthisApp;
        this.state = {
            height: 40
        };
    }
    // _onWebViewMessage = (event: WebViewMessageEvent) => {
    //     this.setState({ height: Number(event.nativeEvent.data) });
    // }

    // const { height } = this.state;

    _chiTietPhanAnh = () => {
        this.props.goscreen();
    }

    render() {
        const { nrow } = nstyles.nstyles;
        const { item, nthis } = this.props;
        const { height } = this.state;
        return (
            <Fragment>
                <View style={{ backgroundColor: colors.white, paddingHorizontal: nstyles.khoangcach, paddingVertical: 5 }} >
                    <View style={[nrow, { justifyContent: 'space-between', marginTop: 14, }]}>
                        <View style={{ justifyContent: 'center' }}>
                            <Text style={[styles.txt12, { fontWeight: 'bold' }]}>{item.FullName}</Text>
                            <Text style={[styles.txt12, { fontWeight: 'bold' }]}>{item.TenPhuongXa}</Text>
                        </View>
                        <Text style={[styles.txt12, { fontStyle: 'italic' }]}>{item.CreatedDate}</Text>
                    </View>
                    {/* <Text style={styles.txt12} numberOfLines={2}>aslfnsa;fns;kfns;mdfn sd.mfs.mf</Text> */}

                    {/* <ScrollView style={{ height, flex: 1, backgroundColor: 'red' }}> */}
                    {/* <WebView
                            style={{ height, marginLeft: -6 }}
                            originWhitelist={['*']}
                            useWebKit={false}
                            scalesPageToFit={false}
                            source={{ html: item.NoiDung }}
                            scrollEnabled={false}
                            showsHorizontalScrollIndicator={false}
                            showsVerticalScrollIndicator={false}
                            onMessage={this._onWebViewMessage}
                            injectedJavaScript='window.ReactNativeWebView.postMessage(document.body.scrollHeight)'
                        /> */}
                    <Text >
                        {item.NoiDung}
                    </Text>
                    {/* </ScrollView> */}
                </View>
                <View style={{ height: 1, backgroundColor: colors.veryLightPink, marginLeft: 15, }} />
            </Fragment>

        );
    }
}

ItemTraoDoi.defaultProps = {
    item: {
        IdRow: 1,
        FullName: 'Nguyen Van Teo',
        TenPhuongXa: 'quan 12',
        NoiDung: 'Nội dung -Lorem ipsum dolor sit amet, consectetuer adipis cing elit, sed diam nonummy nibh euismod tincidunt ut laor… ',
        CreatedDate: '12/02/2020 10:01',
    },
    goscreen: () => { },
    // nthis: this.nthisItemDanhSach
};

ItemTraoDoi.propTypes = {
    item: PropTypes.object,
    goscreen: PropTypes.func,
    nthis: PropTypes.any
};