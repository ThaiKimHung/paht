import React, { Fragment, Component } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Animated, FlatList, Image, TouchableHighlight } from 'react-native';
import InputRNCom from './InputRNCom';
import { colors, nstyles } from '../../styles';
import { reText } from '../../styles/size';

import { ImgComp } from '../ImagesComponent';
import Utils from '../../app/Utils';
import { Height } from '../../styles/styles';
// import HeaderSelect from './HeaderSelect';

class ConponentSelectPropsRight extends Component {
    constructor(props) {
        super(props);
        this.Title = Utils.ngetParam(this, 'title');
        this.callback = Utils.ngetParam(this, 'callback');
        this.item = Utils.ngetParam(this, 'item');
        this.AllThaoTac = Utils.ngetParam(this, 'AllThaoTac');
        this.ViewItem = Utils.ngetParam(this, 'ViewItem', () => { });
        this.Key = Utils.ngetParam(this, 'key', 'Name');
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
    _renderItem = (item, index) => {
        return <TouchableHighlight underlayColor={colors.backgroundModal} key={index.toString()} onPress={this._select(item)} style={{ flex: 1 }}>
            {
                this.ViewItem(item)
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
    _goback = () => {
        Utils.goback(this);
    }
    render() {
        return (
            <View style={{
                flex: 1,
                // backgroundColor: 'rgba(0,0,0,0.50)',
                flexDirection: 'column',
                justifyContent: 'center',
                height: '100%', paddingLeft: 60
            }}>
                <View onTouchEnd={() => Utils.goback(this)}
                    style={{
                        position: 'absolute',
                        top: 0, bottom: 0, left: 0, right: 0,
                    }} />
                <View style={{
                    borderTopRightRadius: 3,
                    borderTopLeftRadius: 3,
                    backgroundColor: 'white',
                    flex: 1,
                }}>
                    <View style={{
                        flex: 1,
                    }}>

                        <View style={{
                            width: '100%',
                            paddingTop: nstyles.paddingTopMul() + 15,
                            backgroundColor: 'white',
                            backgroundColor: colors.white,

                        }}>
                            <View style={{
                                flexDirection: 'row', alignItems: 'center', borderWidth: 0,
                                borderBottomColor: colors.greyLight, borderBottomWidth: 1,
                            }}>

                                <TouchableOpacity
                                    onPress={() => Utils.goback(this)}
                                    style={{
                                        padding: 10,
                                        alignItems: 'center', justifyContent: 'center',
                                    }}>
                                    <Image
                                        source={ImgComp.icCloseWhite}
                                        style={{
                                            width: 20, height: 20,
                                            tintColor: colors.colorTextSelect
                                        }} resizeMode='contain' />
                                </TouchableOpacity>
                                <View style={{ minWidth: 200, flex: 1 }}>
                                    <Text style={{
                                        fontWeight: 'bold', fontSize: reText(18), textAlign: 'center',
                                        color: colors.colorTextSelect, marginRight: 40,
                                    }}>{this.Title}</Text>
                                </View>

                            </View>
                            <View>
                                {
                                    this.IsSearch == true ? <InputRNCom
                                        styleContainer={{ paddingHorizontal: 10 }}
                                        styleBodyInput={{
                                            borderColor: colors.white, borderRadius: 10,
                                            minHeight: 40, alignItems: 'center',
                                        }}
                                        styleLabel={{ fontWeight: 'bold' }}
                                        sufix={
                                            <TouchableOpacity
                                                //  onPress={props.onPressChange} 
                                                style={{
                                                    height: 30,
                                                    alignItems: 'center',
                                                    justifyContent: 'center', paddingHorizontal: 10
                                                }}>
                                                <Image

                                                    source={ImgComp.icSearch}
                                                    style={{
                                                        width: 22, height: 22,
                                                        tintColor: colors.white
                                                    }} resizeMode='contain' />
                                            </TouchableOpacity>
                                        }
                                        placeholder={"Từ khóa..."}
                                        styleInput={{ paddingHorizontal: 10, color: colors.white }}
                                        styleError={{ backgroundColor: 'white', }}
                                        styleHelp={{ backgroundColor: 'white', }}
                                        placeholderTextColor={colors.white}
                                        // errorText={'Số điện thoại không hợp lệ'}
                                        // helpText={'Địa chỉ nơi ở hiện tại ucủa bạn'}
                                        valid={true}
                                        prefix={null}

                                        value={this.state.keySearch}
                                        onChangeText={this.onChangeText}
                                    /> : null
                                }


                            </View>

                        </View>
                        <ScrollView>
                            {
                                this.state.data && this.state.data.map(this._renderItem)
                            }
                        </ScrollView>
                    </View>
                    <View style={{
                        marginBottom: nstyles.paddingBotX, padding: 10, backgroundColor: colors.white,
                        borderWidth: 0, borderTopWidth: 1, borderColor: colors.greyLight,
                    }}>
                        <TouchableOpacity onPress={this._goback} style={{
                            backgroundColor: colors.greyLight,
                            borderWidth: 1, borderColor: colors.white,
                            minHeight: 45, borderRadius: 5, justifyContent: 'center'
                        }}>
                            <Text style={{
                                fontSize: reText(14), color: colors.white,
                                textAlign: 'center', fontWeight: 'bold',
                            }}>{'Thoát'}</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <TouchableOpacity
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


                    <Image source={ImgComp.icCloseBlack} resizeMode={'contain'}
                        style={{ ...nstyles.nstyles.nIcon20, tintColor: colors.redStar }} />

                </TouchableOpacity>
            </View >
        );
    }
}



export default ConponentSelectPropsRight;
