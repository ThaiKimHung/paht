import React, { Component } from 'react'
import { Text, View, FlatList, ActivityIndicator, TouchableOpacity, Image, StyleSheet } from 'react-native'
import { nstyles, colors, sizes } from '../../../../styles'
import { HeaderCom, TextInputCom, ListEmpty, DatePick, IsLoading } from '../../../../components'
import { Images } from '../../../images'
import apis from '../../../apis'
import { UrlTile } from 'react-native-maps'
import Utils from '../../../../app/Utils'
import ButtonCus from '../../../../components/ComponentApps/ButtonCus'
import { Width, Height } from '../../../../styles/styles'
import moment from 'moment'

export class Filtertracking extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataALl: [],
            dataView: [],
            dataSelect: [],
            countChon: 0,
            tab: true,
            textTK: '',
            dateTo: moment(new Date()),
            dateFrom: moment(new Date()),
        }
    }
    componentDidMount() {
        this._getListFilter();
    }
    _getListFilter = async () => {
        nthisIsLoading.show();
        const { dataSelect } = this.state
        const res = await apis.ApiTracking.GetAllDSBN(this.state.textTK);
        Utils.nlog("gia tri item tim kiếm năng cao", res);
        if (res.status == 1) {
            if (res.data) {

                var data = await res.data.map((item) => {
                    var kt = dataSelect.find(item2 => item.Id == item2.Id);
                    Utils.nlog("hia tri kq", kt)
                    return { ...item, isCheck: kt == undefined ? false : true }
                })
                nthisIsLoading.hide();
                this.setState({ dataALl: data, });
            } else {
                nthisIsLoading.hide();
                this.setState({ dataALl: [] });
            }
        } else {
            nthisIsLoading.hide();
            Utils.showMsgBoxOK(this, "Thông báo", res.error ? res.error.message : "Lấy dữ liệu thất bại", "Xác nhận");
        }
    }
    _ListFooterComponent = () => {
        if (this.state.page < this.pageAll)
            return <ActivityIndicator size='small' style={{ marginTop: 10 }} />;
        else return null
    }
    _onClickDVXL = (item, index) => {
        Utils.nlog("vao i check")
        var { dataALl, dataSelect, dataView, countChon } = this.state;
        if (dataSelect.length < 5) {
            dataALl[index].isCheck = !dataALl[index].isCheck
            dataSelect.push({ ...item, isCheck: true });
            this.setState({ dataSelect, dataALl });
        } else {
            Utils.showMsgBoxOK(this, "Thông báo", "Chỉ được chọn tối da 5 người", "Xác nhận")
        }
    }
    _onClickDVXL2 = (item, index) => {
        Utils.nlog("vao i check2")
        var { dataSelect } = this.state;
        dataSelect.splice(index, 1);
        this.setState({ dataSelect }, this._getListFilter);

    }
    _renderItem = (item, index, key) => {
        // Utils.nlog("gia tri item", item)
        if (item.isCheck == key) {
            return (
                <TouchableOpacity
                    onPress={() => this._onClickDVXL(item, index)}
                    key={item.Id}
                    style={{
                        flexDirection: 'row', justifyContent: 'space-between',
                        backgroundColor: colors.colorGrayBgr, borderWidth: 1, borderRadius: 5,
                        paddingVertical: 10, paddingHorizontal: 20, marginBottom: 3, borderColor: colors.black_50
                    }}>
                    <Text style={{ fontSize: sizes.sizes.sText14 }}>{item.HoTen}</Text>
                    <Image
                        source={item.isCheck ? Images.icCheck : Images.icUnCheck}
                        style={[nstyles.nstyles.nIcon14, { tintColor: colors.peacockBlue }]}
                    />
                </TouchableOpacity>
            )
        } else {
            return null;
        }
    };
    _renderItem2 = (item, index, key) => {
        // Utils.nlog("gia tri item", item)
        if (item.isCheck == key) {
            return (
                <View key={item.Id} style={{ flexDirection: 'row' }}>
                    <TouchableOpacity

                        onPress={() => Utils.goscreen(this, "sc_chiTietTracking", {
                            id: item.Id
                        })}
                        style={{
                            justifyContent: 'center', flex: 1, flexDirection: 'row',
                            backgroundColor: colors.colorGrayBgr, borderWidth: 1, borderRadius: 5,
                            paddingVertical: 10, paddingHorizontal: 20, alignItems: 'center'
                        }}>
                        <Text style={{ fontSize: sizes.sizes.sText14, flex: 1 }}>{item.HoTen}</Text>
                        <Image
                            source={Images.icShowPass}
                            style={[{ tintColor: colors.peacockBlue }]}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => this._onClickDVXL2(item, index)}
                        style={{
                            justifyContent: 'space-between',
                            backgroundColor: colors.colorGrayBgr, borderWidth: 1, borderRadius: 5,

                            paddingVertical: 10, paddingHorizontal: 20
                        }}>
                        <Image
                            source={item.isCheck ? Images.icCheck : Images.icUnCheck}
                            style={[nstyles.nstyles.nIcon14, { tintColor: colors.peacockBlue }]}
                        />
                    </TouchableOpacity>

                </View>

            )
        } else {
            return null;
        }
    };
    _keyExtrac = (item, index) => index.toString();
    _onRefresh = () => {
        this.setState({ refreshing: true, textempty: 'Đang tải...' }, this._getListNoCheck)
    }
    _ListHeaderComponent = () => {
        return (
            <View>

            </View>)
    }
    _oncChangeText = (text) => {
        this.setState({ textTK: text }, this._getListFilter);
    }
    _goscreenXemNhom = () => {
        const { dataSelect, dateFrom, dateTo } = this.state
        let data = ''
        for (let index = 0; index < dataSelect.length; index++) {
            const element = dataSelect[index];
            data = data ? data + "," + element.Id : element.Id
        }
        Utils.goscreen(this, "sc_MapPolyline", {
            data: data,
            dateFrom,
            dateTo
        }
        )
    }
    _ListFooterComponent = () => {
        const { nrow } = nstyles.nstyles
        return (
            <View>
                <View style={[nrow, { marginTop: 22, flex: 1 }]}>
                    <View style={{ flex: 1 }}>
                        <Text style={stHomeSetting.text12}>Từ ngày</Text>
                        <View style={stHomeSetting.btnCalendar}>
                            <DatePick
                                style={{ width: "100%" }}
                                value={this.state.dateFrom}
                                onValueChange={dateFrom => this.setState({ dateFrom })}
                            />
                        </View>
                    </View>
                    <View style={{ width: 10 }} />
                    <View style={{ flex: 1 }}>
                        <Text style={stHomeSetting.text12}>Đến ngày</Text>
                        <View style={stHomeSetting.btnCalendar}>
                            <DatePick
                                style={{ width: "100%" }}
                                value={this.state.dateTo}
                                onValueChange={dateTo => this.setState({ dateTo })}
                            />
                        </View>
                    </View>
                </View>
                <View>
                    <ButtonCus
                        onPressB={this._goscreenXemNhom}
                        stContainerR={{
                            width: Width(30), paddingVertical: 12,
                            marginVertical: 30,
                            alignSelf: 'center', justifyContent: 'flex-start'
                        }}
                        textTitle={`Xem vị trí`}
                    />
                </View>
            </View>)
    }
    render() {
        const { tab, textTK } = this.state
        const { nrow } = nstyles.nstyles
        return (
            <View style={nstyles.nstyles.ncontainer}>
                <HeaderCom
                    titleText='Tra cứu chi tiết'
                    iconLeft={Images.icBack}
                    nthis={this}
                    onPressLeft={() => Utils.goback(this)}
                    hiddenIconRight={true}
                />
                <View style={{
                    paddingHorizontal: 10, width: '100%',
                    flexDirection: 'row'
                }}>
                    {/* <TouchableOpacity
                        onPress={() => this.setState({ tab: true })}
                        style={{
                            flex: 1, flexDirection: 'column',
                            alignItems: 'center', justifyContent: 'center'
                        }}>
                        <Text style={{ paddingVertical: 10 }}>Tìm kiếm</Text>
                        <View style={{ height: 2, width: '100%', backgroundColor: tab == true ? colors.peacockBlue : colors.grayLight, }}></View>
                    </TouchableOpacity>
                    <View style={{ width: 10 }}></View>
                    <TouchableOpacity
                        onPress={() => this.setState({ tab: false })}
                        style={{
                            flex: 1, flexDirection: 'column',
                            alignItems: 'center', justifyContent: 'center'
                        }}>
                        <Text style={{ paddingVertical: 10 }}>Thông tin người nhiễm/cách ly</Text>
                        <View style={{ height: 2, width: '100%', backgroundColor: tab == false ? colors.peacockBlue : colors.grayLight, }}></View>
                    </TouchableOpacity> */}

                </View>


                <View style={{ flex: 1, }}>
                    <TextInputCom
                        cusViewContainer={{ justifyContent: 'center', alignItems: 'center', marginTop: 10, marginHorizontal: 5, }}
                        iconRight={Images.icSearchGrey}
                        placeholder={'Tìm kiếm'}
                        value={textTK}
                        onChangeText={this._oncChangeText}
                    />
                    <FlatList
                        style={{ flex: 1, marginTop: 10, marginHorizontal: 10, }}
                        // scrollEventThrottle={10}
                        onScroll={this.handleScroll}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item, index }) => this._renderItem(item, index, false)}
                        data={this.state.dataALl}
                        ListEmptyComponent={<ListEmpty textempty={this.state.textempty} />}
                        keyExtractor={this._keyExtrac}
                        // refreshing={this.state.refreshing}
                        // onRefresh={this._onRefresh}
                        // onEndReached={this.loadMore}
                        onEndReachedThreshold={0.3}
                    // ListFooterComponent={this._ListFooterComponent}
                    />
                </View>
                <View style={{ flex: 1, marginHorizontal: 10, borderWidth: 1, borderRadius: 4 }}>
                    <Text style={{ textAlign: 'center', paddingVertical: 10 }}>{'Danh sách đã chọn'}</Text>
                    <FlatList
                        style={{ flex: 1, marginTop: 10, marginHorizontal: 10, }}
                        // scrollEventThrottle={10}
                        onScroll={this.handleScroll}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item, index }) => this._renderItem2(item, index, true)}
                        data={this.state.dataSelect}
                        ListEmptyComponent={<ListEmpty textempty={this.state.textempty} />}
                        keyExtractor={this._keyExtrac}
                        // refreshing={this.state.refreshing}
                        // onRefresh={this._onRefresh}
                        // onEndReached={this.loadMore}
                        onEndReachedThreshold={0.3}
                        ListFooterComponent={this._ListFooterComponent}
                    />

                </View>
                <IsLoading />
            </View>
        )
    }
}
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
        fontSize: sizes.reText(12), paddingHorizontal: 10,
    },
    btnCalendar: {
        ...nstyles.nstyles.nrow,
        padding: 10,
        backgroundColor: colors.veryLightPink,
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 5,
        borderRadius: 2
    }
})
export default Filtertracking
