import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Utils from '../../../app/Utils';
import { nstyles, colors, sizes, styles } from '../../../styles';
import { HeaderCom, TextInputCom } from '../../../components';
import ButtonCus from '../../../components/ComponentApps/ButtonCus';
import { Width, Height } from '../../../styles/styles';
import HeaderModal from './components/HeaderModal';
import ItemDrop from './components/ItemDrop';
import { Images } from '../../images';
import InputCus from '../../../components/ComponentApps/InputCus';
// const stLogin = StyleSheet.create({
//     contentInput: {
//         // marginHorizontal: '10%',
//         fontWeight: '600',
//         backgroundColor: 'transparent'
//     },
//     textThongbao: {
//         color: colors.black_80,
//         fontSize: sizes.sizes.sText18,
//         fontWeight: '600',
//     },
//     viewcontainer: {
//         paddingVertical: 20,
//         flex: 1,
//         flexDirection: 'column'
//     },
//     textTitleItem: {
//         paddingHorizontal: 30,
//         color: colors.black_20,
//         fontSize: sizes.sizes.sText16,
//         fontWeight: '600',

//     },
//     textValueItem: {
//         paddingHorizontal: 30,
//         color: colors.black_80,
//         fontSize: sizes.sizes.sText16,
//         fontWeight: '300',

//     }
// });
class ModalSetting extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }
    goback = () => {
        Utils.goback(this)
    }
    _onWebViewMessage = (event: WebViewMessageEvent) => {
        this.setState({ height: Number(event.nativeEvent.data) });
    }
    render() {
        return (
            <View style={[{ flex: 1, justifyContent: 'center' }]} >
                <View style={{
                    position: 'absolute', left: 0, top: 0, bottom: 0,
                    right: 0, flex: 1, backgroundColor: colors.backgroundModal,
                    alignItems: 'center'
                }} onTouchEnd={this.goback} />
                <View style={{
                    backgroundColor: colors.white,
                    flex: 1, marginTop: nstyles.Height(40), borderTopLeftRadius: 30, borderTopRightRadius: 30
                }}>
                    <HeaderModal
                        title=''
                    />
                    <View style={{ flexDirection: 'row', marginLeft: 15, paddingVertical: 0 }}>
                        <ItemDrop
                            textTitle="Từ ngày"
                            textValue="13/01/2020"
                            icon={Images.icCalendar}
                            iconStyle={nstyles.nstyles.nIcon14}
                            stContainer={{ marginRight: 5, }}
                        />
                        <ItemDrop
                            textTitle="Đến ngày"
                            textValue="13/02/2020"
                            icon={Images.icCalendar}
                            style={nstyles.nstyles.nIcon14}
                            stContainer={{ marginRight: 14, marginLeft: 10 }}
                        />
                    </View>
                    <View style={{ flexDirection: 'row', marginLeft: 15, marginTop: 10 }}>
                        <ItemDrop
                            textTitle="Chuyên mục"
                            textValue="Tất cả"
                            icon={Images.icDropDown}
                            stContainer={{ marginRight: 5, }}
                        />
                        <ItemDrop
                            textTitle="Lĩnh vực"
                            textValue="Tất cả"
                            icon={Images.icDropDown}
                            stContainer={{ marginRight: 14, marginLeft: 10 }}
                        />
                    </View>
                    <View style={{ flexDirection: 'row', marginLeft: 15, marginTop: 10 }}>
                        <ItemDrop
                            textTitle="Mức độ"
                            textValue="Tất cả"
                            icon={Images.icDropDown}
                            stContainer={{ marginRight: 5, }}
                        />
                        <ItemDrop
                            textTitle="Nguồn"
                            textValue="Tất cả"
                            icon={Images.icDropDown}
                            stContainer={{ marginRight: 14, marginLeft: 10 }}
                        />
                    </View>
                    <View style={{ marginLeft: 15 }}>

                        <InputCus
                            placeholder='Nội dung tìm kiếm'
                            customStyle={{ backgroundColor: colors.veryLightPink, borderRadius: 2, marginRight: 14 }}
                            icon={Images.icSearchGrey}
                            showIcon={true}
                            iconStyle={nstyles.nstyles.nIcon18}
                        />
                        <ButtonCus
                            textTitle={`Thực hiện`}
                            stContainerR={{ marginTop: 20.5 }}
                        />
                    </View>

                </View>
            </View >

        );
    }
}
export default ModalSetting
