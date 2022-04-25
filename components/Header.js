import React, { Component } from 'react';
import {
    Image, View, Text, TouchableOpacity, StyleSheet, Platform
} from 'react-native';
import PropTypes from 'prop-types';

import { sizes, colors, nstyles } from '../styles';
import Avatar from '../src/screens/Home/components/Avatar';
import { ROOTGlobal } from '../app/data/dataGlobal';
import { appConfig } from '../app/Config';
import Utils from '../app/Utils';
import { nGlobalKeys } from '../app/keys/globalKey';
import LinearGradient from 'react-native-linear-gradient'
import { ImgComp } from './ImagesComponent';
import { heightStatusBar } from '../styles/styles';


class Header extends Component {
    constructor(props) {
        super(props);
        this.nthisHeader = nthisApp;
    };
    _returnIconRight = () => {
        const { onPressMap, onPressSearch, onPressNoti, numberIconright, isLeft = false, } = this.props;
        const { nrow } = nstyles.nstyles;
        switch (numberIconright) {
            case 1:
                return <View style={[nrow, { justifyContent: 'flex-end' }]}>
                    <TouchableOpacity onPress={onPressNoti}>
                        <Image source={ImgComp.icThongbao} style={[nstyles.nstyles.nIcon24, { tintColor: colors.white }]} resizeMode='contain' />
                        {/* <View style={styles.numberNoti}>
                            <Text style={{ color: colors.white, fontWeight: 'bold', fontSize: sizes.reText(8), textAlign: 'center' }}>{'5'}</Text>
                        </View> */}
                    </TouchableOpacity>

                </View>

            case 2:
                return <View style={[nrow, { justifyContent: 'flex-end' }]}>
                    <TouchableOpacity onPress={onPressMap}>
                        <Image source={ImgComp.icMap} style={{ marginRight: 20, tintColor: colors.white }} resizeMode='contain' />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onPressSearch}>
                        <Image source={ImgComp.icSearch} style={{ tintColor: colors.white }} resizeMode='contain' />
                    </TouchableOpacity>
                </View>
        };
    }

    render() {
        const { shadown, nthis, isLeft = false } = this.props;
        const { nrow } = nstyles.nstyles;
        return (
            <View style={[shadown ? nstyles.nstyles.shadown : {}, { backgroundColor: colors.colorTextSelect, }]}>
                <LinearGradient
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    colors={this.props.theme.colorLinear.color}
                >
                    <View style={[nrow, { paddingTop: Platform.OS == 'android' ? nstyles.paddingTopMul() + heightStatusBar() : nstyles.paddingTopMul(), alignItems: 'center', paddingHorizontal: nstyles.khoangcach, marginBottom: 8 }]}>
                        <View style={[nrow, { flex: 1, alignItems: 'center' }]}>
                            {
                                isLeft == true ?
                                    <TouchableOpacity onPress={() => {
                                        if (ROOTGlobal.dataGlobal._onPressAvatar) {
                                            ROOTGlobal.dataGlobal._onPressAvatar()
                                        }
                                        Utils.goscreen(this.props.nthis, 'ManHinh_Home')
                                        // this.props.nthis.props.navigation.openDrawer()
                                    }} style={{ padding: 7 }}>
                                        {/* <Image source={ImgComp.icMenuDrawer} style={[nstyles.nstyles.nIcon20, { tintColor: colors.white }]} resizeMode='contain' /> */}
                                        <Image source={ImgComp.icBack} style={[nstyles.nstyles.nIcon20, { tintColor: colors.white }]} resizeMode='contain' />
                                    </TouchableOpacity> : <Avatar nthis={nthis} />
                            }
                            <Text style={{ fontSize: sizes.reText(16), fontWeight: 'bold', color: colors.white, textAlign: 'center', flex: 1 }}>{Utils.getGlobal(nGlobalKeys.TieuDe)}</Text>
                        </View>

                        { // iconRight
                            this._returnIconRight()
                        }
                    </View>
                </LinearGradient>
            </View >
        );
    }
}

const mapStateToProps = state => ({
    theme: state.theme

});
export default Utils.connectRedux(Header, mapStateToProps, true);

Header.propTypes = {
    onPressMap: PropTypes.func,
    onPressSearch: PropTypes.func,
    onPressNoti: PropTypes.func,
    numberIconright: PropTypes.number,
    shadown: PropTypes.bool,
    nthis: PropTypes.any,

}
Header.defaultProps = {
    onPressMap: () => { },
    onPressSearch: () => { },
    onPressNoti: () => { },
    numberIconright: 1,
    shadown: true,
    nthis: this.nthisHeader
};

const styles = StyleSheet.create({
    numberNoti: {
        position: "absolute", width: 15, height: 15, borderRadius: 10, backgroundColor: 'red',
        top: 0, right: 0, alignItems: 'center', justifyContent: 'center', marginTop: -5
    }
})



