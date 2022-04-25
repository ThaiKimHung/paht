import { keys } from 'lodash';
import React, { Component } from 'react'
import { Platform, Text, View, Alert, BackHandler } from 'react-native'
import { getBottomSpace } from 'react-native-iphone-x-helper';
import { FlatList } from 'react-navigation';
import Utils, { icon_typeToast } from '../../../../app/Utils';
import TextApp from '../../../../components/TextApp';
import { colorsSVL } from '../../../../styles/color';
import { reText } from '../../../../styles/size';
import { Height, nstyles } from '../../../../styles/styles';
import { GetListCVByUserId } from '../../apis/apiSVL';
import ButtonSVL from '../../components/ButtonSVL';
import EmptySVL from '../../components/EmptySVL';
import HeaderSVL from '../../components/HeaderSVL';
import { dataHoSoCV } from '../../dataDemo/dataHoSoCV';
import { ImagesSVL } from '../../images';
import ItemPersonal from '../HoSo/components/ItemPersonal';

export class ChonHoSo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataCV: [],
            itemChoose: '',
            refreshing: true,
        }
        this.dataDetails = Utils.ngetParam(this, 'dataDetails', '')
    }

    componentDidMount() {
        this.onLoad()
    }

    onLoad = async () => {
        this.setState({ refreshing: true })
        let keys = 'IsPublic'
        let vals = 1
        let res = await GetListCVByUserId(keys, vals)
        Utils.nlog('res', res)
        if (res.status == 1 && res.data) {
            let temp = res.data.map((item, index) => {
                return { ...item, isChoose: false, isSave: false }
            })
            this.setState({
                dataCV: temp,
                refreshing: false
            })
        }
        else {
            this.setState({
                dataCV: [],
                refreshing: false
            })
        }
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.onBack)

    }

    onChooseItem = (item) => {
        let { dataCV } = this.state
        let arrNew = dataCV.map(e => {
            if (e.IdCV == item.IdCV)
                return { ...e, isChoose: true }
            else
                return { ...e, isChoose: false }
        })
        this.setState({
            dataCV: arrNew,
            itemChoose: arrNew.find(e => e.isChoose == true)
        })
    }

    _renderItem = ({ item, index }) => {
        return <ItemPersonal
            item={item}
            index={index}
            isChoose={true}
            onChoose={(item) => {
                this.onChooseItem(item)
            }}
        />
    }

    onBack = () => {
        Utils.goback(this)
    }

    onSubmit = () => {
        let { itemChoose, dataCV } = this.state
        // check object rỗng
        if (Object.keys(itemChoose).length === 0 && itemChoose.constructor === Object) {
            Utils.showToastMsg('Thông báo', 'Bạn chưa chọn CV !', icon_typeToast.warning, 2000)
        } else {
            Utils.navigate('Modal_ConfirmDel', { dataDetails: this.dataDetails, item: itemChoose, title: 'Bạn có chắc sử dụng CV này để nộp hồ sơ xin việc hay không?' })
        }
    }

    renderButton = () => {
        return <View style={{ marginTop: Platform.OS == 'android' ? 0 : 10 }}>
            <ButtonSVL
                onPress={this.onSubmit}
                style={{ backgroundColor: colorsSVL.blueMainSVL, height: 40, marginHorizontal: 30, borderRadius: 25 }} colorText='white' text='Gửi CV'
            />
        </View>
    }

    render() {
        let { dataCV, itemChoose } = this.state
        return (
            <View style={{ flex: 1, backgroundColor: colorsSVL.grayBgrInput }}>
                <HeaderSVL
                    title={"Chọn CV "}
                    styleTitle={{ color: 'black', fontSize: reText(18) }}
                    iconLeft={ImagesSVL.icBackSVL}
                    onPressLeft={this.onBack}
                />
                <View style={{ height: Height(1) }} />
                <View style={{ flex: 1, }}>
                    <FlatList
                        keyExtractor={(item, index) => index.toString()}
                        showsVerticalScrollIndicator={false}
                        renderItem={this._renderItem}
                        data={dataCV}
                        // ListFooterComponent={this.renderButton}
                        refreshing={this.state.refreshing}
                        onRefresh={this.onLoad}
                        ListEmptyComponent={<EmptySVL style={{ flex: 1, marginTop: 20 }} textEmpty={this.state.refreshing ? 'Đang tải...' : 'Bạn chưa có CV nào. Hãy tạo CV ngay!!!'} />}
                    />
                </View>
                <View style={{ paddingVertical: 10, backgroundColor: 'white', paddingBottom: getBottomSpace() }}>
                    <ButtonSVL
                        disabled={itemChoose?.IdCV ? false : true}
                        onPress={this.onSubmit}
                        style={{
                            backgroundColor: itemChoose?.IdCV ? colorsSVL.blueMainSVL : colorsSVL.grayLine,
                            marginHorizontal: 13,
                            borderRadius: 25
                        }}
                        colorText='white'
                        text='Gửi CV'
                    />
                </View>
            </View>
        )
    }
}

export default ChonHoSo
