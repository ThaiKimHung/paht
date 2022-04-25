import React, { Component } from 'react';
import {
    Image, View, StyleSheet, Text, Platform, TouchableOpacity, FlatList
} from 'react-native';

import { nstyles } from '../../styles/styles';

import Utils from '../../app/Utils';
import { Images } from '../images/index';
import { sizes, reText } from '../../styles/size';
import { colors } from '../../styles/color';
import { RootLang } from '../../app/data/locales';
import HeaderCom from '../../components/HeaderCom';


var dataLague = [
    { icon: Images.IcVn, name: 'Việt Nam', code: 'vi' },
    { icon: Images.IcUs, name: 'English (United States)', code: 'en' },
    // { icon: Images.IcKr, ten: 'Korea', code: '' },
    // { icon: Images.IcCn, ten: 'China', code: '' },
    // { icon: Images.IcJp, ten: 'Japan', code: '' },
    // { icon: Images.IcFr, ten: 'Franceis', code: '' },
    // { icon: Images.IcKh, ten: 'Cambodia', code: '' },
    // { icon: Images.IcTh, ten: 'ThaiLan', code: '' },
];


class ItemList extends Component {
    // -- Hàm này sẽ tối ưu không render lại quá nhiều đặc biệt là FlatList, List
    // -- Còn trường hợp sử dụng PureComponent đang nghiên cứu.

    shouldComponentUpdate(nextProps) {
        if (this.props.dataItem.name === nextProps.dataItem.name) {
            return false
        }
        return true
    }
    // --

    render() {
        const { dataItem, onPress, value } = this.props;
        return (
            <TouchableOpacity
                onPress={onPress}
                activeOpacity={0.6}
                style={[nstyles.nrow, {
                    paddingHorizontal: 20, paddingVertical: 10,
                    backgroundColor: colors.white, marginBottom: 1, alignItems: 'center', justifyContent: 'space-between'
                }]}>
                <Text style={{ fontSize: reText(14), lineHeight: reText(26), color: colors.black }}> {dataItem.name}</Text>
                {value != dataItem.code ? null :
                    <Image source={Images.icCheckBlue} resizeMode='contain' style={[nstyles.nIcon16]} />
                }
            </TouchableOpacity>
        );
    }
}

export default class Language extends Component {
    constructor(props) {
        super(props);
        this.value = Utils.ngetParam(this, 'value', 0);
        this.callback = Utils.ngetParam(this, 'callback', () => { });
        this.state = {
            //data globle
            isLoading: false,
            //-data local
            islang: 'en',
            blogToogle: false
        }
    }

    onLangueChange = (val) => () => {
        this.callback(val);
        // Utils.goscreen(this, screen);
        Utils.goback(this);
    }
    _goBack = () => {
        Utils.goback(this)
    };
    render() {
        if (dataLague.code == '') {
            dataLague.code == undefined
        }
        return (
            // ncontainerX support iPhoneX, ncontainer + nfooter mới sp iphoneX 
            <View style={nstyles.ncontainerX}>
                {/* Header  */}
                <HeaderCom nthis={this} iconLeft={Images.icCloseWhite} titleText={'Ngôn ngữ'} />

                {/* BODY */}
                <View style={[nstyles.nbody, { paddingTop: 2 }]}>
                    <FlatList
                        data={dataLague}
                        renderItem={({ item }) =>
                            <ItemList dataItem={item} value={this.value} onPress={this.onLangueChange(item)} />
                        }
                        keyExtractor={(item, index) => item.name}
                    />
                </View>
            </View >
        );
    }
}

