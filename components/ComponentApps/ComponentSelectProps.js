import React, { Fragment, Component } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Animated, FlatList, Image, TouchableHighlight } from 'react-native';
import Utils from '../../app/Utils';
import InputRNCom from './InputRNCom';
import { colors } from '../../styles';
import { reText } from '../../styles/size';
import { Height } from '../../styles/styles';
import { ImgComp } from '../ImagesComponent';
import { TextInput } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';

// import HeaderSelect from './HeaderSelect';

class ComponentSelectProps extends Component {
    constructor(props) {
        super(props);
        this.Title = Utils.ngetParam(this, 'title');
        this.callback = Utils.ngetParam(this, 'callback');
        this.item = Utils.ngetParam(this, 'item');
        this.AllThaoTac = Utils.ngetParam(this, 'AllThaoTac');
        this.ViewItem = Utils.ngetParam(this, 'ViewItem', () => { });
        this.Key = Utils.ngetParam(this, 'key', 'Name');
        this.KeyID = Utils.ngetParam(this, 'KeyID', '');
        this.ValueID = Utils.ngetParam(this, 'ValueID', '');
        this.IsSearch = Utils.ngetParam(this, 'Search', false);
        this.state = {
            textempty: 'Không có dữ liệu',
            opacity: new Animated.Value(0),
            data: this.AllThaoTac,
            keySearch: ''
        }
    };
    _select = (item) => () => {
        this.callback(item);
        this._goback();
    }

    _goback = () => {
        Utils.goback(this);
    }
    _renderItem = ({ item, index }) => {
        return <TouchableHighlight underlayColor={colors.black_10} key={index.toString()} onPress={this._select(item)} style={{ flex: 1 }}>
            {
                this.ViewItem(item, this.KeyID, this.ValueID)
            }
        </TouchableHighlight>
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

        let datanew = this.AllThaoTac.filter(item => Utils.removeAccents(item[this.Key]).toUpperCase().includes(Utils.removeAccents(val.toUpperCase())))
        this.setState({ data: datanew })
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
                    borderTopRightRadius: 15,
                    borderTopLeftRadius: 15,
                    paddingBottom: 60
                }}>
                    <View style={{}}>
                        <LinearGradient
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            colors={this.props.theme.colorLinear.color}
                            style={{
                                width: '100%', paddingVertical: 10,
                                borderTopRightRadius: 15,
                                borderTopLeftRadius: 15,
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
                                        source={ImgComp.icBack}
                                        style={{
                                            width: 20, height: 20,
                                            tintColor: colors.white
                                        }} resizeMode='contain' />
                                </TouchableOpacity>
                                <View style={{ minWidth: 200, flex: 1 }}>
                                    <Text style={{
                                        fontWeight: 'bold', fontSize: reText(18), textAlign: 'center',
                                        color: colors.white, marginRight: 40,
                                    }}>{this.Title}</Text>
                                </View>
                            </View>
                            {
                                this.IsSearch == true ?
                                    <TextInput
                                        style={{ padding: 10, backgroundColor: colors.white, marginHorizontal: 10, marginTop: 10, borderRadius: 5 }}
                                        placeholder={'Từ khóa'}
                                        value={this.state.keySearch}
                                        onChangeText={this.onChangeText}
                                    />
                                    : null
                            }
                        </LinearGradient>
                        <FlatList
                            style={{
                                backgroundColor: 'white', borderBottomRightRadius: 15,
                                borderBottomLeftRadius: 15, paddingVertical: 10, height: Height(65)
                            }}
                            numColumns={1}
                            data={this.state.data && this.state.data.length > 0 ? this.state.data : []}
                            renderItem={this._renderItem}
                            ItemSeparatorComponent={() => {
                                return <View style={{ height: 1, backgroundColor: colors.black_10, marginHorizontal: 13 }} />
                            }}
                        />
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
export default Utils.connectRedux(ComponentSelectProps, mapStateToProps, true);