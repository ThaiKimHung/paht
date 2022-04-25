import moment from 'moment';
import React, { Component } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, BackHandler } from 'react-native';
import { NavigationEvents } from 'react-navigation';
import Utils from '../../../app/Utils';
import { colors } from '../../../chat/styles';
import { ButtonCom, HeaderCus, ListEmpty } from '../../../components';
import { reSize, reText } from '../../../styles/size';
import { Height, nstyles, Width } from '../../../styles/styles';
import apis from '../../apis';
import { Images } from '../../images';

class DanhSachKeKhai extends Component {
    constructor(props) {
        super(props);
        this.state = {
            refreshing: true,
            dataToKhai: [],
            textempty: 'Đang tải...'
        };
    }
    _renderItem = ({ item, index }) => {
        let strKhaiBao = ``
        Object.keys(item).map(function (key, index) {
            dataKhaiBao.forEach(e => {
                if (e.Key == key && item[key]) {
                    strKhaiBao += `${e.IDCauHoi}. ${item[key] ? 'Có' : 'Không'} ${e.CauHoi.toLowerCase()}\n`
                }
            });
        });
        return (
            // <TouchableOpacity onPress={} activeOpacity={0.5}>
            <View key={index} style={{ flexDirection: 'row', backgroundColor: colors.white, justifyContent: 'flex-start', padding: 13 }}>
                <Image source={Images.icListTKYT} style={nstyles.nIcon20} resizeMode='contain' />
                <View style={{ flex: 1, paddingLeft: 15 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: reText(14) }}>{item?.NgayKhaiBao ? moment(item.NgayKhaiBao).format('DD/MM/YYYY HH:mm:ss') : ''}</Text>
                    <Text style={{ fontSize: reText(14), marginTop: 10, textAlign: 'justify', lineHeight: 25, color: strKhaiBao ? colors.redStar : colors.black }}>
                        {strKhaiBao ? strKhaiBao : 'Bình thường - Không có các dấu hiệu tiếp xúc hay triệu chứng liên quan.'}
                    </Text>
                </View>
            </View>
            // </TouchableOpacity>
        )
    }

    componentDidMount() {
        this.GetListToKhai()
        BackHandler.addEventListener('hardwareBackPress', this.backAction)
    }

    backAction = () => {
        Utils.goscreen(this, 'ManHinh_Home')
        return true
    }

    componentWillUnmount() {
        try {
            BackHandler.removeEventListener('hardwareBackPress', this.backAction)
        } catch (error) {

        }
    }

    GetListToKhai = async () => {
        const { userCD } = this.props.auth
        let res = await apis.ApiHCM.DanhSachToKhai(userCD?.UserID)
        Utils.nlog('[LOG] res danh sach to khai', res)
        if (res.status == 1 && res.data) {
            this.setState({ dataToKhai: res.data, refreshing: false })
        } else {
            this.setState({ dataToKhai: [], refreshing: false })
        }
    }

    _keyExtractor = (item, index) => index.toString()


    _onRefresh = () => {
        this.setState({ refreshing: true, dataToKhai: [] }, this.GetListToKhai)
    }

    loadMore = () => {

    }

    _ListFooterComponent = () => {
        return null
        // if (this.state.isLoadMore)
        //     return <ActivityIndicator size='small' style={{ marginTop: 10 }} />;
        // else return null
    }

    render() {
        const { theme } = this.props
        const { refreshing, textempty, dataToKhai } = this.state
        return (
            <View style={{ flex: 1, backgroundColor: colors.BackgroundHome }}>
                <HeaderCus
                    onPressLeft={() => Utils.goscreen(this, 'ManHinh_Home')}
                    iconLeft={Images.icBack}
                    title={`TỜ KHAI Y TẾ`}
                    styleTitle={{ color: colors.white, fontSize: reText(20) }}
                />
                <NavigationEvents
                    onWillFocus={() => { this._onRefresh() }}
                />
                <View style={{ flex: 1 }}>
                    <View style={{ backgroundColor: colors.white, paddingVertical: 10 }}>
                        <ButtonCom
                            onPress={() => {
                                Utils.goscreen(this, 'Modal_ToKhaiYTeHCM')
                            }}
                            shadow={false}
                            Linear={true}
                            txtStyle={{ color: theme.colorLinear.color[0] }}
                            style={
                                {
                                    borderRadius: 5,
                                    alignSelf: 'center', paddingHorizontal: 20,
                                    width: Width(45), backgroundColor: colors.white,
                                    borderWidth: 0.7, borderColor: theme.colorLinear.color[0]
                                }}
                            text={'Thêm mới tờ khai'}
                            colorChange={['transparent', 'transparent']}
                        />
                    </View>
                    <FlatList
                        contentContainerStyle={{ paddingBottom: 50 }}
                        data={dataToKhai}
                        renderItem={this._renderItem}
                        keyExtractor={this._keyExtractor}
                        ItemSeparatorComponent={() => {
                            return <View style={{ height: 1, backgroundColor: colors.brownGreyThree, marginLeft: reSize(48) }} />
                        }}
                        onRefresh={this._onRefresh}
                        refreshing={refreshing}
                        onEndReached={this.loadMore}
                        onEndReachedThreshold={0.4}
                        ListFooterComponent={this._ListFooterComponent}
                        ListEmptyComponent={<ListEmpty textempty={refreshing ? 'Đang tải...' : 'Không có dữ liệu'} isImage={!refreshing} />}
                    />
                </View>

            </View>
        );
    }
}

const dataKhaiBao = [
    {
        IDCauHoi: 1,
        CauHoi: 'Di chuyển đến tỉnh/thành phố, quốc gia/vùng lãnh thổ trong 14 ngày qua (Có thể đi qua nhiều nơi).',
        Value: false,
        Key: 'DenVungDich14Ngay'
    },
    {
        IDCauHoi: 2,
        CauHoi: 'Xuất hiện ít nhất 1 trong các dấu hiệu: sốt, ho, khó thở, viêm phổi, đau họng, mệt mỏi (viêm phổi) trong 14 ngày qua.',
        Value: false,
        Key: 'DauHienBenh14Ngay'
    },
    {
        IDCauHoi: 3,
        CauHoi: 'Tiếp xúc với người bệnh hoặc nghi ngờ, mắc bệnh COVID-19 trong 14 ngày qua.',
        Value: false,
        Key: 'TiepXucNguoiBenh14Ngay'
    },
    {
        IDCauHoi: 4,
        CauHoi: 'Tiếp xúc với người từ nước có bệnh COVID-19 trong 14 ngày qua.',
        Value: false,
        Key: 'TiepXucNguoiNuocCoBenh14Ngay'
    },
    {
        IDCauHoi: 5,
        CauHoi: 'Tiếp xúc với người có biểu hiện (Sốt, ho, khó thở , viêm phổi) trong 14 ngày qua.',
        Value: false,
        Key: 'TiepXucNguoiCoBieuHienBenh14Ngay'
    },
]

const mapStateToProps = state => ({
    auth: state.auth,
    theme: state.theme,

});
export default Utils.connectRedux(DanhSachKeKhai, mapStateToProps, true);
