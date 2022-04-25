import React, { Component, Fragment } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { nstyles, colors, sizes } from '../../../../styles';
import styles from '../styles';
import { WebViewCus } from '../../../../components';
export default class ItemGhiChu extends Component {
    constructor(props) {
        super(props);
        // this.nthisItemDanhSach = nthisApp;
        this.state = {
            height: 40
        };
    }
    _onWebViewMessage = (event: WebViewMessageEvent) => {
        this.setState({ height: Number(event.nativeEvent.data) });
    }

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
                <View style={{ backgroundColor: colors.white, paddingHorizontal: nstyles.khoangcach }} >
                    <View style={[nrow, { justifyContent: 'space-between', marginTop: 14 }]}>
                        <View style={{ justifyContent: 'center' }}>
                            <Text style={[styles.txt12, { fontWeight: 'bold' }]}>{item.FullName}</Text>
                            <Text style={[styles.txt12, { fontWeight: 'bold' }]}>{item.TenPhuongXa}</Text>
                        </View>
                        <Text style={[styles.txt12, { fontStyle: 'italic' }]}>{item.CreatedDate}</Text>
                    </View>
                    {/* <Text style={styles.txt12} numberOfLines={2}>aslfnsa;fns;kfns;mdfn sd.mfs.mf</Text> */}
                    <View style={{ height }}>
                        <WebViewCus
                            style={{ marginLeft: -3 }}
                            scrollEnabled={false}
                            source={{ html: item.NoiDung }}
                            fontSize={sizes.sizes.sText28}
                            showsHorizontalScrollIndicator={false}
                            showsVerticalScrollIndicator={false}
                            scrollEnabled={false}
                        />
                    </View>
                </View>
                <View style={{ height: 0.5, backgroundColor: 'gray' }} />
            </Fragment>

        );
    }
}

ItemGhiChu.defaultProps = {
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

ItemGhiChu.propTypes = {
    item: PropTypes.object,
    goscreen: PropTypes.func,
    nthis: PropTypes.any
};