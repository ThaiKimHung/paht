import React, { Component } from 'react'
import { FlatList, ScrollView, Text, View, TouchableOpacity } from 'react-native'
import { appConfigCus } from '../../../app/Config'
import Utils from '../../../app/Utils'
import { HeaderCus, IsLoading } from '../../../components'
import HtmlViewCom from '../../../components/HtmlView'
import apis from '../../../srcAdmin/apis'
import ImageFileCus from '../../../srcAdmin/screens/PhanAnhHienTruong/components/ImageFileCus'
import { colors } from '../../../styles'
import { reText } from '../../../styles/size'
import { Width } from '../../../styles/styles'
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

export class ChiTietCanhBaoCovid extends Component {
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
        this.GetDetailsSOS()
    }

    GetDetailsSOS = async () => {
        nthisIsLoading.show();
        let res = await apis.ApiSOS.Info_SOS_APP(this.ID)
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
        const { ListButton, DataDetails, DataNhatKy, arrFile, arrImg = [] } = this.state
        return (
            <View style={{ flex: 1, backgroundColor: colors.BackgroundHome }}>
                {/* Header */}
                <HeaderCus
                    title={"Chi tiết cảnh báo covid"}
                    styleTitle={{ color: colors.white }}
                    iconLeft={Images.icBack}
                    onPressLeft={() => { Utils.goback(this) }}
                    iconRight={Images.icLocation}
                    Sright={{ tintColor: 'white' }}
                    onPressRight={() => Utils.goscreen(this, 'Modal_MapChiTietPA', {
                        dataItem: {
                            ...DataDetails,
                            TieuDe: DataDetails.DiaDiem
                        }
                    })}
                />
                <View style={{ flex: 1 }}>
                    <ScrollView showsVerticalScrollIndicator={false} style={{ backgroundColor: colors.white }} contentContainerStyle={{ paddingBottom: 50 }}>
                        <TextLine title={'Thời gian'} value={DataDetails.CreatedDate ? DataDetails.CreatedDate : ''} />
                        <TextLine title={'Họ và tên'} value={DataDetails.HoTen ? DataDetails.HoTen : ''} styleValue={{ color: colors.redStar, fontWeight: 'bold' }} />
                        <TextLine title={'Số điện thoại'} value={`${DataDetails.SDT ? DataDetails.SDT : ''}`} styleValue={{ color: colors.redStar, fontWeight: 'bold' }} />
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
                    </ScrollView>
                </View>
                <IsLoading />
            </View>
        )
    }
}

export default ChiTietCanhBaoCovid
