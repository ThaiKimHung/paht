import React, { Component, createRef } from 'react';
import { View, Text, Animated, StyleSheet, Image, TouchableOpacity, ScrollView, FlatList, BackHandler } from 'react-native';
import Utils from '../../../app/Utils';
import { colors } from '../../../styles';
import { reText, sizes } from '../../../styles/size';
import { Height, nstyles, paddingBotX, Width } from '../../../styles/styles';
import { Images } from '../../images';
import { ButtonCom, IsLoading } from '../../../components';
import apis from '../../apis';
import { KeyComp, KeyTiem, KeyUIDetailsHistory, stChiTietLichSuTiem } from './KeyTiem';
import { ComponentUI } from './CompGeneral';

class ChiTietLichSuTiem extends Component {
    constructor(props) {
        super(props);
        this.item = Utils.ngetParam(this, 'item', '')
        this.dataHistory = Utils.ngetParam(this, 'dataHistory', '')
        this.state = {
            opacity: new Animated.Value(0),
            item: this.item ? this.item : '',
            template: this.item ? KeyUIDetailsHistory[this.item.KeyTiem] : [],
            dataHistory: this.dataHistory ? this.dataHistory : '',
        };
    }

    componentDidMount() {
        this._startAnimation(0.4)
        BackHandler.addEventListener('hardwareBackPress', this.backAction)
    }

    backAction = () => {
        this._goback()
        return true
    }

    componentWillUnmount() {
        try {
            BackHandler.removeEventListener('hardwareBackPress', this.backAction)
        } catch (error) {

        }
    }

    _startAnimation = (value) => {
        setTimeout(() => {
            Animated.timing(this.state.opacity, {
                toValue: value,
                duration: 350
            }).start();
        }, 300);
    };

    _goback = () => {
        setTimeout(() => {
            Animated.timing(this.state.opacity, {
                toValue: 0,
                duration: 250
            }).start(() => {
                Utils.goback(this)
            });
        }, 100);
    }

    renderUI = (key) => {
        const { template } = this.state
        const display = template.findIndex(e => e.id == key.id)
        // let TinhHinhSucKhoe = [1, 2, 4]

        let StrTinhHinhSucKhoe = ''
        this.dataHistory.ListTrieuChung.map(item => {
            this.props.TinhHinhSucKhoe.map(val => {
                val.Id == item ? StrTinhHinhSucKhoe += '- ' + val.Title + '\n' : ''
            })
        })
        StrTinhHinhSucKhoe += this.dataHistory.Note && this.dataHistory.Note != null ? this.dataHistory.Note : this.dataHistory.ListTrieuChung.length == 0 ? '- (Không có ghi chú)' : ''
        if (display != -1) {
            switch (key) {
                case KeyComp.HOTEN:
                    return <ComponentUI item={KeyComp.HOTEN} value={this.dataHistory?.HoTen} />
                case KeyComp.SDT:
                    return <ComponentUI item={KeyComp.SDT} value={this.dataHistory?.SDT} />
                case KeyComp.CMND:
                    return <ComponentUI item={KeyComp.CMND} value={this.dataHistory?.CMND} />
                case KeyComp.NOITIEM:
                    return <ComponentUI item={KeyComp.NOITIEM} value={this.dataHistory?.TenDiemTiem} />
                case KeyComp.TENVACCIN:
                    return <ComponentUI item={KeyComp.TENVACCIN} value={this.dataHistory?.TenVaccine} />
                case KeyComp.LOVACCIN:
                    return <ComponentUI item={KeyComp.LOVACCIN} value={this.dataHistory?.Lot} />
                case KeyComp.GHICHU:
                    return <ComponentUI item={KeyComp.GHICHU} value={this.dataHistory?.Note} />
                case KeyComp.PHANUNGSAUTIEM:
                    return <ComponentUI item={KeyComp.PHANUNGSAUTIEM} value={StrTinhHinhSucKhoe} />
                default:
                    break;
            }
        }
    }



    render() {
        const { opacity, item } = this.state
        const { colorLinear } = this.props.theme
        return (
            <View style={stChiTietLichSuTiem.cover}>
                <Animated.View onTouchEnd={() => this._goback()} style={[stChiTietLichSuTiem.animated, { opacity }]} />
                <View style={stChiTietLichSuTiem.viewgrow}>
                    <View style={stChiTietLichSuTiem.viewTranparent} />
                    <View style={stChiTietLichSuTiem.container}>
                        <View style={stChiTietLichSuTiem.topBar} />
                        <View style={stChiTietLichSuTiem.header}>
                            <TouchableOpacity onPress={() => this._goback()} style={stChiTietLichSuTiem.btnBack}>
                                <Image source={Images.icBack} style={[nstyles.nIcon24, { tintColor: colorLinear.color[0] }]} resizeMode='contain' />
                            </TouchableOpacity>
                            <Text style={stChiTietLichSuTiem.txtHeader}>{'THÔNG TIN\n' + item?.name.replace('\n', ' ').toUpperCase()}</Text>
                            <View style={{ width: 45 }} />
                        </View>
                        <ScrollView style={{ paddingTop: 10 }}>
                            {this.renderUI(KeyComp.HOTEN)}
                            {this.renderUI(KeyComp.SDT)}
                            {this.renderUI(KeyComp.CMND)}
                            {this.renderUI(KeyComp.TENVACCIN)}
                            {this.renderUI(KeyComp.LOVACCIN)}
                            {this.renderUI(KeyComp.NOITIEM)}
                            {this.renderUI(KeyComp.GHICHU)}
                            {this.renderUI(KeyComp.PHANUNGSAUTIEM)}
                        </ScrollView>
                        <ButtonCom
                            onPress={() => this._goback()}
                            Linear={true}
                            colorChange={[colors.grayLight, colors.grayLight]}
                            shadow={false}
                            txtStyle={{ color: colors.white }}
                            style={stChiTietLichSuTiem.btnClose}
                            text={'Quay lại'}
                        />
                    </View>
                </View>
            </View >
        );
    }
}

const mapStateToProps = state => ({
    auth: state.auth,
    theme: state.theme,
    TinhHinhSucKhoe: state.datahcm.TinhHinhSucKhoe
});
export default Utils.connectRedux(ChiTietLichSuTiem, mapStateToProps, true);
