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

export class ChiTietCauHoi extends Component {
    constructor(props) {
        super(props)
        this.dataCauHoi = Utils.ngetParam(this, 'dataCauHoi', '');
        this.id = Utils.ngetParam(this, 'id');
        this.domainHoiDap = Utils.getGlobal(nGlobalKeys.domainHoiDap, 'https://hoidap.tayninh.gov.vn')
        this.state = {
            CauHoi: '',
            CauTraLoi: ''
        }
    }

    async componentDidMount() {
        nthisIsLoading.show()
        await this.GET_CauHoi()
        await this.GET_CauTraLoi()
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
        let res = await apis.ApiDVC.ChiTietCauHoi(this.dataCauHoi.Id ? this.dataCauHoi.Id : this.id)
        Utils.nlog('[LOG] cau hoi', res)
        if (res.status == 1 && res.data) {
            this.setState({ CauHoi: res.data })
        }
    }

    GET_CauTraLoi = async () => {
        let res = await apis.ApiDVC.ChiTietCauTraLoi(this.dataCauHoi.Id ? this.dataCauHoi.Id : this.id)
        Utils.nlog('chi tiet cau tra loi', res)
        if (res.status == 1 && res.data) {
            this.setState({ CauTraLoi: res.data })
        }
    }

    POST_DanhGiaCauTraLoi = async (rating, item) => {
        // Utils.nlog('item cau tra loi',item,rating)
        var formdata = new FormData();
        formdata.append("idtr", item.Id);
        formdata.append("rate", rating);
        formdata.append("code", "i@lBavj3$79Rms84nd");

        Utils.nlog('body', formdata)

        let res = await apis.ApiDVC.DanhGiaCauTraLoi(formdata)
        Utils.nlog('danh gia cau tra loi', res)
        if (res.status == 1 && res.data) {
            Utils.showToastMsg('Thông báo', 'Cám ơn ý kiến đánh giá của bạn !', icon_typeToast.success, 2000, icon_typeToast.success)
        }
    }

    render() {
        const { CauHoi, CauTraLoi } = this.state
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
                    <ScrollView style={{ padding: 10, backgroundColor: colors.white, }}>
                        {

                            CauHoi.length > 0 && CauHoi ? CauHoi.map((item, index) => {
                                return (
                                    <View key={index}>
                                        <View style={[{ flexDirection: 'row' }]}>
                                            <View style={{ flex: 1 }}>
                                                <Text style={{ fontWeight: 'bold', fontSize: reText(14), textAlign: 'justify' }}>{item.TieuDeHoi ? item.TieuDeHoi : ''}</Text>
                                                <View style={{ paddingVertical: 5 }}>
                                                    <Text style={{ paddingVertical: 2, fontSize: reText(12) }}>Người hỏi: {item.HoVaTen ? item.HoVaTen : ''}</Text>
                                                    <Text style={{ paddingVertical: 2, fontSize: reText(12) }}>Điện thoại: {item.DienThoai ? item.DienThoai : ''}</Text>
                                                    <Text style={{ paddingVertical: 2, fontSize: reText(12) }}>Email: {item.Email ? item.Email : ''}</Text>
                                                </View>
                                            </View>
                                            <View style={{ paddingLeft: 5 }}>
                                                <Image source={Images.icDatCauHoi} style={nstyles.nIcon40} />
                                            </View>
                                        </View>
                                        {/* <AutoHeightWebViewCus
                                            textLoading={'Đang tải nội dung câu hỏi'}
                                            source={{ html: item.NoiDungHoi ? item.NoiDungHoi : '<div></div>' }}
                                        /> */}
                                        <View style={{ flex: 1 }}>
                                            <HtmlViewCom html={item.NoiDungHoi ? item.NoiDungHoi : '<div></div>'} style={{}} />
                                        </View>
                                        {
                                            item.FileDinhkem && item.FileDinhkem != null ?
                                                <TouchableOpacity
                                                    onPress={() => { Utils.openWeb(this, item.FileDinhkem.toString()[0] == '~' ? this.domainHoiDap + item.FileDinhkem.replace('~', '') : this.domainHoiDap + item.FileDinhkem) }}
                                                    style={{ alignSelf: 'flex-start', marginTop: 10 }}>
                                                    <Text style={{ fontSize: reText(14), color: colors.blueFaceBook, fontWeight: 'bold', textAlign: 'justify' }}>{'📂 File đính kèm (nhấn vào đây để xem chi tiết)'}</Text>
                                                </TouchableOpacity>
                                                : null
                                        }
                                    </View>
                                )
                            }) : null
                        }
                        {
                            CauTraLoi.length > 0 && CauTraLoi ?
                                CauTraLoi.map((item, index) => {
                                    return (
                                        <View key={index} style={{ paddingBottom: 20 }}>
                                            <View style={{ height: 0.5, backgroundColor: colors.black, marginTop: 10 }} />
                                            <View style={[{ flexDirection: 'row', marginTop: 10 }]}>
                                                <View style={{ flex: 1 }}>
                                                    <Text style={{ fontWeight: 'bold', fontSize: reText(14), textAlign: 'justify' }}>Nội dung trả lời của {item.TenDonVi ? item.TenDonVi : ''}</Text>
                                                    <View style={{ paddingVertical: 5 }}>
                                                        <Text style={{ paddingVertical: 2, fontSize: reText(12), textAlign: 'justify' }}>Địa chỉ: {item.DiaChi ? item.DiaChi : ''}</Text>
                                                        <Text style={{ paddingVertical: 2, fontSize: reText(12), textAlign: 'justify' }}>Điện thoại: {item.DienThoai ? item.DienThoai : ''}</Text>
                                                        <Text style={{ paddingVertical: 2, fontSize: reText(12), textAlign: 'justify' }}>Email: {item.Email ? item.Email : ''}</Text>
                                                    </View>
                                                </View>
                                                <View style={{ paddingLeft: 5 }}>
                                                    <Image source={Images.icDatCauHoi} style={nstyles.nIcon40} />
                                                </View>
                                            </View>
                                            <Text style={{ fontSize: reText(12), textAlign: 'center', marginTop: 5 }}>Đánh giá câu trả lời:</Text>
                                            <AirbnbRating
                                                count={5}
                                                reviews={["Rất không hài lòng", "Không hài lòng", "Bình thường", "Hài lòng", "Rất hài lòng"]}
                                                defaultRating={0}
                                                reviewSize={reText(18)}
                                                size={25}
                                                starStyle={{ marginHorizontal: 5 }}
                                                onFinishRating={rating => this.POST_DanhGiaCauTraLoi(rating, item)}
                                            />
                                            {/* <AutoHeightWebViewCus
                                                textLoading={'Đang tải nội dung câu trả lời'}
                                                source={{ html: item.NoiDungTraLoi ? item.NoiDungTraLoi : '<div></div>' }}
                                            /> */}
                                            <View style={{ flex: 1 }}>
                                                <HtmlViewCom html={item.NoiDungTraLoi ? item.NoiDungTraLoi : '<div></div>'} style={{}} />
                                            </View>
                                            {
                                                item.FileDinhKem && item.FileDinhKem != null ?
                                                    <TouchableOpacity
                                                        onPress={() => { Utils.openWeb(this, item.FileDinhKem.toString()[0] == '~' ? this.domainHoiDap + item.FileDinhKem.replace('~', '') : this.domainHoiDap + item.FileDinhKem) }}
                                                        style={{ alignSelf: 'flex-start', marginVertical: 10 }}>
                                                        <Text style={{ fontSize: reText(14), color: colors.blueFaceBook, fontWeight: 'bold', textAlign: 'justify' }}>{'📂 File đính kèm (nhấn vào đây để xem chi tiết)'}</Text>
                                                    </TouchableOpacity>
                                                    : null
                                            }
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

export default ChiTietCauHoi
