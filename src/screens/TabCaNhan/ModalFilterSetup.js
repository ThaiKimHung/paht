import React, { Component, useRef } from 'react'
import { Text, View, TouchableOpacity, Image } from 'react-native'
import { colors, nstyles } from '../../../styles'
import Utils from '../../../app/Utils'
import { reText } from '../../../styles/size'
import HeaderCus from '../../../components/HeaderCus'
import { Images } from '../../images'
import LinearGradient from 'react-native-linear-gradient'
import InputRNCom from '../../../components/ComponentApps/InputRNCom'
import DatePicker from 'react-native-datepicker';
import { nGlobalKeys } from '../../../app/keys/globalKey'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import moment from 'moment';
import { ButtonCom } from '../../../components'
const ComponentNgay = (props) => {
    const ref = useRef()
    const onPress = () => {
        ref.current.onPressDate();
    }
    return (<TouchableOpacity onPress={onPress} style={{ marginTop: 10 }}>
        <View pointerEvents='none'>
            <InputRNCom
                styleContainer={{ paddingHorizontal: 10 }}
                styleBodyInput={{
                    borderColor: colors.greyLight, borderRadius: 5,
                    minHeight: 45, alignItems: 'center'
                }}
                labelText={props.labelText}
                styleLabel={{ fontSize: reText(15) }}
                sufix={
                    <View style={{}}>
                        <View style={{ paddingHorizontal: 10 }}>
                            <Image source={Images.icCalendarPicker} resizeMode={'contain'}
                                style={{ ...nstyles.nstyles.nIcon20, tintColor: colors.black_50 }} />
                        </View>
                        <DatePicker
                            style={{ borderWidth: 0, height: 0, width: 0 }}
                            date={props.value}
                            mode="date"
                            disabled={false}
                            placeholder={props.placeholder}
                            format="DD/MM/YYYY"
                            confirmBtnText="Xác nhận"
                            cancelBtnText="Thoát"
                            showIcon={false}
                            hideText={true}
                            androidMode='spinner'
                            locale='vi'
                            ref={ref}
                            customStyles={{
                                datePicker: {
                                    backgroundColor: '#d1d3d8',
                                    justifyContent: 'center',
                                },
                                dateInput: {
                                    paddingHorizontal: 5,
                                    borderWidth: 0,
                                    alignItems: 'flex-start',

                                }

                            }}
                            onDateChange={props.onChangTextIndex}
                        />
                    </View>

                }
                sufixlabel={<View>
                    <Text style={{ fontSize: 18, color: colors.redStar }}>{props.isReq ? '*' : ''}</Text>
                </View>}
                placeholder={props.placeholder}
                styleInput={{}}
                styleError={{ backgroundColor: 'white', }}
                styleHelp={{ backgroundColor: 'white', }}
                placeholderTextColor={colors.black_16}
                valid={true}
                value={props.value}
                onChangeText={props.onChangTextIndex}

            />
        </View>
    </TouchableOpacity>)
}

const ComponentDrop = (props) => {

    return (<TouchableOpacity onPress={props.onPress} style={{ marginTop: 10 }}>
        <View pointerEvents='none'>
            <InputRNCom
                styleContainer={{ paddingHorizontal: 10 }}
                styleBodyInput={{
                    borderColor: colors.greyLight, borderRadius: 5,
                    minHeight: 45, alignItems: 'center'
                }}

                labelText={props.labelText}
                styleLabel={{ fontSize: reText(15) }}
                sufix={
                    <View style={{ paddingHorizontal: 10 }}>
                        <Image source={Images.icButChi} resizeMode={'contain'}
                            style={{ ...nstyles.nstyles.nIcon20, tintColor: colors.black_50 }} />
                    </View>

                }
                sufixlabel={<View>
                    <Text style={{ fontSize: 18, color: colors.redStar }}>{props.isReq ? '*' : ''}</Text>
                </View>}
                placeholder={props.placeholder}
                styleInput={{}}
                styleError={{ backgroundColor: 'white', }}
                styleHelp={{ backgroundColor: 'white', }}
                placeholderTextColor={colors.black_16}
                errorText={'Ngày sinh  không hợp lệ'}
                valid={true}

                value={props.value}
                onChangeText={props.onChangTextIndex}

            />
        </View>
    </TouchableOpacity >)
}
export class ModalFilterSetup extends Component {
    constructor(props) {
        super(props)
        this.IdSource = Utils.getGlobal(nGlobalKeys.IdSource, '');
        this.objectFilter = Utils.ngetParam(this, "objectFilter");
        this.callback = Utils.ngetParam(this, "callback", () => { });

        this.state = {
            dataFilter: this.IdSource == 'CA' ? [{
                key: '',
                value: '',
                title: 'Tất cả',
                icon: Images.icTieuBieu
            }, {
                key: 'MucDo',
                value: '3',
                title: 'Khẩn cấp',
                icon: Images.icTieuBieu
            },
            {
                key: 'MucDo', // Cũ là TrangThai
                value: '1,2', // Cũ là 6
                title: 'Khác',
                icon: Images.icMenuKhac
            }] : [{
                key: '',
                value: '',
                title: 'Tất cả',
                icon: Images.icTieuBieu
            },
            {
                key: 'MucDo',
                value: '3',
                title: 'Khẩn',
                icon: Images.icTieuBieu
            },
            {
                key: 'TrangThai',
                value: '6',
                title: 'Đã xử lý',
                icon: Images.icCheckBlack
            }],
            key: this.IdSource == 'CA' ? 'LinhVuc' : 'TenChuyenMuc',
            tungay: this.objectFilter.tungay || '',
            denngay: this.objectFilter.denngay || '',
            linhvuc: this.objectFilter.linhvuc || '',
            chuyenmuc: this.objectFilter.chuyenmuc || '',
            filterItem: this.objectFilter.filterItem || {
                key: '',
                value: '',
                title: 'Tất cả',
                icon: Images.icTieuBieu
            }

        }
    }
    componentDidMount() {

    }
    onSetLinhVuc = (val) => {

        if (this.IdSource == 'CA') {
            this.setState({ linhvuc: val })

        } else {
            this.setState({ chuyenmuc: val })
        }
    }
    _viewItem = (item, key) => {
        return (
            <View key={item[key]} style={{
                flex: 1,
                paddingVertical: 15,
                borderWidth: 0,
                borderBottomWidth: 0.5,
                borderBottomColor: colors.greyLight,
            }}>
                <Text style={{ textAlign: 'center', color: colors.black_60 }} >{item[key]}</Text>
            </View>
        )
    }
    onPressLinhVuc = () => {
        Utils.goscreen(this, 'Modal_ComponentSelectPropsFilter', {
            callback: (val) => this.onSetLinhVuc(val),
            item: this.state.linhvuc,
            AllThaoTac: this.props.CaNhanReducer.listlinhvuc, ViewItem: item => this._viewItem(item, this.IdSource == 'CA' ? 'LinhVuc' : 'TenChuyenMuc'),
            title: 'Danh sách lĩnh vực',
        })
    }
    renderFilter = (item, index) => {
        const { filterItem, key } = this.state
        return (
            <TouchableOpacity key={index} onPress={() => this.setState({ filterItem: item })}
                style={{
                    justifyContent: 'center',
                    flex: 1,
                }}
            >
                <LinearGradient
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    colors={filterItem.key == item.key && filterItem.value == item.value ? this.props.theme.colorLinear.color : [colors.greyLight, colors.greyLight]}
                    style={{
                        backgroundColor: filterItem.key == item.key && filterItem.value == item.value ? colors.colorTextSelect : colors.greyLight, justifyContent: 'center',
                        flex: 1, borderWidth: 1, borderColor: colors.white, borderRadius: 5
                    }}
                >
                    <Text style={{ fontSize: reText(12), textAlign: 'center', fontWeight: 'bold', color: filterItem.key == item.key && filterItem.value == item.value ? colors.white : colors.black_80 }}>{item.title}</Text>
                </LinearGradient>
            </TouchableOpacity>
        )
    }
    callbackRef = () => {
        const { dataFilter,
            tungay = '',
            denngay = '',
            linhvuc = '',
            chuyenmuc = '',
            filterItem, key } = this.state
        this.callback({
            tungay,
            denngay,
            linhvuc,
            chuyenmuc,
            filterItem,
        })
        Utils.goback(this);
    }
    setNgay = (val, isTungay) => {
        const { tungay, denngay } = this.state
        if (isTungay) {
            if (denngay != '') {
                let number = moment(denngay, 'DD/MM/YYYY').diff(moment(val, 'DD/MM/YYYY'), 'days');

                if (number < 0) {
                    Utils.showMsgBoxOK(this, 'Thông báo', "Từ ngày phải nhỏ hơn đến ngày", 'Xem lại')

                }
                this.setState({ tungay: val })
            } else {

                this.setState({ tungay: val })
            }

        } else {
            if (tungay != '') {
                let number = moment(tungay, 'DD/MM/YYYY').diff(moment(val, 'DD/MM/YYYY'), 'days');
                if (number > 0) {
                    Utils.showMsgBoxOK(this, 'Thông báo', "Đến ngày phải lớn hơn từ ngày", 'Xem lại')
                }
                this.setState({ denngay: val })
            } else {

                this.setState({ denngay: val })
            }

        }

    }

    ResetFilter = () => {
        this.callback({
            tungay: '',
            denngay: '',
            linhvuc: '',
            chuyenmuc: '',
            filterItem: {
                key: '',
                value: '',
                title: 'Tất cả',
                icon: Images.icTieuBieu
            }
        })
        Utils.goback(this);
    }

    render() {
        const { dataFilter,
            tungay = '',
            denngay = '',
            linhvuc = '',
            chuyenmuc = '',
            filterItem, key } = this.state
        return (
            <View style={{ flex: 1, }}>
                <View
                    onTouchEnd={() => Utils.goback(this)}
                    style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, }}>

                </View>
                <View style={{
                    flex: 1, flexDirection: 'row',
                    shadowColor: "#000",
                    shadowOffset: {
                        width: 0,
                        height: 0,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
                }}>

                    <View onTouchEnd={() => Utils.goback(this)}
                        style={{ width: 60, }}>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => {
                                Utils.goscreen(this, "Modal_FilterSetup")

                            }} style={{
                                position: 'absolute', top: 200,
                                left: 0, backgroundColor: colors.white,
                                zIndex: 100, height: 50,
                                borderTopLeftRadius: 30,
                                borderBottomLeftRadius: 30,
                                width: 60, justifyContent: 'center', alignItems: 'center'
                            }}>
                            <Image source={Images.icCloseBlack} resizeMode={'contain'}
                                style={{ ...nstyles.nstyles.nIcon20, tintColor: this.props.theme.colorLinear.color[0] }} />
                        </TouchableOpacity>
                    </View>
                    <View style={{
                        flex: 1, backgroundColor: colors.white,

                    }}>

                        <LinearGradient
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            colors={[colors.white, colors.white]}
                            style={[nstyles.nstyles.shadown, {
                                paddingTop: nstyles.paddingTopMul(),
                                paddingHorizontal: 10,
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                width: '100%',
                                height: nstyles.heightHed(),
                            }]}>
                            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', borderWidth: 0, borderBottomWidth: 1, borderColor: colors.greyLight }}>
                                <View style={{ flex: 1, justifyContent: 'center', }}>
                                    <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: reText(15) }}>{"Bộ lọc dữ liệu"}</Text>
                                </View>
                                <TouchableOpacity onPress={this.ResetFilter} style={{ padding: 10, }}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: reText(12), color: this.props.theme.colorLinear.color[0] }}>{"Làm mới"}</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </LinearGradient>
                        <View style={{ justifyContent: 'center', flexDirection: 'row', alignItems: 'center', paddingVertical: 5 }}>
                            <Image source={Images.userFilter} resizeMode={'contain'}
                                style={{ ...nstyles.nstyles.nIcon40, tintColor: this.props.theme.colorLinear.color[0] }} />
                            <Text style={{
                                textAlign: 'center', fontWeight: 'bold', marginLeft: 10,
                                color: this.props.theme.colorLinear.color[0],
                                fontSize: reText(12)
                            }}>{`"Bộ lọc giúp bạn tìm kiếm nhanh hơn"`}</Text>
                        </View>
                        <KeyboardAwareScrollView>
                            <ComponentNgay labelText={'Từ ngày'} placeholder={'Chọn từ ngày'} value={tungay} onChangTextIndex={(val) => this.setNgay(val, true)} />
                            <ComponentNgay labelText={'Đến ngày'} placeholder={'Chọn đến ngày'} value={denngay} onChangTextIndex={(val) => this.setNgay(val, false)} />
                            {
                                this.IdSource == 'CA' ? <ComponentDrop labelText={'Lĩnh vực'} value={linhvuc[key]} placeholder={'Chọn lĩnh vưc'} onPress={this.onPressLinhVuc} /> :
                                    <ComponentDrop labelText={'Chuyên mục'} placeholder={'Chọn chuyên mục'} value={chuyenmuc[key]} onPress={this.onPressLinhVuc} />
                            }

                            <View style={{ paddingHorizontal: 10, paddingTop: 15 }}>
                                <Text style={{ fontSize: reText(15) }}>{'Tuỳ chỉnh :'}</Text>
                                <View style={{ flexDirection: 'row', minHeight: 40, marginTop: 5 }}>
                                    {dataFilter.map(this.renderFilter)}
                                </View>
                            </View>

                        </KeyboardAwareScrollView>
                        <View style={{
                            marginBottom: nstyles.paddingBotX, padding: 10, backgroundColor: colors.white,
                            borderWidth: 0, borderTopWidth: 1, borderColor: colors.greyLight,
                        }}>
                            <ButtonCom
                                onPress={this.callbackRef}
                                text={'Lấy dữ liệu theo bộ lọc'}
                                style={{ borderRadius: 5 }}
                            />
                        </View>

                    </View>

                </View>
            </View >
        )
    }
}
const mapStateToProps = state => ({
    CaNhanReducer: state.CaNhanReducer,
    theme: state.theme
});

export default Utils.connectRedux(ModalFilterSetup, mapStateToProps, true)
