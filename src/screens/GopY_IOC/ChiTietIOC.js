import React, { Component } from 'react'
import { FlatList, ScrollView, Text, View, TouchableOpacity } from 'react-native'
import { appConfigCus } from '../../../app/Config'
import Utils from '../../../app/Utils'
import { HeaderCus, IsLoading } from '../../../components'
import HtmlViewCom from '../../../components/HtmlView'
import ImageFileCus from '../../../srcAdmin/screens/PhanAnhHienTruong/components/ImageFileCus'
import { colors } from '../../../styles'
import { reText } from '../../../styles/size'
import { Width } from '../../../styles/styles'
import apis from '../../apis'
import { Images } from '../../images'

const TextLine = (props) => {
    let { title = '', value = '', styleValue = {}, onPressValue } = props
    return (
        <View {...props} style={{ flexDirection: 'row', backgroundColor: colors.white, alignItems: 'flex-start', padding: 3, paddingHorizontal: 10, paddingVertical: 8 }}>
            <Text style={{ fontWeight: 'bold', minWidth: Width(25), fontSize: reText(13) }}>{title}: </Text>
            <TouchableOpacity activeOpacity={onPressValue ? 0.5 : 1} onPress={onPressValue} style={{ flex: 1 }}>
                <Text style={[{ flex: 1, textAlign: 'justify', lineHeight: 20 }, styleValue]}>{value}</Text>
            </TouchableOpacity>
        </View>
    )
}
export class ChiTietIOC extends Component {
    constructor(props) {
        super(props)
        this.ID = Utils.ngetParam(this, 'ID', '')
        this.state = {
            ListButton: [],
            DataDetails: '',
            DataNhatKy: [],
            ListFileThaoTac: [],
            arrImg: [],
            arrFile: [],
        };
    };

    componentDidMount() {
        this.GetDetailsIOC()
    }

    GetDetailsIOC = async () => {
        nthisIsLoading.show();
        let res = await apis.ApiUser.Info_FeedBack_APP(this.ID)
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
                    arrImg.push({ ...item, url: appConfigCus.live.domain + item.Path })
                }
            }
            this.setState({ DataDetails: res.data, arrImg: this.state.arrImg.concat(arrImg), arrFile: this.state.arrFile.concat(arrFile) })
        } else {
            nthisIsLoading.hide();
            this.setState({ DataDetails: '', arrImg: [], arrFile: [] })
        }
    }

    render() {
        const { DataDetails, arrFile, arrImg = [] } = this.state
        Utils.nlog("-----------------arrFile,arrImg", arrImg, arrFile)
        return (
            <View style={{ flex: 1, backgroundColor: colors.BackgroundHome }}>
                {/* Header */}
                <HeaderCus
                    title={"Chi tiết gửi góp ý"}
                    styleTitle={{ color: colors.white }}
                    iconLeft={Images.icBack}
                    onPressLeft={() => { Utils.goback(this) }}
                />
                <View style={{ flex: 1 }}>
                    <ScrollView showsVerticalScrollIndicator={false} style={{ backgroundColor: colors.white }} contentContainerStyle={{ paddingBottom: 50 }}>
                        <TextLine title={'Thời gian'} value={DataDetails.CreatedDate ? DataDetails.CreatedDate : ''} />
                        <TextLine title={'Họ và tên'} value={DataDetails.HoTen ? DataDetails.HoTen : ''} styleValue={{ color: colors.redStar, fontWeight: 'bold' }} />
                        <TextLine title={'Số điện thoại'} value={`${DataDetails.SDT ? DataDetails.SDT : ''}`} styleValue={{ color: colors.redStar, fontWeight: 'bold' }} />
                        {/* {Tỉnh nào có loại góp ý thì mở ra} */}
                        {/* <TextLine title={'Tên góp ý'} value={DataDetails.TenLoaiFeedBack ? DataDetails.TenLoaiFeedBack : ''} styleValue={{ color: colors.colorHeaderApp, fontWeight: 'bold' }} /> */}
                        <TextLine title={'Nội dung'} />
                        <View style={{ minHeight: 60, backgroundColor: 'rgba(235,200,0,0.1)', padding: 5, marginHorizontal: 10 }}>
                            <HtmlViewCom
                                html={DataDetails.NoiDung ? DataDetails.NoiDung : ''}
                                style={{ height: '100%' }}
                            />
                        </View>
                        <TextLine title={'File đính kèm'} />
                        <ScrollView showsHorizontalScrollIndicator={false} horizontal style={{ marginHorizontal: 10 }}>
                            {/* {arrImg.map((item, index) => */}
                            <ImageFileCus dataMedia={arrImg} dataFile={arrFile} nthis={this} />
                            {/* } */}
                        </ScrollView>
                        <View style={{ flexDirection: 'row', marginTop: 5, margin: 10, }}>
                            <Text style={{ fontSize: reText(13), color: colors.colorHeaderApp, fontWeight: 'bold' }}>Thông tin phản hồi:</Text>
                            <Text style={{ fontSize: reText(13), fontStyle: 'italic', color: DataDetails.Answer ? null : colors.redDark, flex: 1 }}> {DataDetails.Answer ? DataDetails.Answer.NoiDungTraLoi : 'Chưa có phản hồi'}</Text>
                        </View>
                    </ScrollView>
                </View>
                <IsLoading />
            </View >
        )
    }
}

export default ChiTietIOC
