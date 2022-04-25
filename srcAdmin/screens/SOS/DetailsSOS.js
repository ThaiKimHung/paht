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
        {/* {Ở đây xử lý hiện thị các button theo quyền cho phù hơp: 1036 - (Chuyển xử lý, Chỉnh sửa,Thu hồi)}, 1037 - Xóa */ }
        // let { Rules = [] } = this.props.auth.userDH
        let listButton = []
        switch (this.state.DataDetails.Status_SOS) {
            case 1: //Mới: Chỉnh sửa, xóa
                {
                    if (this.Rules.includes(1036)) {
                        listButton = listButton.concat([
                            {
                                Key: KeyButton.ChuyenXuLy,
                                Name: 'Chuyển xử lý',
                                color: colors.listColorBtnChan[1],
                            },
                            {
                                Key: KeyButton.ChinhSua,
                                Name: 'Chỉnh sửa',
                                color: colors.listColorBtnChan[2],
                            }
                        ])
                    }
                    if (this.Rules.includes(1037)) {
                        listButton = listButton.concat([
                            {
                                Key: KeyButton.Xoa,
                                Name: 'Xóa',
                                color: colors.listColorBtnChan[3],
                            }
                        ])
                    }
                }
                break;
            case 2: //Chuyển xử lý: Tiếp nhận, thu hồi
                {
                    if (this.Rules.includes(1038)) {
                        listButton = listButton.concat([
                            {
                                Key: KeyButton.XuLy,
                                Name: 'Tiếp nhận xử lý',
                                color: colors.listColorBtnChan[4],
                            }
                        ])
                    }
                    if (this.Rules.includes(1036)) {
                        listButton = listButton.concat([
                            {
                                Key: KeyButton.ThuHoi,
                                Name: 'Thu hồi',
                                color: colors.listColorBtnChan[1],
                            }
                        ])
                    }
                }
                break;
            case 3: //Tiếp nhận: Hoàn thành
                if (this.Rules.includes(1038)) {
                    listButton = listButton.concat([
                        {
                            Key: KeyButton.HoanThanh,
                            Name: 'Hoàn thành',
                            color: colors.listColorBtnChan[5],
                        }
                    ])
                }
                break;
            case 4: //Hoàn thành: Xóa
                if (this.Rules.includes(1037)) {
                    listButton = listButton.concat([
                        {
                            Key: KeyButton.Xoa,
                            Name: 'Xóa',
                            color: colors.listColorBtnChan[3],
                        }
                    ])
                }
                break;
            case 5: //Thu hồi: Chỉnh sửa, xóa
                {
                    if (this.Rules.includes(1036)) {

                        listButton = listButton.concat([
                            {
                                Key: KeyButton.ChuyenXuLy,
                                Name: 'Chuyển xử lý',
                                color: colors.listColorBtnChan[1],
                            },
                            {
                                Key: KeyButton.ChinhSua,
                                Name: 'Chỉnh sửa',
                                color: colors.listColorBtnChan[2],
                            }
                        ])
                    }
                    if (this.Rules.includes(1037)) {
                        listButton = listButton.concat([
                            {
                                Key: KeyButton.Xoa,
                                Name: 'Xóa',
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
    }

    ThuHoiSOS = () => {
        Utils.showMsgBoxYesNo(this, 'Thông báo', 'Bạn có chắc muốn thu hồi tin S.O.S này không ?', 'Thu hồi', 'Hủy',
            async () => {
                nthisIsLoading.show();
                let res = await apis.ApiSOS.ThuHoiSOS(this.state.DataDetails)
                Utils.nlog('res thu hoi sos', res)
                if (res.status == 1) {
                    nthisIsLoading.hide();
                    Utils.showMsgBoxOK(this, 'Thông báo', 'Thu hồi tin S.O.S thành công', 'Xác nhận', () => {
                        this.callback()
                        ROOTGlobal.dataGlobal._reloadSOS(1, this.ID)
                    })
                } else {
                    nthisIsLoading.hide();
                    Utils.showMsgBoxOK(this, 'Thông báo', 'Thu hồi tin S.O.S thất bại', 'Xác nhận')
                }
            })
    }

    XoaSOS = () => {
        Utils.showMsgBoxYesNo(this, 'Thông báo', 'Bạn có chắc muốn xóa tin S.O.S này không ?', 'Xóa', 'Hủy',
            async () => {
                nthisIsLoading.show();
                let res = await apis.ApiSOS.DeleteSOS(this.ID)
                Utils.nlog('res xóa sos', res)
                if (res.status == 1) {
                    nthisIsLoading.hide();
                    Utils.showMsgBoxOK(this, 'Thông báo', 'Xóa tin S.O.S thành công', 'Xác nhận', () => {
                        this.callback()
                        ROOTGlobal.dataGlobal._reloadSOS(1, this.ID)
                    })
                } else {
                    nthisIsLoading.hide();
                    Utils.showMsgBoxOK(this, 'Thông báo', 'Xóa tin S.O.S thất bại', 'Xác nhận')
                }
            })
    }

    handleButton = (item) => {
        // Xử lý các từng quy trình tại đây, qua các màn hình xử lý phù hợp
        switch (item.Key) {
            case KeyButton.ChuyenXuLy:
                //Tạo modal giống như tiếp nhận phản ánh hiển thị các thông tin có trong item cho phép chỉnh sửa các trường và thêm file,gọi Api tiepnhan
                Utils.goscreen(this, ConfigScreenDH.Modal_ChuyenSuaSOS, {
                    item: { ...this.state.DataDetails },
                    title: item.Name, buttonHandle: item,
                    isEdit: false, callback: this.callback
                })
                break;
            case KeyButton.ThuHoi:
                //Gọi modal xử lý SOS trong handleSOS swith case để chia trường hợp ra để gọi api cho đúng. api/sos/ThuHoiSOS
                // Utils.goscreen(this, ConfigScreenDH.Modal_XuLySOS, { item: { ...this.state.DataDetails }, title: item.Name, buttonHandle: item })
                this.ThuHoiSOS()
                break;
            case KeyButton.ChinhSua:
                Utils.goscreen(this, ConfigScreenDH.Modal_ChuyenSuaSOS, {
                    item: { ...this.state.DataDetails },
                    title: item.Name, buttonHandle: item,
                    isEdit: false, callback: this.callback
                })
                //Tạo modal giống như chỉnh sửa xóa phản ánh hiển thị các thông tin có trong item cho phép chỉnh sửa các trường và thêm file, api/sos/AddEditSOS
                break;
            case KeyButton.Xoa:
                //Gọi api/sos/DeleteSOS/25 để xử lý xóa SOS nhớ bật modal hỏi trước khi thực hiện
                this.XoaSOS()
                break;
            case KeyButton.XuLy:
                //Gọi api Hoàn thành api/sos/TiepNhanSOS
                Utils.goscreen(this, ConfigScreenDH.Modal_XuLySOS, { item: { ...this.state.DataDetails }, title: item.Name, buttonHandle: item, callback: this.callback })
                break;
            case KeyButton.HoanThanh:
                //Gọi api api/sos/HoanThanhSOS
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
                    titleText={'Chi tiết S.O.S'}
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
                        <TextLine title={'Thời gian'} value={DataDetails.CreatedDate ? DataDetails.CreatedDate : ''} />
                        <TextLine title={'Họ và tên'} value={DataDetails.HoTen ? DataDetails.HoTen : ''} styleValue={{ color: colors.redStar, fontWeight: 'bold' }} />
                        <TextLine title={'Số điện thoại'} value={`${DataDetails.SDT ? DataDetails.SDT + ' - Liên hệ ngay' : ''}`} onPressValue={() => this.call(DataDetails.SDT)} styleValue={{ color: colors.redStar, fontWeight: 'bold' }} />
                        <TextLine title={'Địa điểm'} value={DataDetails.DiaDiem} />
                        <TextLine title={'Mô tả'} />
                        <View style={{ minHeight: 60, backgroundColor: 'rgba(235,200,0,0.1)', margin: 10, padding: 5 }}>
                            <HtmlViewCom
                                html={DataDetails.MoTa ? DataDetails.MoTa : ''}
                                style={{ height: '100%' }}
                            />
                        </View>
                        <TextLine title={'Tình trạng'} value={DataDetails.TenTinhTrang ? DataDetails.TenTinhTrang : ''} styleValue={{ color: colors.orangCB, fontWeight: 'bold' }} />
                        <TextLine title={'File đính kèm'} />
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
                            <Text style={{ backgroundColor: colors.listColorBtnChan[0], color: colors.white, padding: 10, textAlign: 'center' }}>{'Nhật ký thao tác'}</Text>
                            {DataNhatKy.length > 0 ? DataNhatKy.map((item, index) => {
                                return (
                                    <View key={index} style={{ marginTop: 10, backgroundColor: '#01638D1A', padding: 10 }}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <Text style={{ fontWeight: 'bold' }}>{item.NguoiTao}</Text>
                                            <Text style={{ fontStyle: 'italic' }}>{item.ThoiGian}</Text>
                                        </View>
                                        <Text style={{ fontSize: reText(12), lineHeight: 20 }}>{item.TenPhuongXa}</Text>
                                        <Text style={{ marginTop: 10 }}>{'Thao tác: '}{item.NoiDungThaoTac}</Text>

                                    </View>
                                )
                            }) :
                                <Text style={{ padding: 10 }}>{'Không có dữ liệu'}</Text>
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
