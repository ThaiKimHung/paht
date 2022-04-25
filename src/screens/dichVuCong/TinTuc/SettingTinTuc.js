import React, { Component } from 'react';
import { View, Text, Platform, Image, TouchableOpacity, FlatList, BackHandler } from 'react-native';
import { isIphoneX } from 'react-native-iphone-x-helper';
import { nGlobalKeys } from '../../../../app/keys/globalKey';
import { nkey } from '../../../../app/keys/keyStore';
import Utils from '../../../../app/Utils';
import { ButtonCom, HeaderCus, ListEmpty } from '../../../../components';
import { Images } from '../../../images';
import { colors } from '../../../../styles';
import { reSize, reText, sizes } from '../../../../styles/size';
import { nstyles, paddingTopMul } from '../../../../styles/styles';

class SettingTinTuc extends Component {
    constructor(props) {
        super(props);
        this.dataSettingTinTuc = Utils.getGlobal(nGlobalKeys.DataSettingTinTuc, [])
        this.callback = Utils.ngetParam(this, 'callback')
        this.state = {
            textempty: 'Không có dữ liệu...',
            data: this.dataSettingTinTuc.map(e => {
                return (
                    {
                        ...e
                    }
                )
            })
        };
    }
    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.backAction)
    }

    backAction = () => {
        Utils.goback(this)
        return true
    }

    componentWillUnmount() {
        try {
            BackHandler.removeEventListener('hardwareBackPress', this.backAction)
        } catch (error) {

        }
    }

    _onClickDVXL = (item, index) => {
        Utils.nlog('item', item)
        let { data } = this.state
        let temp = data.map(e => e)
        let findIndex = temp.findIndex(e => e.key == item.key)
        if (findIndex != -1) {
            temp[findIndex].isCheck = !temp[findIndex].isCheck
            this.setState({ data: temp })
        }
    }

    _renderItem = ({ item, index }) => {
        return (
            <TouchableOpacity
                onPress={() => this._onClickDVXL(item, index)}
                key={item.key}
                style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 15, paddingHorizontal: 20, alignItems: 'center', backgroundColor: colors.white, marginTop: 5 }}>
                <Image
                    source={item.isCheck == true ? Images.icRadioCheck : Images.icRadioUnCheck}
                    style={[nstyles.nIcon18, {}]}
                />
                <Text style={{ fontSize: sizes.sText14, flex: 1, paddingLeft: 10 }}>{item.title}</Text>

            </TouchableOpacity>

        )
    };

    _keyExtrac = (item, index) => index.toString();

    SaveSetting = async () => {
        Utils.setGlobal(nGlobalKeys.DataSettingTinTuc, this.state.data)
        await Utils.nsetStore(nkey.DataSettingTinTuc, this.state.data)
        this.callback();
        Utils.goback(this)
    }

    render() {
        let { data } = this.state
        return (
            <View style={{ flex: 1, backgroundColor: colors.BackgroundHome, paddingBottom: isIphoneX() ? 20 : 5 }}>
                <HeaderCus
                    Sleft={{ tintColor: 'white' }}
                    onPressLeft={() => Utils.goback(this)}
                    iconLeft={Images.icBack}
                    title={'Chọn nguồn cấp tin'}
                    styleTitle={{ color: colors.white }}
                />
                <View style={{ flex: 1 }}>
                    <FlatList
                        extraData={this.state}
                        style={{ flex: 1, marginTop: 10, }}
                        showsVerticalScrollIndicator={false}
                        renderItem={this._renderItem}
                        data={data}
                        ListEmptyComponent={<ListEmpty textempty={this.state.textempty} />}
                        keyExtractor={this._keyExtrac}
                        onEndReachedThreshold={0.3}
                    />

                </View>
                <ButtonCom
                    text={"Đồng ý"}
                    onPress={this.SaveSetting}
                    style={{ borderRadius: 5, marginHorizontal: 10, marginTop: 5 }}
                    txtStyle={{ fontSize: reText(14) }}
                />
            </View>
        );
    }
}

export default SettingTinTuc;
