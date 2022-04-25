import React, { Fragment, Component } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Animated, FlatList, Image, TouchableHighlight, Platform, KeyboardAvoidingView } from 'react-native';
import Utils from '../../app/Utils';
import InputRNCom from './InputRNCom';
import { colors } from '../../styles';
import { reText } from '../../styles/size';
import { Height } from '../../styles/styles';
import { ImgComp } from '../ImagesComponent';
import { TextInput } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';

// import HeaderSelect from './HeaderSelect';

class ComponentSelectBottom extends Component {
    constructor(props) {
        super(props);
        this.Title = Utils.ngetParam(this, 'title');
        this.callback = Utils.ngetParam(this, 'callback');
        this.item = Utils.ngetParam(this, 'item');
        this.AllThaoTac = Utils.ngetParam(this, 'AllThaoTac');
        this.ViewItem = Utils.ngetParam(this, 'ViewItem', () => { });
        this.Key = Utils.ngetParam(this, 'key', 'Name');
        this.IsSearch = Utils.ngetParam(this, 'Search', false);
        this.isWhiteHeader = Utils.ngetParam(this, 'isWhiteHeader', false)
        this.state = {
            textempty: 'Không có dữ liệu',
            opacity: new Animated.Value(0),
            data: this.AllThaoTac,
            keySearch: ''
        }
    };
    _select = (item) => () => {
        setTimeout(() => {
            Animated.timing(this.state.opacity, {
                toValue: 0,
                duration: 150
            }).start(() => {
                this.callback(item);
                this._goback();
            });
        }, 100);
    }

    _goback = () => {
        Utils.goback(this);
    }
    _renderItem = ({ item, index }) => {
        return <TouchableHighlight underlayColor={colors.backgroundModal} key={index.toString()} onPress={this._select(item)} style={{ flex: 1 }}>
            {
                this.ViewItem(item, this.item)
            }
        </TouchableHighlight>
    }
    _startAnimation = (value) => {
        setTimeout(() => {
            Animated.timing(this.state.opacity, {
                toValue: value,
                duration: 200
            }).start();
        }, 300);
    };

    componentDidMount() {
        Utils.nlog("giá trị all thao tác", this.Key)
        this._startAnimation(0.4)
    }
    onChangeText = (val) => {
        this.setState({ keySearch: val })
        let datanew = this.AllThaoTac.filter(item => Utils.removeAccents(item[this.Key]).toUpperCase().includes(Utils.removeAccents(val.toUpperCase())))
        this.setState({ data: datanew })
    }
    goback = () => {
        Animated.spring(this.state.opacity, {
            toValue: 0,
            duration: 1
        }).start();
        setTimeout(() => {
            Utils.goback(this)
        }, 100)
    }
    render() {
        const { opacity } = this.state
        return (
            <View style={{
                flex: 1,
                flexDirection: 'column',
                height: '100%',
                justifyContent: 'flex-end'
            }}>
                <Animated.View onTouchEnd={this.goback}
                    style={{
                        position: 'absolute',
                        top: 0, bottom: 0, left: 0, right: 0,
                        opacity, backgroundColor: 'rgba(0,0,0,0.50)',
                    }} />
                <View style={{
                    // marginHorizontal: 10,
                    borderTopRightRadius: 20,
                    borderTopLeftRadius: 20,
                    maxHeight: Height(90),
                    minHeight: Height(50)
                }}>
                    <KeyboardAvoidingView
                        behavior={Platform.OS === "ios" ? "padding" : "height"}
                        keyboardVerticalOffset={50}

                    >
                        <LinearGradient
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            colors={this.isWhiteHeader ? [colors.white, colors.white] : this.props.theme.colorLinear.color}
                            style={{
                                width: '100%', paddingVertical: 10,
                                borderTopRightRadius: 20,
                                borderTopLeftRadius: 20,
                                backgroundColor: 'white',
                            }}
                        >
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <TouchableOpacity
                                    onPress={this.goback}
                                    style={{
                                        height: 30,
                                        paddingHorizontal: 10,
                                        alignItems: 'center', justifyContent: 'center',
                                    }}>
                                    <Image
                                        source={ImgComp.icBack}
                                        style={{
                                            width: 20, height: 20,
                                            tintColor: this.isWhiteHeader ? colors.black_50 : colors.white
                                        }} resizeMode='contain' />
                                </TouchableOpacity>
                                <View style={{ minWidth: 200, flex: 1 }}>
                                    <Text style={{
                                        fontWeight: 'bold', fontSize: reText(18), textAlign: 'center',
                                        color: this.isWhiteHeader ? colors.black_50 : colors.white, marginRight: 40,
                                    }}>{this.Title}</Text>
                                </View>
                            </View>
                            {
                                this.IsSearch == true ?
                                    <TextInput
                                        style={{ padding: 10, backgroundColor: this.isWhiteHeader ? colors.black_10 : colors.white, marginHorizontal: 10, marginTop: 10, borderRadius: 5 }}
                                        placeholder={'Từ khóa'}
                                        value={this.state.keySearch}
                                        onChangeText={this.onChangeText}
                                    />
                                    : null
                            }
                        </LinearGradient>
                        <FlatList
                            contentContainerStyle={{ paddingBottom: 100 }}
                            style={{
                                backgroundColor: 'white', borderRadius: 3,
                                paddingVertical: 10, minHeight: Height(65), maxHeight: Height(85)
                            }}
                            numColumns={1}
                            data={this.state.data && this.state.data.length > 0 ? this.state.data : []}
                            renderItem={this._renderItem}
                            ItemSeparatorComponent={() => {
                                return <View style={{ height: 1, width: '100%', backgroundColor: colors.black_16 }} />
                            }}
                            keyExtractor={(item, index) => `index_${index}`}
                        />

                    </KeyboardAvoidingView>
                </View>
            </View >
        );
    }
}

const mapStateToProps = state => ({
    auth: state.auth,
    theme: state.theme
});
export default Utils.connectRedux(ComponentSelectBottom, mapStateToProps, true);
