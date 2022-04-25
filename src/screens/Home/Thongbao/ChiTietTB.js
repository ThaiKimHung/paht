import React, { Component } from 'react'
import { Text, View, TouchableOpacity, Image, ScrollView, Linking } from 'react-native'
import { reText } from '../../../../styles/size'
import { Width, nstyles } from '../../../../styles/styles'
// import ComponentComDV from '../../../DichVu/ComponentCom'
import { Images } from '../../../images'
import { colors } from '../../../../styles'
import Utils from '../../../../app/Utils'
import apiNamLong from '../../../apis/apiNamLong'
import moment from 'moment'
import AutoHeightWebView from 'react-native-autoheight-webview'
import { HeaderCus, IsLoading } from '../../../../components'
import { FlatList } from 'react-native-gesture-handler'
import { nGlobalKeys } from '../../../../app/keys/globalKey'

export class ChiTietTB extends Component {
    constructor(props) {
        super(props);
        this.IdRow = Utils.ngetParam(this, 'IdRow');
        this.isCD = Utils.ngetParam(this, 'isCD', null);
        this.state = {
            dataCT: {},
            checkAdmin: false,
        }
    }
    componentDidMount() {
        this._getChiTietTB();
    }
    _getChiTietTB = async () => {
        nthisIsLoading.show();
        const res = await apiNamLong.ApiThongBao.getChiTietTB(this.IdRow, this.isCD);
        Utils.nlog("<>ct", res.data)
        if (res.status == 1) {
            nthisIsLoading.hide();
            this.setState({ dataCT: res.data, checkAdmin: res.data.IsNotifyAdmin })
        }
        else {
            this.setState({ dataCT: [] })
            nthisIsLoading.hide();
        }
    }

    _openFile = () => {

        Linking.openURL(dataChiTietThongBao.FileIn)

    }

    _renderItem = ({ item, index }) => {
        return (
            <TouchableOpacity key={index} onPress={() => Linking.openURL(item.src)}
                style={{ flexDirection: 'row', }}>
                <Text style={{ width: Width(70), color: colors.black_60, fontStyle: 'italic', marginBottom: 15 }}>Tên file: {item.filename}</Text>
                <View style={{
                    flexDirection: 'row', alignSelf: 'center'
                }}>
                    <Image source={Images.icDown} style={{ width: 15, height: 15, tintColor: colors.colorRedLeft }} />
                    <Text style={{ color: colors.colorRedLeft }}>Tải xuống</Text>
                </View>
            </TouchableOpacity>
        )

    }
    render() {
        const { dataCT, checkAdmin } = this.state;
        return (
            <View style={[nstyles.ncontainer, { backgroundColor: colors.backgroundModal, }]}>
                {/* <ComponentComDV.HeaderCom
                    Sleft={{ width: 18, height: 18, tintColor: colors.white }}
                    iconLeft={Images.icBack}
                    styleTitle={{ color: colors.white }}
                    onPressLeft={() => { Utils.goback(this, null) }}
                    colorChange={colors.colorLinearButton}
                    title={'Chi tiết thông báo'}
                ></ComponentComDV.HeaderCom> */}
                <HeaderCus
                    Sleft={{ tintColor: 'white' }}
                    // onPressLeft={() => Utils.goback(this)}
                    // onPressLeft={() => checkCD == null ? Utils.goscreen(this, 'ManHinh_Home') : checkCD == false ? Utils.goscreen(this, 'scHomeNotification') : Utils.goscreen(this, 'Modal_HomeThongBao')}
                    onPressLeft={() => checkAdmin == false || this.isCD == 0 ? Utils.goscreen(this, 'scHomeNotification') : checkAdmin == true || this.isCD == 1 ? Utils.goscreen(this, 'Modal_HomeThongBao') : Utils.goscreen(this, 'ManHinh_Home')}
                    iconLeft={Images.icBack}
                    title={'Chi tiết thông báo'}
                    styleTitle={{ color: colors.white }}
                // iconRight={Images.icHomeMenu}
                // onPressRight={() => Utils.goscreen(this, 'ManHinh_Home')}
                />
                <ScrollView style={{ flex: 1, backgroundColor: colors.white, paddingHorizontal: 15, paddingVertical: 10, paddingBottom: 15 }}>
                    <Text style={{ fontSize: reText(16), fontWeight: 'bold', color: colors.colorRedLeft }}>{dataCT.ThongBao}</Text>
                    <View style={{ width: '100%' }}>
                        <Text style={{ fontSize: reText(12), fontStyle: 'italic', alignSelf: 'flex-end', marginTop: 5, color: colors.black_50 }}>
                            Người tạo tin: {dataCT.PublishBy}</Text>
                    </View>
                    <View style={{ width: '100%' }}>
                        <Text style={{ fontSize: reText(12), fontStyle: 'italic', alignSelf: 'flex-end', color: colors.black_50 }}>
                            {moment(dataCT.PublishDate).format('DD/MM/YYYY HH:mm')}</Text>
                    </View>
                    <Text style={{ fontSize: reText(14), fontWeight: 'bold', color: colors.black_50 }}>Nội dung: </Text>
                    <AutoHeightWebView
                        showsVerticalScrollIndicator={false}
                        style={{ width: '100%', marginTop: 10, opacity: 0.99, minHeight: 1 }}
                        customScript={`document.body.style.background = 'white';`}
                        customStyle={`
                                * {
                                 
                                    resize: both;
                                    overflow: auto;
                                    font-size: 15px;
                                    line-height:20px;
                                    text-align: justify;
                                }
                            `}
                        files={[{
                            href: 'https://fonts.googleapis.com/css?family=Montserrat',
                            type: 'text/css',
                            rel: 'stylesheet'
                        }]}
                        source={{ html: dataCT.MoTa ? dataCT.MoTa : '<div></div>' }}
                        scalesPageToFit={false}
                        viewportContent={'width=device-width, user-scalable=no'}

                    />
                    {/* <TouchableOpacity onPress={() => Linking.openURL(dataCT.files[0])}
                                style={{ flexDirection: 'row', borderWidth: 0.5, borderRadius: 3, borderColor: colors.colorRedLeft, paddingVertical: 3, paddingHorizontal: 5 }}>
                                <Image source={Images.icDown} style={{ width: 15, height: 15, tintColor: colors.colorRedLeft }} />
                                <Text style={{ color: colors.colorRedLeft }}>Tải xuống</Text>
                            </TouchableOpacity> */}
                    <View style={{ marginTop: 10 }}>
                        <Text style={{ fontSize: reText(14), fontWeight: 'bold', color: colors.black_50 }}>File đính kèm: </Text>
                        {dataCT.files ?
                            <FlatList
                                style={{ marginBottom: 20 }}
                                data={dataCT.files}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={this._renderItem}
                            />
                            : <Text style={{ color: colors.black_50, fontStyle: 'italic' }}>Không có </Text>}
                    </View>
                </ScrollView>
                <IsLoading />
            </View >

        )
    }
}

export default ChiTietTB
