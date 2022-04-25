import React, { Fragment, Component } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Animated, Image,
    StyleSheet,
    ScrollView
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import moment from 'moment';
import { nstyles, colors, sizes } from '../../../styles';
import Utils, { icon_typeToast } from '../../../app/Utils';
import { ListEmpty, TextInputCom, DatePick } from '../../../components';
import { Images } from '../../images';
import apis from '../../apis';
import ModalDrop from '../PhanAnhHienTruong/components/ModalDrop';
// import '../../../components/node_modules/moment/locale/vi'
import { GetConfigByCodeBy } from '../../apis/apiapp';

const dataLocTheo = [
    // { IdQuyen: 0, TenQuyen: 'Tất cả phản ánh' },
    { id: -1, TenQuyen: 'Tất cả' },
    { id: 1, TenQuyen: 'Hệ thống chính' },
    { id: 2, TenQuyen: 'Dịch vụ 3C' },
    { id: 3, TenQuyen: 'Dịch vụ Zalo' },
];
const dataMucDoKC = [
    { IdKhanCap: 100, TenKhanCap: 'Tất cả' },
    { IdKhanCap: 1, TenKhanCap: 'Khẩn cấp' },
    { IdKhanCap: 0, TenKhanCap: 'Bình thường' },

]
class HomeSetting extends Component {
    constructor(props) {
        super(props);
        this.callbacSetting = Utils.ngetParam(this, 'callbacSetting');
        this.dataSetting = Utils.ngetParam(this, 'dataSetting');
        this.isChuyenDeBiet = Utils.ngetParam(this, 'isChuyenDeBiet', false)
        // this.item = Utils.ngetParam(this, 'item');
        // this.AllThaoTac = Utils.ngetParam(this, 'AllThaoTac');
        const {
            selectNguon,
            selectChuyenMuc,
            selectLinhVuc,
            selectMucDo,
            selectLocTheo,
            selectMucDoKhanCap,
            dateTo,
            dateFrom,
            keyword
        } = this.dataSetting;
        this.textChange = keyword;
        this.state = {
            textempty: 'Không có dữ liệu',
            opacity: new Animated.Value(0),
            selectNguon,
            selectChuyenMuc,
            selectLinhVuc,
            selectMucDo,
            selectLocTheo,
            selectMucDoKhanCap,
            dateTo,
            dateFrom,
            dataLocTheo: [
                { id: -1, TenQuyen: 'Tất cả' },
                { id: 1, TenQuyen: 'Hệ thống chính' }
            ]
        }
    };



    _goback = () => {
        Utils.goback(this);
    }



    _startAnimation = (value) => {
        setTimeout(() => {
            Animated.timing(this.state.opacity, {
                toValue: value,
                duration: 250
            }).start();
        }, 250);
    };


    _selectLocTheo = (item, key) => {
        switch (key) {
            case 1:
                this.setState({ selectChuyenMuc: item });
                break;
            case 2:
                this.setState({ selectNguon: item });
                break;
            case 3:
                this.setState({ selectLinhVuc: item });
                break;
            case 4:
                this.setState({ selectMucDo: item });
                break;
            case 5:
                this.setState({ selectLocTheo: item });
                break;
            case 6:
                this.setState({ selectMucDoKhanCap: item });
                break;
        };
    }

    _oncahgeText = (text) => {
        this.textChange = text
    }

    _search = () => {
        const { selectNguon, selectChuyenMuc, selectLinhVuc, selectMucDo, selectLocTheo, selectMucDoKhanCap, dateTo, dateFrom } = this.state;
        const obj = {
            selectNguon,
            selectChuyenMuc,
            selectLinhVuc,
            selectMucDo,
            selectLocTheo,
            selectMucDoKhanCap,
            dateTo: this.state.dateTo,
            dateFrom: this.state.dateFrom,
            keyword: this.textChange
        };
        this._goback();
        this.callbacSetting(obj);

    }
    _LamMoi = () => {
        const obj = {
            selectNguon: { IdNguon: 100, TenNguon: 'Tất cả' },
            selectChuyenMuc: { IdChuyenMuc: 100, TenChuyenMuc: 'Tất cả' },
            dateTo: '',
            dateFrom: '',
            keyword: '',
        };
        this._goback();
        this.callbacSetting(obj);

    }


    getConfig3C = async () => {
        let res = await GetConfigByCodeBy("INTEGRATED_3C");
        if (res && res.status == 1) {
            let check = res.data && res.data.Value == "1" ? true : false;
            if (check) {
                this.setState({
                    dataLocTheo: [...this.state.dataLocTheo].concat({ id: 2, TenQuyen: 'Dịch vụ 3C' })
                })
            } else {
            }
        }
    }

    getConfigZalo = async () => {
        let res = await GetConfigByCodeBy("INTEGRATED_ZALO");
        if (res && res.status == 1) {
            let check = res.data && res.data.Value == "1" ? true : false;
            if (check) {
                this.setState({
                    dataLocTheo: [...this.state.dataLocTheo].concat({ id: 3, TenQuyen: 'Dịch vụ Zalo' })
                })
            } else {
            }
        }
    }
    async componentDidMount() {
        await this.getConfig3C();
        await this.getConfigZalo();
        await this._startAnimation(0.4);

    }
    onChangeDate(val, isFrom = true) {

        const { dateTo, dateFrom } = this.state
        if (isFrom) {
            if (dateFrom) {
                let number = moment(val, 'YYYY-MM-DD').diff(moment(dateFrom, 'YYYY-MM-DD'))
                if (number <= 0) {
                    this.setState({ dateTo: val })
                } else {
                    Utils.showToastMsg("Thông báo", "Từ ngày phải nhỏ hơn đến ngày", icon_typeToast.warning);
                }

            } else {
                this.setState({ dateTo: val })
            }

        } else {
            if (dateTo) {
                let number = moment(dateTo, 'YYYY-MM-DD').diff(moment(val, 'YYYY-MM-DD'))
                if (number <= 0) {
                    this.setState({ dateFrom: val })
                } else {
                    Utils.showToastMsg("Thông báo", "Đến ngày phải lớn hơn từ ngày", icon_typeToast.warning);
                }


            } else {
                this.setState({ dateFrom: val })
            }
        }

    }
    render() {
        const { opacity,
            selectNguon,
            selectChuyenMuc,
            selectLinhVuc,
            selectMucDo,
            selectLocTheo,
            selectMucDoKhanCap, dataLocTheo
        } = this.state;
        const { text12 } = stHomeSetting;
        const { nrow } = nstyles.nstyles;
        return (
            <View style={[nstyles.nstyles.ncontainer, { backgroundColor: `transparent`, justifyContent: 'flex-end' }]}>
                <Animated.View style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: 'rgb(17,17,17)', opacity }} />
                <KeyboardAwareScrollView scrollEnabled={false} contentContainerStyle={{ flexGrow: 1 }}>
                    <View style={{ flex: 1, backgroundColor: 'tranparent' }} />
                    <View style={stHomeSetting.container}>
                        <TouchableOpacity
                            onPress={this._goback}
                            style={{ alignSelf: 'flex-start', marginTop: 15 }}>
                            <Image source={Images.icBack} style={[nstyles.nstyles.nIcon20, { tintColor: colors.peacockBlue }]} resizeMode='contain' />
                        </TouchableOpacity>
                        <View style={[nrow, { marginTop: 22 }]}>
                            <View style={{ flex: 1 }}>
                                <Text style={text12}>Từ ngày</Text>
                                <View style={stHomeSetting.btnCalendar}>
                                    <DatePick
                                        style={{ width: "100%" }}
                                        value={this.state.dateTo}
                                        // this.setState({dateTo})
                                        onValueChange={dateTo => this.onChangeDate(dateTo, true)}
                                    />
                                </View>
                            </View>
                            <View style={{ width: 5 }} />
                            <View style={{ flex: 1 }}>
                                <Text style={text12}>Đến ngày</Text>
                                <View style={stHomeSetting.btnCalendar}>
                                    <DatePick
                                        style={{ width: "100%" }}
                                        value={this.state.dateFrom}
                                        onValueChange={dateFrom => this.onChangeDate(dateFrom, false)}
                                    />
                                </View>
                            </View>
                        </View>

                        {/* Lọc theo, mức độ khẩn cấp */}
                        {this.isChuyenDeBiet || [102].includes(selectLocTheo?.id) ? null :
                            <View style={[nrow, { marginTop: 11 }]}>
                                <ModalDrop
                                    value={selectLocTheo}
                                    keyItem={'IdQuyen'}
                                    texttitle={'Lọc theo'}
                                    styleContent={{ marginRight: 5 }}
                                    dropdownTextStyle={{ paddingHorizontal: 5, width: '100%', fontSize: sizes.reText(13) }}
                                    options={dataLocTheo}
                                    onselectItem={(item) => this._selectLocTheo(item, 5)}
                                    Name={"TenQuyen"} />
                                <ModalDrop
                                    value={selectMucDoKhanCap}
                                    keyItem={'IdKhanCap'}
                                    texttitle={'Xử lý khẩn'}
                                    styleContent={{ marginRight: 5 }}
                                    dropdownTextStyle={{ paddingHorizontal: 5, width: '100%', fontSize: sizes.reText(13) }}
                                    options={dataMucDoKC}
                                    onselectItem={(item) => this._selectLocTheo(item, 6)}
                                    Name={"TenKhanCap"} />
                            </View>}

                        {/* nguồn phản ánh, chuyên mục */}
                        <View style={[nrow, { marginTop: 11 }]}>
                            <ModalDrop
                                value={selectNguon}
                                keyItem={'IdNguon'}
                                texttitle={'Nguồn'}
                                styleContent={{ marginRight: 5 }}
                                dropdownTextStyle={{ paddingHorizontal: 5, width: '100%', fontSize: sizes.reText(13) }}
                                options={this.props.dataNguon}
                                onselectItem={(item) => this._selectLocTheo(item, 2)}
                                Name={"TenNguon"} />
                            {
                                ![102].includes(selectLocTheo?.id) &&
                                <ModalDrop
                                    value={selectChuyenMuc}
                                    keyItem={'IdChuyenMuc'}
                                    texttitle={'Chuyên mục'}
                                    styleContent={{ marginRight: 5 }}
                                    dropdownTextStyle={{ paddingHorizontal: 5, width: '100%', fontSize: sizes.reText(13) }}
                                    options={this.props.dataChuyenMuc}
                                    onselectItem={(item) => this._selectLocTheo(item, 1)}
                                    Name={"TenChuyenMuc"} />
                            }

                        </View>

                        {/* Lĩnh vực, mức độa */}
                        {this.isChuyenDeBiet ? null :
                            <View style={[nrow, { marginTop: 11 }]}>
                                {
                                    ![102].includes(selectLocTheo?.id) &&
                                    <ModalDrop
                                        value={selectLinhVuc}
                                        keyItem={'IdLinhVuc'}
                                        texttitle={'Lĩnh vực'}
                                        styleContent={{ marginRight: 5 }}
                                        dropdownTextStyle={{ paddingHorizontal: 5, width: '100%', fontSize: sizes.reText(13) }}
                                        options={this.props.dataLinhVuc}
                                        onselectItem={(item) => this._selectLocTheo(item, 3)}
                                        Name={"LinhVuc"} />
                                }
                                <ModalDrop
                                    value={selectMucDo}
                                    keyItem={'IdMucDo'}
                                    texttitle={'Mức độ'}
                                    styleContent={{ marginRight: 5 }}
                                    dropdownTextStyle={{ paddingHorizontal: 5, width: '100%', fontSize: sizes.reText(13) }}
                                    options={this.props.dataMucDo}
                                    onselectItem={(item) => this._selectLocTheo(item, 4)}
                                    Name={"TenMucDo"} />
                            </View>}
                        <TextInputCom
                            cusViewContainer={{ marginTop: 20 }}
                            iconLeft={Images.icSearchGrey}
                            onChangeText={this._oncahgeText}
                        >{this.textChange}</TextInputCom>
                        {!this.isChuyenDeBiet ?
                            <TouchableOpacity
                                onPress={this._search}
                                style={stHomeSetting.btnSearch}>
                                <Text >Tìm kiếm</Text>
                            </TouchableOpacity> :
                            <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                                <TouchableOpacity
                                    onPress={this._LamMoi}
                                    style={stHomeSetting.btnLamMoi}>
                                    <Text style={{ color: 'white', fontWeight: 'bold' }}>Làm mới</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={this._search}
                                    style={stHomeSetting.btnSearch}>
                                    <Text style={{ color: 'white', fontWeight: 'bold' }}>Tìm kiếm</Text>
                                </TouchableOpacity>
                            </View>}

                    </View>
                </KeyboardAwareScrollView>

            </View >
        );
    }
}


const mapStateToProps = state => ({
    dataNguon: state.GetList_NguonPhanAnh,
    dataChuyenMuc: state.GetList_ChuyenMuc,
    dataMucDo: state.GetList_MucDoAll,
    dataLinhVuc: state.GetList_LinhVuc,
});

export default Utils.connectRedux(HomeSetting, mapStateToProps, false);

const stHomeSetting = StyleSheet.create({
    container: {
        // height: nstyles.Height(60),
        backgroundColor: colors.white,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingHorizontal: nstyles.khoangcach,
        paddingBottom: nstyles.paddingBotX + 20
    },
    text12: {
        fontSize: sizes.reText(12)
    },
    btnCalendar: {
        ...nstyles.nstyles.nrow,
        padding: 10,
        backgroundColor: colors.veryLightPink,
        // alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 5,
        borderRadius: 2
    },
    viewCheckBox: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: -130,
        backgroundColor: 'white',
        top: 55,
        ...nstyles.nstyles.shadow,
        borderRadius: 2
    },
    btnSearch: {
        paddingVertical: sizes.reSize(12),
        paddingHorizontal: sizes.reSize(31),
        backgroundColor: colors.colorGolden,
        borderRadius: sizes.reSize(20),
        alignSelf: 'center',
        marginTop: 30
    },
    btnLamMoi: {
        paddingVertical: sizes.reSize(12),
        paddingHorizontal: sizes.reSize(31),
        backgroundColor: colors.black_30,
        borderRadius: sizes.reSize(20),
        alignSelf: 'center',
        marginTop: 30
    }
})
