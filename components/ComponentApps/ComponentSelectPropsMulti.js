import React, { Fragment, Component } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Animated, FlatList, Image, TouchableHighlight, TextInput } from 'react-native';
import Utils from '../../app/Utils';
import { Images } from '../../srcAdmin/images';
import { colors } from '../../styles';
import { reText } from '../../styles/size';
import { Height, Width } from '../../styles/styles';
import InputRNCom from './InputRNCom';
import LinearGradient from 'react-native-linear-gradient';
import { ButtonCom } from '..';
// import HeaderSelect from './HeaderSelect';

class ComponentSelectPropsMutli extends Component {
    constructor(props) {
        super(props);
        this.Title = Utils.ngetParam(this, 'title');
        this.callback = Utils.ngetParam(this, 'callback');
        this.item = Utils.ngetParam(this, 'item');
        this.AllThaoTac = Utils.ngetParam(this, 'AllThaoTac');
        this.ViewItem = Utils.ngetParam(this, 'ViewItem', () => { });
        this.Key = Utils.ngetParam(this, 'key', 'Name');
        this.IsSearch = Utils.ngetParam(this, 'Search', false);
        this.KeyID = Utils.ngetParam(this, 'KeyID');
        this.state = {
            textempty: 'Không có dữ liệu',
            opacity: new Animated.Value(0),
            data: this.AllThaoTac,
            datashow: this.AllThaoTac,
            keySearch: '',
        }
    };
    _selected = async () => {
        const { data } = this.state;
        if (this.item.length == 0)
            return null
        let newdata = data.map(item => {
            if (this.item.find(i => i[this.KeyID] == item[this.KeyID])) {
                return { ...item, isCheck: true }
            }
            else {
                return item
            }
        })
        this.setState({ data: newdata, datashow: newdata })
    }
    componentDidMount = () => {
        this._selected();
    }
    _select = () => {
        this.callback(this.state.data.filter(item => item.isCheck == true));
        this._goback();
    }

    _goback = () => {
        Utils.goback(this);
    }
    _selectItem = (item, index) => {
        let newdata = this.state.data.map((i => {
            if (i[this.KeyID] == item[this.KeyID]) {
                return { ...i, isCheck: i.isCheck ? false : true }
            }
            else {
                return { ...i };
            }
        }))
        let newdatashow = this.state.datashow.map((i => {
            if (i[this.KeyID] == item[this.KeyID]) {
                return { ...i, isCheck: i.isCheck ? false : true }
            }
            else {
                return i;
            }
        }))
        this.setState({ data: newdata, datashow: newdatashow })
    }
    _renderItem = ({ item, index }) => {
        return (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableHighlight underlayColor={colors.backgroundModal} key={index.toString()}
                    // onPress={this._select(item)}
                    onPress={() => this._selectItem(item)}
                    style={{ flex: 1 }}>
                    {
                        this.ViewItem(item)
                    }
                </TouchableHighlight>
            </View>)
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
        Utils.nlog("giá trị all thao tác", this.Key)
        // this._startAnimation(0.4)
    }
    onChangeText = (val) => {
        this.setState({ keySearch: val })
        let datanew = this.state.data.filter(item => Utils.removeAccents(item[this.Key]).toUpperCase().includes(Utils.removeAccents(val.toUpperCase())))
        this.setState({ datashow: datanew })
    }
    render() {
        return (
            <View style={{
                flex: 1,
                backgroundColor: 'rgba(0,0,0,0.50)',
                flexDirection: 'column',
                justifyContent: 'center',
                height: '100%'
            }}>
                <View onTouchEnd={() => Utils.goback(this)}
                    style={{
                        position: 'absolute',
                        top: 0, bottom: 0, left: 0, right: 0,
                    }} />
                <View style={{
                    marginTop: 100,
                    marginHorizontal: 10,
                    borderTopRightRadius: 3,
                    borderTopLeftRadius: 3,
                    paddingBottom: 60
                }}>
                    <View style={{}}>
                        <LinearGradient
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            colors={this.props.theme.colorLinear.color}
                            style={{
                                width: '100%', paddingVertical: 10,
                                borderRadius: 3,
                                backgroundColor: 'white',
                            }}
                        >
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <TouchableOpacity
                                    onPress={() => Utils.goback(this)}
                                    style={{
                                        height: 30,
                                        paddingHorizontal: 10,
                                        alignItems: 'center', justifyContent: 'center',
                                    }}>
                                    <Image
                                        source={Images.icBack}
                                        style={{
                                            width: 20, height: 20,

                                        }} resizeMode='contain' />
                                </TouchableOpacity>
                                <View style={{ minWidth: 200, flex: 1 }}>
                                    <Text style={{
                                        fontWeight: 'bold', fontSize: reText(18), textAlign: 'center',
                                        color: colors.white, marginRight: 40
                                    }}>{this.Title}</Text>
                                </View>
                            </View>
                            <View>
                                {
                                    this.IsSearch == true ? <TextInput
                                        style={{ padding: 10, backgroundColor: colors.white, marginHorizontal: 10, marginTop: 10, borderRadius: 5 }}
                                        placeholder={'Từ khóa'}
                                        value={this.state.keySearch}
                                        onChangeText={this.onChangeText}
                                    /> : null
                                }


                            </View>

                        </LinearGradient>
                        <FlatList
                            extraData={this.state}
                            style={{ backgroundColor: 'white', borderRadius: 3, height: Height(65) }}
                            numColumns={1}
                            keyExtractor={(item, index) => index.toString()}
                            data={this.state.datashow && this.state.datashow.length > 0 ? this.state.datashow : []}
                            renderItem={this._renderItem}
                            ItemSeparatorComponent={() => {
                                return (<View style={{ height: 1, width: '100%', backgroundColor: colors.black_16 }}>
                                </View>)
                            }}
                        >
                        </FlatList>
                        <View style={{
                            width: '100%', paddingVertical: 5,
                            borderRadius: 3,
                            backgroundColor: 'white', justifyContent: 'space-around',
                            flexDirection: 'row',
                        }}>
                            <ButtonCom
                                Linear={true}
                                colorChange={[colors.brownGreyTwo, colors.grayLight]}
                                text={"Thoát"}
                                onPress={this._goback}
                                style={{ borderRadius: 5, width: Width(25) }}
                                txtStyle={{ fontSize: reText(14) }}
                            />
                            <ButtonCom
                                Linear={true}
                                colors={this.props.theme.colorLinear.color}
                                text={"Xác nhận"}
                                onPress={this._select}
                                style={{ borderRadius: 5, width: Width(25) }}
                                txtStyle={{ fontSize: reText(14) }}
                            />
                        </View>
                    </View>
                </View>
            </View >
        );
    }
}
const mapStateToProps = state => ({
    auth: state.auth,
    theme: state.theme
});
export default Utils.connectRedux(ComponentSelectPropsMutli, mapStateToProps, true);