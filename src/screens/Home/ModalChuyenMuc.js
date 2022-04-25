import React, { Fragment, Component } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Animated, Image } from 'react-native';
import ListEmpty from '../../../components/ListEmpty';
import Utils from '../../../app/Utils';
import { sizes } from '../../../styles/size';
import { colors } from '../../../styles';
import { nstyles, Height, paddingTopMul } from '../../../styles/styles';
import { Images } from '../../images';


export default class ModalChuyenMuc extends Component {
    constructor(props) {
        super(props);
        this.callback = Utils.ngetParam(this, 'callback');
        this.item = Utils.ngetParam(this, 'item');
        this.AllThaoTac = Utils.ngetParam(this, 'AllThaoTac');
        this.Key = Utils.ngetParam(this, 'Key'); // tên trường dữ liệu cần lấy,
        this.Value = Utils.ngetParam(this, 'Value'); // giá trị trường cần lấy
        this.state = {
            textempty: 'Không có dữ liệu',
            opacity: new Animated.Value(0)
        }
    };

    _select = (item) => () => {
        this.callback(item);
        this._goback();
    }

    _goback = () => {

        Utils.goback(this);
    }

    _renderItem = (item, index) => {
        return (
            <View key={item[`${this.Key}`]} style={{ backgroundColor: this.item[`${this.Key}`] == item[`${this.Key}`] ? colors.greenTab_5 : colors.white }}>
                {/* <TouchableOpacity key={item[`${this.IdSap}`]} onPress={this._select(item)}> */}
                <TouchableOpacity onPress={this._select(item)}>
                    <View style={{ padding: 22, paddingVertical: 20, justifyContent: 'center', alignItems: 'center' }}>
                        <View>
                            <Text allowFontScaling={false} style={{
                                // fontFamily: this.item[`${this.Key}`] == item[`${this.Key}`] ? fonts.HelveticaBold : fonts.Helvetica,
                                fontSize: sizes.sText16, color: this.item[`${this.Key}`] == item[`${this.Key}`] ? colors.black_80 : colors.black_50,
                            }}>
                                {item[`${this.Value}`]}
                            </Text>
                        </View>
                    </View>
                </TouchableOpacity>
                <View style={{ height: 1, backgroundColor: colors.black_10, marginHorizontal: 20 }} />
            </View>

        )
    }

    _startAnimation = (value) => {
        setTimeout(() => {
            Animated.timing(this.state.opacity, {
                toValue: value,
                duration: 250
            }).start();
        }, 250);
    };

    componentDidMount() {
        this._startAnimation(0.4)
    }

    render() {
        const { opacity } = this.state;
        return (
            <View style={[nstyles.ncontainer, { backgroundColor: `transparent`, justifyContent: 'flex-end' }]}>
                <Animated.View onTouchEnd={this._goback} style={{
                    position: 'absolute',
                    top: 0, bottom: 0, left: 0, right: 0, backgroundColor: 'rgb(17,17,17)', opacity
                }} />
                <View style={{
                    borderTopLeftRadius: 20, borderTopRightRadius: 20, zIndex: 1,
                    marginTop: Height(15), borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingTop: 20, backgroundColor: 'white',
                }}>
                    <TouchableOpacity
                        onPress={() => Utils.goback(this)}
                        style={{ padding: 10 }}>
                        <Image source={Images.icBack}
                            style={[nstyles.nIcon20, { tintColor: colors.black_60 }]} resizeMode='contain' />
                    </TouchableOpacity>
                    <ScrollView style={{ borderTopLeftRadius: 20, borderTopRightRadius: 20 }} contentContainerStyle={{ paddingBottom: paddingTopMul(), backgroundColor: colors.white }}>
                        {
                            this.AllThaoTac.length > 0 ? this.AllThaoTac.map(this._renderItem) : <ListEmpty textempty={'Không có dữ liệu'} />
                        }
                    </ScrollView>
                </View>
            </View >
        );
    }
}
