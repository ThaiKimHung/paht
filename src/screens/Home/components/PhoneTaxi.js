import React, { Component } from 'react'
import { View, FlatList, TouchableOpacity, Image, TextInput, Text, Linking } from 'react-native'
import Utils from '../../../../app/Utils'
import UtilsApp from '../../../../app/UtilsApp'
import { HeaderCus } from '../../../../components'
import { colors } from '../../../../styles'
import { reText } from '../../../../styles/size'
import { nstyles } from '../../../../styles/styles'
import apis from '../../../apis'
import { Images } from '../../../images'

class PhoneTaxi extends Component {
    constructor(props) {
        super(props)

        this.state = {
            keySearch: '',
            dataLienHe: [],
            text: 'Đang tải...',
            refreshing: true
        }
    }

    componentDidMount() {
        this.GetList_LienHe()
    }

    GetList_LienHe = async () => {
        let res = await apis.ApiApp.GetList_LienHe(2)
        Utils.nlog("GetList_LienHe:", res);
        if (res.status == 1) {
            this.setState({ dataLienHe: res.data, refreshing: false })
        }
    }

    dialCall = (number) => {
        Utils.nlog("<><><>", number)
        let phoneNumber = '';
        if (number == undefined) {
            Utils.showMsgBoxOK(this, "Thông báo", "Chưa có số điện thoại", 'Xác nhận')
            return;
        }
        if (Utils.validateEmail(number)) {
            phoneNumber = `mailto:${number}`;
        } else if (Platform.OS === 'android') {
            phoneNumber = `tel:${number}`;
        }
        else {
            phoneNumber = `telprompt:${number}`;
        }
        Linking.openURL(phoneNumber)

    };

    _renderItem = ({ item, index }) => {
        return (
            <TouchableOpacity onPress={() => this.dialCall(item.NoiDung.trim())} style={[nstyles.shadown, { backgroundColor: colors.white, marginTop: 10, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, borderRadius: 5 }]}>
                <Image style={[nstyles.nIcon30]} source={Images.icCallTaxi} resizeMode='contain' />
                <View style={{ padding: 5, paddingLeft: 10 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: reText(14), lineHeight: 25 }}>{item.TieuDe.trim()}</Text>
                    <Text style={{ fontStyle: 'italic', color: colors.brownGreyThree }}>{item.NoiDung.trim()}</Text>
                </View>
            </TouchableOpacity>

        )
    }

    filterPhone = async () => {
        let { keySearch, dataLienHe, temp } = this.state
        let res = await apis.ApiApp.GetList_LienHe(2, keySearch)
        Utils.nlog("GetList_LienHe:", res);
        if (res.status == 1) {
            this.setState({ dataLienHe: res.data, refreshing: false })
        }
    }

    render() {
        const { dataLienHe } = this.state
        return (
            <View style={{ flex: 1, backgroundColor: colors.BackgroundHome }}>
                <HeaderCus
                    title={UtilsApp.getScreenTitle("PhoneTaxi", 'Taxi')}
                    styleTitle={{ color: 'white' }}
                    iconLeft={Images.icBack}
                    onPressLeft={() => Utils.goback(this)}
                />
                <View
                    style={{
                        borderWidth: 1,
                        backgroundColor: colors.white,
                        borderRadius: 5, flexDirection: 'row', alignItems: 'center',
                        margin: 10, paddingHorizontal: 10, borderColor: colors.brownGreyThree
                    }}>
                    <TextInput
                        style={{ padding: 10, flex: 1 }}
                        placeholder={'Từ khóa...'}
                        onChangeText={text => this.setState({ keySearch: text }, this.filterPhone)}
                    />
                    <Image source={Images.icSearch} />
                </View>
                <View style={{ flex: 1, paddingHorizontal: 10 }}>
                    <FlatList
                        refreshing={this.state.refreshing}
                        onRefresh={this.GetList_LienHe}
                        data={dataLienHe}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={this._renderItem}
                    />
                </View>
            </View>
        )
    }
}

const mapStateToProps = state => ({
    theme: state.theme
});

export default Utils.connectRedux(PhoneTaxi, mapStateToProps, true)
