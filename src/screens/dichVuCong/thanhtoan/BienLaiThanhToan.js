import React, { Component } from 'react'
import { FlatList, Image, Text, TouchableOpacity, View, Dimensions, Platform, TextInput, ScrollView, StyleSheet } from 'react-native'
import { nheight, nstyles, nwidth, paddingTopMul, Width } from '../../../../styles/styles'
import { Images } from '../../../images'
import { colors } from '../../../../styles'
import { reText } from '../../../../styles/size'
import Utils from '../../../../app/Utils'
import apis from '../../../apis'
import { HeaderCus, IsLoading } from '../../../../components'
import Pdf from 'react-native-pdf';
import RNFetchBlob from 'rn-fetch-blob'
// https://dichvucong.tayninh.gov.vn/KetQuaThanhToanDVCQG?data=559202_a3a4c10b-7a49-4efc-853f-3db5361dbae9&responseCode=00&secureCode=78c0919e16fe7844c42c9d2a2709fe78206db7b90e7c35d1d81c1851d023c55d

//https://dichvucong.tayninh.gov.vn/KetQuaThanhToanDVCQG?data=537846_5d46de76-7dab-4db2-a9e3-00889b8ab84e&responseCode=01&secureCode=1a42a786e96c4483c2ec26c1f3ef50762ed5ca5ef44c7247461f63f02849ba27
const ItemView = (props) => {
    const { title = '', value = '' } = props
    return (
        <View style={{ flexDirection: 'row', paddingVertical: reText(5) }}>
            <Text style={{ fontSize: reText(15), color: colors.black_50, }}>{title}</Text>
            <Text style={{
                flex: 1, textAlign: 'right', color: colors.black_80,
                fontSize: reText(16), fontWeight: 'bold'
            }}>{value}</Text>
        </View>
    )
}


export class BienLaiThanhToan extends Component {
    constructor(props) {
        super(props)
        this.state = {

            data: '',
            reFreshing: false,
            base64: ''
        }
        this.refLoading = React.createRef(null);
        this.webview = React.createRef(null);
        this.IDHS = Utils.ngetParam(this, "IDHS", '')
    }
    apiGet_HSDVC = async () => {
        this.refLoading.current.show();
        let res = await apis.ApiDVC.InBienLai(this.IDHS);
        Utils.nlog('res bien lai thanh toan', res)
        this.refLoading.current.hide();
        if (res.status == 1) {
            this.setState({ base64: res.data.data, reFreshing: false })
        } else {
            this.setState({ base64: '', reFreshing: false });
            Utils.showMsgBoxOK(this, "Thông báo", "Lấy biên lai bị lỗi", "Xác nhận", () => {
                Utils.goback(this);
            })
        }
    }

    componentDidMount() {
        this.apiGet_HSDVC();
    }

    goBack = () => {
        Utils.goback(this, null)
    }

    _save = () => {
        this.refLoading.current.show();
        let base64Str = this.state.base64;
        let pdfLocation = RNFetchBlob.fs.dirs.DocumentDir + '/' + `BienLai${this.IDHS}.pdf`;
        RNFetchBlob.fs.writeFile(pdfLocation, base64Str, 'base64').then(e => {
            if (Platform.OS === "ios") {
                this.refLoading.current.hide();
                RNFetchBlob.ios.openDocument(pdfLocation);
            } else {
                this.refLoading.current.hide();
                RNFetchBlob.android.actionViewIntent(pdfLocation);
            }
        });
    }


    render() {
        const { data, reFreshing, base64 } = this.state;
        const source = { uri: `data:application/pdf;base64,${base64}` }
        return (
            <View style={[nstyles.ncontainer, { backgroundColor: colors.white, }]}>
                <HeaderCus
                    Sleft={{ tintColor: 'white' }}
                    onPressLeft={() => Utils.goback(this)}
                    iconLeft={Images.icBack}
                    title={'Biên lai thanh toán'}
                    styleTitle={{ color: colors.white }}
                    titleRight={'Lưu'}
                    onPressRight={this._save}
                />
                <View style={stylespdf.container}>
                    {
                        base64 ? <Pdf
                            source={source}
                            onLoadComplete={(numberOfPages, filePath) => {
                                console.log(`number of pages: ${numberOfPages}`);
                            }}
                            onPageChanged={(page, numberOfPages) => {
                                console.log(`current page: ${page}`);
                            }}
                            onError={(error) => {
                                console.log(error);
                            }}
                            onPressLink={(uri) => {
                                console.log(`Link presse: ${uri}`)
                            }}
                            style={stylespdf.pdf} /> : null
                    }
                    <IsLoading ref={this.refLoading} />
                </View>
            </View>
        )
    }
}

const stylespdf = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',

    },
    pdf: {
        flex: 1,
        width: nwidth(),
        height: nheight(),
    }
});

export default BienLaiThanhToan;
