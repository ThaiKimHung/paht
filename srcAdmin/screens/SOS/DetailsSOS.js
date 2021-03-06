import React, { Component, Fragment } from 'react'
import { Text, View, ScrollView, TouchableOpacity, Linking, FlatList } from 'react-native'
import AppCodeConfig from '../../../app/AppCodeConfig'
import { appConfig } from '../../../app/Config'
import { ROOTGlobal } from '../../../app/data/dataGlobal'
import { nGlobalKeys } from '../../../app/keys/globalKey'
import Utils from '../../../app/Utils'
import { ButtonCom, HeaderCom, IsLoading } from '../../../components'
import ButtonCus from '../../../components/ComponentApps/ButtonCus'
import HtmlViewCom from '../../../components/HtmlView'
import { colors } from '../../../styles'
import { reText } from '../../../styles/size'
import { Width } from '../../../styles/styles'
import apis from '../../apis'
import { Images } from '../../images'
import { ConfigScreenDH } from '../../routers/screen'
import ImageFileCus from '../PhanAnhHienTruong/components/ImageFileCus'

const TextLine = (props) => {
    let { title = '', value = '', styleValue = {}, onPressValue } = props
    return (
        <View {...props} style={{ flexDirection: 'row', backgroundColor: colors.white, alignItems: 'flex-start', padding: 3, paddingHorizontal: 10, paddingVertical: 8 }}>
            <Text style={{ fontWeight: 'bold', minWidth: Width(25), fontSize: reText(13) }}>{title}: </Text>
            <TouchableOpacity activeOpacity={onPressValue ? 0.5 : 1} onPress={onPressValue} style={{ flex: 1 }}>
                <Text style={[{ flex: 1, textAlign: 'justify', lineHeight: 20 }, styleValue]}>{value ? value : ''}</Text>
            </TouchableOpacity>
        </View>
    )
}

const KeyButton = {
    ChuyenXuLy: 1,
    ThuHoi: 2,
    ChinhSua: 3,
    Xoa: 4,
    XuLy: 5,
    HoanThanh: 6
}

export class DetailsSOS extends Component {
    constructor(props) {
        super(props)
        this.callback = Utils.ngetParam(this, "callback", () => {
            ROOTGlobal.dataGlobal._reloadSOS()
            Linking.openURL(appConfig.deeplinkSOSCB_Home)
        });
        this.ID = Utils.ngetParam(this, 'ID', '')
        this.Rules = Utils.getGlobal(nGlobalKeys.rules, [], AppCodeConfig.APP_ADMIN)
        this.state = {
            ListButton: [],
            DataDetails: '',
            DataNhatKy: [],
            ListFileThaoTac: [],
            arrImg: [],
            arrFile: []
        };
    };

    componentDidMount() {
        this.GetDetailsSOS()
        this.GetList_NhatKyThaoTac()
        this.GetListFileThaoTac()
    }

    GetDetailsSOS = async () => {
        nthisIsLoading.show();
        let res = await apis.ApiSOS.Info_SOS(this.ID)
        Utils.nlog('res details sos', res)
        if (res.status == 1 && res.data) {
            nthisIsLoading.hide();
            let { FileDinhKem = [] } = res.data
            let arrFile = [], arrImg = []
            for (let i = 0; i < FileDinhKem.length; i++) {
                const item = FileDinhKem[i];
                if (item.Type == 2) {
                    arrFile.push({ ...item, FileName: item.TenFile })
                } else {
                    arrImg.push({ ...item, url: item.Link })
                }
            }
            this.setState({ DataDetails: res.data, arrImg: this.state.arrImg.concat(arrImg), arrFile: this.state.arrFile.concat(arrFile) }, this.handleCheckRuleButton)
        } else {
            nthisIsLoading.hide();
            this.setState({ DataDetails: '', arrImg: [], arrFile: [] }, this.handleCheckRuleButton)
        }
    }

    GetList_NhatKyThaoTac = async () => {
        nthisIsLoading.show();
        let res = await apis.ApiSOS.GetList_NhatKyThaoTac(this.ID)
        Utils.nlog('res nhat ky thao tac sos', res)
        if (res.status == 1 && res.data) {
            nthisIsLoading.hide();
            this.setState({ DataNhatKy: res.data })
        } else {
            nthisIsLoading.hide();
            this.setState({ DataNhatKy: [] })
        }
    }

    GetListFileThaoTac = async () => {
        nthisIsLoading.show();
        let res = await apis.ApiSOS.Info_SOSDetail(this.ID)
        Utils.nlog('res list file thao tac sos', res)
        if (res.status == 1 && res.data) {
            nthisIsLoading.hide();
            let { FileDinhKem = [] } = res.data
            let arrFile = [], arrImg = []
            for (let i = 0; i < FileDinhKem.length; i++) {
                const item = FileDinhKem[i];
                if (item.Type == 2) {
                    arrFile.push({ ...item, FileName: item.TenFile })
                } else {
                    arrImg.push({ ...item, url: item.Link })
                }
            }
            this.setState({ ListFileThaoTac: FileDinhKem, arrImg: this.state.arrImg.concat(arrImg), arrFile: this.state.arrFile.concat(arrFile) })
        } else {
            nthisIsLoading.hide();
            this.setState({ ListFileThaoTac: [] })
        }
    }

    handleCheckRuleButton = async () => {
        {/* {??? ????y x??? l?? hi???n th??? c??c button theo quy???n cho ph?? h??p: 1036 - (Chuy???n x??? l??, Ch???nh s???a,Thu h???i)}, 1037 - X??a */ }
        // let { Rules = [] } = this.props.auth.userDH
        let listButton = []
        switch (this.state.DataDetails.Status_SOS) {
            case 1: //M???i: Ch???nh s???a, x??a
                {
                    if (this.Rules.includes(1036)) {
                        listButton = listButton.concat([
                            {
                                Key: KeyButton.ChuyenXuLy,
                                Name: 'Chuy???n x??? l??',
                                color: colors.listColorBtnChan[1],
                            },
                            {
                                Key: KeyButton.ChinhSua,
                                Name: 'Ch???nh s???a',
                                color: colors.listColorBtnChan[2],
                            }
                        ])
                    }
                    if (this.Rules.includes(1037)) {
                        listButton = listButton.concat([
                            {
                                Key: KeyButton.Xoa,
                                Name: 'X??a',
                                color: colors.listColorBtnChan[3],
                            }
                        ])
                    }
                }
                break;
            case 2: //Chuy???n x??? l??: Ti???p nh???n, thu h???i
                {
                    if (this.Rules.includes(1038)) {
                        listButton = listButton.concat([
                            {
                                Key: KeyButton.XuLy,
                                Name: 'Ti???p nh???n x??? l??',
                                color: colors.listColorBtnChan[4],
                            }
                        ])
                    }
                    if (this.Rules.includes(1036)) {
                        listButton = listButton.concat([
                            {
                                Key: KeyButton.ThuHoi,
                                Name: 'Thu h???i',
                                color: colors.listColorBtnChan[1],
                            }
                        ])
                    }
                }
                break;
            case 3: //Ti???p nh???n: Ho??n th??nh
                if (this.Rules.includes(1038)) {
                    listButton = listButton.concat([
                        {
                            Key: KeyButton.HoanThanh,
                            Name: 'Ho??n th??nh',
                            color: colors.listColorBtnChan[5],
                        }
                    ])
                }
                break;
            case 4: //Ho??n th??nh: X??a
                if (this.Rules.includes(1037)) {
                    listButton = listButton.concat([
                        {
                            Key: KeyButton.Xoa,
                            Name: 'X??a',
                            color: colors.listColorBtnChan[3],
                        }
                    ])
                }
                break;
            case 5: //Thu h???i: Ch???nh s???a, x??a
                {
                    if (this.Rules.includes(1036)) {

                        listButton = listButton.concat([
                            {
                                Key: KeyButton.ChuyenXuLy,
                                Name: 'Chuy???n x??? l??',
                                color: colors.listColorBtnChan[1],
                            },
                            {
                                Key: KeyButton.ChinhSua,
                                Name: 'Ch???nh s???a',
                                color: colors.listColorBtnChan[2],
                            }
                        ])
                    }
                    if (this.Rules.includes(1037)) {
                        listButton = listButton.concat([
                            {
                                Key: KeyButton.Xoa,
                                Name: 'X??a',
                                color: colors.listColorBtnChan[3],
                            }
                        ])
                    }
                }
                break;
            default:
                break;
        }
        this.setState({ ListButton: listButton })
    }

    call = (number) => {
        let phoneNumber = '';
        if (number == undefined) {
            Utils.showMsgBoxOK(this, "Th??ng b??o", "Ch??a c?? s??? ??i???n tho???i", 'X??c nh???n')
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
    }

    ThuHoiSOS = () => {
        Utils.showMsgBoxYesNo(this, 'Th??ng b??o', 'B???n c?? ch???c mu???n thu h???i tin S.O.S n??y kh??ng ?', 'Thu h???i', 'H???y',
            async () => {
                nthisIsLoading.show();
                let res = await apis.ApiSOS.ThuHoiSOS(this.state.DataDetails)
                Utils.nlog('res thu hoi sos', res)
                if (res.status == 1) {
                    nthisIsLoading.hide();
                    Utils.showMsgBoxOK(this, 'Th??ng b??o', 'Thu h???i tin S.O.S th??nh c??ng', 'X??c nh???n', () => {
                        this.callback()
                        ROOTGlobal.dataGlobal._reloadSOS(1, this.ID)
                    })
                } else {
                    nthisIsLoading.hide();
                    Utils.showMsgBoxOK(this, 'Th??ng b??o', 'Thu h???i tin S.O.S th???t b???i', 'X??c nh???n')
                }
            })
    }

    XoaSOS = () => {
        Utils.showMsgBoxYesNo(this, 'Th??ng b??o', 'B???n c?? ch???c mu???n x??a tin S.O.S n??y kh??ng ?', 'X??a', 'H???y',
            async () => {
                nthisIsLoading.show();
                let res = await apis.ApiSOS.DeleteSOS(this.ID)
                Utils.nlog('res x??a sos', res)
                if (res.status == 1) {
                    nthisIsLoading.hide();
                    Utils.showMsgBoxOK(this, 'Th??ng b??o', 'X??a tin S.O.S th??nh c??ng', 'X??c nh???n', () => {
                        this.callback()
                        ROOTGlobal.dataGlobal._reloadSOS(1, this.ID)
                    })
                } else {
                    nthisIsLoading.hide();
                    Utils.showMsgBoxOK(this, 'Th??ng b??o', 'X??a tin S.O.S th???t b???i', 'X??c nh???n')
                }
            })
    }

    handleButton = (item) => {
        // X??? l?? c??c t???ng quy tr??nh t???i ????y, qua c??c m??n h??nh x??? l?? ph?? h???p
        switch (item.Key) {
            case KeyButton.ChuyenXuLy:
                //T???o modal gi???ng nh?? ti???p nh???n ph???n ??nh hi???n th??? c??c th??ng tin c?? trong item cho ph??p ch???nh s???a c??c tr?????ng v?? th??m file,g???i Api tiepnhan
                Utils.goscreen(this, ConfigScreenDH.Modal_ChuyenSuaSOS, {
                    item: { ...this.state.DataDetails },
                    title: item.Name, buttonHandle: item,
                    isEdit: false, callback: this.callback
                })
                break;
            case KeyButton.ThuHoi:
                //G???i modal x??? l?? SOS trong handleSOS swith case ????? chia tr?????ng h???p ra ????? g???i api cho ????ng. api/sos/ThuHoiSOS
                // Utils.goscreen(this, ConfigScreenDH.Modal_XuLySOS, { item: { ...this.state.DataDetails }, title: item.Name, buttonHandle: item })
                this.ThuHoiSOS()
                break;
            case KeyButton.ChinhSua:
                Utils.goscreen(this, ConfigScreenDH.Modal_ChuyenSuaSOS, {
                    item: { ...this.state.DataDetails },
                    title: item.Name, buttonHandle: item,
                    isEdit: false, callback: this.callback
                })
                //T???o modal gi???ng nh?? ch???nh s???a x??a ph???n ??nh hi???n th??? c??c th??ng tin c?? trong item cho ph??p ch???nh s???a c??c tr?????ng v?? th??m file, api/sos/AddEditSOS
                break;
            case KeyButton.Xoa:
                //G???i api/sos/DeleteSOS/25 ????? x??? l?? x??a SOS nh??? b???t modal h???i tr?????c khi th???c hi???n
                this.XoaSOS()
                break;
            case KeyButton.XuLy:
                //G???i api Ho??n th??nh api/sos/TiepNhanSOS
                Utils.goscreen(this, ConfigScreenDH.Modal_XuLySOS, { item: { ...this.state.DataDetails }, title: item.Name, buttonHandle: item, callback: this.callback })
                break;
            case KeyButton.HoanThanh:
                //G???i api api/sos/HoanThanhSOS
                Utils.goscreen(this, ConfigScreenDH.Modal_XuLySOS, { item: { ...this.state.DataDetails }, title: item.Name, buttonHandle: item, callback: this.callback })
                break;
            default:
                break;
        }
    }

    render() {
        const { ListButton, DataDetails, DataNhatKy, arrFile, arrImg } = this.state
        return (
            <View style={{ flex: 1, backgroundColor: colors.BackgroundHome }}>
                {/* Header */}
                <HeaderCom
                    titleText={'Chi ti???t S.O.S'}
                    iconLeft={Images.icBack}
                    onPressLeft={() => Utils.goback(this)}
                    onPressRight={this._openSetting}
                    onPressRight={() => Utils.goscreen(this, ConfigScreenDH.Modal_MapChiTietPA, {
                        dataItem: {
                            ...DataDetails,
                            TieuDe: DataDetails.DiaDiem
                        }
                    })}
                    iconRight={Images.icLocation}
                />
                <View style={{ flex: 1 }}>
                    <ScrollView showsVerticalScrollIndicator={false} style={{ backgroundColor: colors.white }} contentContainerStyle={{ paddingBottom: 50 }}>
                        <TextLine title={'Th???i gian'} value={DataDetails.CreatedDate ? DataDetails.CreatedDate : ''} />
                        <TextLine title={'H??? v?? t??n'} value={DataDetails.HoTen ? DataDetails.HoTen : ''} styleValue={{ color: colors.redStar, fontWeight: 'bold' }} />
                        <TextLine title={'S??? ??i???n tho???i'} value={`${DataDetails.SDT ? DataDetails.SDT + ' - Li??n h??? ngay' : ''}`} onPressValue={() => this.call(DataDetails.SDT)} styleValue={{ color: colors.redStar, fontWeight: 'bold' }} />
                        <TextLine title={'?????a ??i???m'} value={DataDetails.DiaDiem} />
                        <TextLine title={'M?? t???'} />
                        <View style={{ minHeight: 60, backgroundColor: 'rgba(235,200,0,0.1)', margin: 10, padding: 5 }}>
                            <HtmlViewCom
                                html={DataDetails.MoTa ? DataDetails.MoTa : ''}
                                style={{ height: '100%' }}
                            />
                        </View>
                        <TextLine title={'T??nh tr???ng'} value={DataDetails.TenTinhTrang ? DataDetails.TenTinhTrang : ''} styleValue={{ color: colors.orangCB, fontWeight: 'bold' }} />
                        <TextLine title={'File ????nh k??m'} />
                        <ScrollView showsHorizontalScrollIndicator={false} horizontal style={{ marginHorizontal: 10 }}>
                            {/* {arrImg.map((item, index) => */}
                            <ImageFileCus dataMedia={arrImg} dataFile={arrFile} nthis={this} />
                            {/* } */}
                        </ScrollView>
                        {/* {Render Button} */}
                        <FlatList
                            scrollEnabled={false}
                            style={{ backgroundColor: colors.white, padding: 5 }}
                            extraData={this.state}
                            numColumns={2}
                            data={ListButton}
                            renderItem={({ item, index }) => {
                                return (
                                    <ButtonCus
                                        textTitle={item.Name}
                                        onPressB={() => this.handleButton(item)}
                                        stContainerR={[{ flex: 1, borderRadius: 2, backgroundColor: item.color, marginTop: 5, margin: 5 }]}
                                    />
                                )
                            }}
                            keyExtractor={(item, index) => index.toString()}
                        />
                        <View style={{ margin: 10, borderWidth: 1, borderColor: colors.listColorBtnChan[0] }}>
                            <Text style={{ backgroundColor: colors.listColorBtnChan[0], color: colors.white, padding: 10, textAlign: 'center' }}>{'Nh???t k?? thao t??c'}</Text>
                            {DataNhatKy.length > 0 ? DataNhatKy.map((item, index) => {
                                return (
                                    <View key={index} style={{ marginTop: 10, backgroundColor: '#01638D1A', padding: 10 }}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <Text style={{ fontWeight: 'bold' }}>{item.NguoiTao}</Text>
                                            <Text style={{ fontStyle: 'italic' }}>{item.ThoiGian}</Text>
                                        </View>
                                        <Text style={{ fontSize: reText(12), lineHeight: 20 }}>{item.TenPhuongXa}</Text>
                                        <Text style={{ marginTop: 10 }}>{'Thao t??c: '}{item.NoiDungThaoTac}</Text>

                                    </View>
                                )
                            }) :
                                <Text style={{ padding: 10 }}>{'Kh??ng c?? d??? li???u'}</Text>
                            }
                        </View>
                    </ScrollView>
                </View>
                <IsLoading />
            </View>
        )
    }
}

const mapStateToProps = state => ({
    auth: state.auth
});

export default Utils.connectRedux(DetailsSOS, mapStateToProps, true);
