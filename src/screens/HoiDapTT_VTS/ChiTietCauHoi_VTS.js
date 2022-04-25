import React, { Component, Fragment } from 'react'
import { Platform, Text, View, TouchableOpacity, Image, Alert, BackHandler } from 'react-native'
import { isIphoneX } from 'react-native-iphone-x-helper'
import Utils, { icon_typeToast } from '../../../app/Utils'
import { Images } from '../../images'
import { colors } from '../../../styles'
import { reText } from '../../../styles/size'
import { nstyles } from '../../../styles/styles'
import { Rating, AirbnbRating } from 'react-native-ratings';
import { HeaderCus, IsLoading } from '../../../components'
import apis from '../../apis'
import { ScrollView } from 'react-native-gesture-handler'
import AutoHeightWebViewCus from '../../../components/AutoHeightWebViewCus'
import { nGlobalKeys } from '../../../app/keys/globalKey'
import HtmlViewCom from '../../../components/HtmlView'

export class ChiTietCauHoi_VTS extends Component {
    constructor(props) {
        super(props)
        this.dataCauHoi = Utils.ngetParam(this, 'dataCauHoi', '');
        this.IdHoiDapTT = Utils.ngetParam(this, 'IdHoiDapTT', '');
        this.domainHoiDap = Utils.getGlobal(nGlobalKeys.domainHoiDap, 'https://hoidap.tayninh.gov.vn')
        this.state = {
            CauHoi: '',
            CauTraLoi: ''
        }
    }

    async componentDidMount() {
        nthisIsLoading.show()
        await this.GET_CauHoi()
        nthisIsLoading.hide()
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

    GET_CauHoi = async () => {
        Utils.nlog('[LOG] id cau hoi', this.dataCauHoi.Id)
        let res = await apis.apiHoiDapVTS.Info_HoiTT_App(this.dataCauHoi.Id ? this.dataCauHoi.Id : this.IdHoiDapTT)
        Utils.nlog('[LOG] cau hoi', res)
        if (res.status == 1 && res.data) {
            this.setState({ CauHoi: res.data })
        } else {
            this.setState({ CauHoi: '' })

        }
    }

    POST_DanhGiaCauTraLoi = async (rating, item) => {
        // Utils.nlog('item cau tra loi',item,rating)
        var formdata = new FormData();
        formdata.append("Temp", ""); // Bắt buột truyền rỗng hàng đầu
        formdata.append("Start", rating);
        formdata.append("IdDap", item.IdRow);
        Utils.nlog('body', formdata)
        let res = await apis.apiHoiDapVTS.DanhGia_DapTT(formdata)
        Utils.nlog('danh gia cau tra loi', res)
        if (res.status == 1) {
            Utils.showToastMsg('Thông báo', 'Cám ơn ý kiến đánh giá của bạn!', icon_typeToast.info, 1000)
        }
    }

    render() {
        const { CauHoi } = this.state
        return (
            <View style={{ flex: 1, backgroundColor: colors.BackgroundHome, paddingBottom: isIphoneX() ? 20 : 5 }}>
                <HeaderCus
                    Sleft={{ tintColor: 'white' }}
                    onPressLeft={() => Utils.goback(this)}
                    iconLeft={Images.icBack}
                    title={`Chi tiết câu hỏi`}
                    styleTitle={{ color: colors.white }}
                />
                <View style={{ flex: 1 }}>
                    <ScrollView style={{ paddingVertical: 10, backgroundColor: colors.white, }}>
                        <View style={{ padding: 10 }}>
                            <View style={[{ flexDirection: 'row' }]}>
                                <View style={{ paddingRight: 10 }}>
                                    <Image source={Images.icQuestionVTS} style={nstyles.nIcon40} />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <View style={{}}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <Text style={{ paddingRight: 10, fontSize: reText(12), textAlign: 'justify', flex: 1 }}>Người hỏi: {CauHoi?.HoTen ? CauHoi.HoTen : ''}</Text>
                                            <Text style={{ paddingVertical: 2, fontSize: reText(12), textAlign: 'justify' }}>{CauHoi?.CreatedDate ? CauHoi.CreatedDate : ''}</Text>
                                        </View>
                                        <Text style={{ paddingVertical: 2, fontSize: reText(12) }}>Điện thoại: {CauHoi?.SDT ? Utils.hidePhoneNum(CauHoi.SDT, 'x') : ''}</Text>
                                        <Text style={{ paddingVertical: 2, fontSize: reText(12) }}>Email: {CauHoi?.Email ? Utils.hideEmail(CauHoi.Email, 'x') : ''}</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={{ height: 0.5, backgroundColor: colors.grayLight, marginVertical: 10 }} />
                            <Text style={{ fontWeight: 'bold', fontSize: reText(14), textAlign: 'justify', marginBottom: 10 }}>{CauHoi?.TieuDe ? CauHoi.TieuDe : ''}</Text>
                            <View style={{ flex: 1 }}>
                                <HtmlViewCom html={CauHoi.NoiDung ? CauHoi.NoiDung : '<div></div>'} style={{}} />
                            </View>
                            {
                                CauHoi?.lstDinhKem?.length > 0 && CauHoi?.lstDinhKem ?
                                    <TouchableOpacity
                                        onPress={() => { Utils.openWeb(this, CauHoi.lstDinhKem[0]?.Link, { title: 'File đính kèm' }) }}
                                        style={{ alignSelf: 'flex-start', marginTop: 10 }}>
                                        <Text style={{ fontSize: reText(14), color: colors.blueFaceBook, fontWeight: 'bold', textAlign: 'justify' }}>{'📂 File đính kèm (nhấn vào đây để xem chi tiết)'}</Text>
                                    </TouchableOpacity>
                                    : null
                            }
                            {
                                CauHoi?.LyDoHuy ?
                                    <Text style={{ fontWeight: 'bold', fontSize: reText(14), textAlign: 'justify', marginTop: 10, color: colors.redStar }}>Lý do huỷ: {CauHoi?.LyDoHuy ? CauHoi.LyDoHuy : ''}</Text>
                                    : null
                            }
                            {
                                CauHoi?.LyDoTraLai ?
                                    <Text style={{ fontWeight: 'bold', fontSize: reText(14), textAlign: 'justify', marginTop: 10, color: colors.redStar }}>Lý do trả lại: {CauHoi?.LyDoTraLai ? CauHoi.LyDoTraLai : ''}</Text>
                                    : null
                            }
                        </View>

                        {
                            CauHoi?.lstDap?.length > 0 && CauHoi?.lstDap ?
                                CauHoi?.lstDap.map((item, index) => {
                                    return (
                                        <View key={index} style={{ paddingBottom: 20 }}>
                                            <View style={{ height: 10, backgroundColor: colors.BackgroundHome, marginTop: 10 }} />
                                            <View style={{ padding: 10 }}>
                                                <View style={[{ flexDirection: 'row', marginTop: 10 }]}>
                                                    <View style={{ paddingRight: 5 }}>
                                                        <Image source={Images.icAnswerVTS} style={nstyles.nIcon40} />
                                                    </View>
                                                    <View style={{ flex: 1 }}>
                                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                                            <Text style={{ paddingRight: 10, fontSize: reText(12), textAlign: 'justify', flex: 1 }}>Người trả lời: {item?.FullName ? item.FullName : ''}</Text>
                                                            <Text style={{ paddingVertical: 2, fontSize: reText(12), textAlign: 'justify' }}>{item?.CreatedDate ? item.CreatedDate : ''}</Text>
                                                        </View>
                                                        <Text style={{ paddingVertical: 2, fontSize: reText(12), textAlign: 'justify' }}>Điện thoại: {item?.SDT ? Utils.hidePhoneNum(item.SDT, 'x') : ''}</Text>
                                                        <Text style={{ paddingVertical: 2, fontSize: reText(12), textAlign: 'justify' }}>Email: {item?.Email ? Utils.hideEmail(item.Email, 'x') : ''}</Text>
                                                        <Text style={{ paddingVertical: 2, fontSize: reText(12), textAlign: 'justify' }}>Đơn vị trả lời: {item?.TenPhuongXa ? item.TenPhuongXa : ''}</Text>
                                                        <Text style={{ paddingVertical: 2, fontSize: reText(12), textAlign: 'justify' }}>Địa chỉ: {item?.DiaChiDonVi ? item.DiaChiDonVi : ''}</Text>
                                                    </View>
                                                </View>
                                                <View style={{ height: 0.5, backgroundColor: colors.grayLight, marginVertical: 10 }} />
                                                <Text style={{ fontWeight: 'bold', fontSize: reText(14), textAlign: 'justify', marginBottom: 10 }}>Phản hồi câu hỏi: {CauHoi?.TieuDe ? CauHoi?.TieuDe : ''}</Text>

                                                <View style={{ flex: 1 }}>
                                                    <HtmlViewCom html={item.NoiDungTraLoi ? item.NoiDungTraLoi : '<div></div>'} style={{}} />
                                                </View>
                                                {
                                                    item?.lstDinhKem_Dap?.length > 0 && item?.lstDinhKem_Dap ?
                                                        <TouchableOpacity
                                                            onPress={() => { Utils.openWeb(this, item.lstDinhKem_Dap[0]?.Link, { title: 'File đính kèm' }) }}
                                                            style={{ alignSelf: 'flex-start', marginTop: 10 }}>
                                                            <Text style={{ fontSize: reText(14), color: colors.blueFaceBook, fontWeight: 'bold', textAlign: 'justify' }}>{'📂 File đính kèm (nhấn vào đây để xem chi tiết)'}</Text>
                                                        </TouchableOpacity>
                                                        : null
                                                }
                                            </View>
                                            <View style={{ height: 10, backgroundColor: colors.BackgroundHome, marginTop: 10 }} />
                                            <Text style={{ fontWeight: 'bold', fontSize: reText(14), textAlign: 'justify', padding: 10 }}>Đánh giá câu trả lời: {item?.TenPhuongXa}</Text>
                                            <AirbnbRating
                                                count={5}
                                                reviews={["Rất không hài lòng", "Không hài lòng", "Bình thường", "Hài lòng", "Rất hài lòng"]}
                                                defaultRating={item?.Start}
                                                reviewSize={reText(18)}
                                                size={25}
                                                starStyle={{ marginHorizontal: 5 }}
                                                onFinishRating={rating => this.POST_DanhGiaCauTraLoi(rating, item)}
                                            />
                                        </View>
                                    )
                                })
                                : null
                        }



                    </ScrollView>
                </View>
                <IsLoading />
            </View>
        )
    }
}

export default ChiTietCauHoi_VTS
