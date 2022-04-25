import React, { Component } from 'react'
import { Image, Text, View, TextInput, StyleSheet, TouchableOpacity } from 'react-native'
import Utils from '../../../../../app/Utils'
import TextApp from '../../../../../components/TextApp'
import { colorsSVL } from '../../../../../styles/color'
import { reText } from '../../../../../styles/size'
import { nstyles } from '../../../../../styles/styles'
import HeaderSVL from '../../../components/HeaderSVL'
import { ImagesSVL } from '../../../images'

const dataSearch = [
    {
        Id: 1,
        Name: 'Công nghệ thông tin',
    },
    {
        Id: 2,
        Name: 'Thiết kế đồ họa',
    },
    {
        Id: 3,
        Name: 'Việc bán thời gian',
    },
    {
        Id: 2,
        Name: 'Công việc về tối',
    },


]

export class Modal_Search extends Component {
    constructor(props) {
        super(props)
        this.CallBack = Utils.ngetParam(this, 'CallBack', () => { });
        this.state = {
            keySearch: '',
            hasFocus: false,
            lstLichSu: dataSearch
        }
    }
    _goBack = () => {
        Utils.goback(this)
    }
    _callBack = (item) => {
        this.CallBack(item);
        Utils.goback(this)
    }
    onChangeText = (val) => {
        // Utils.nlog('Gia tri vals', val)
        this.setState({ keySearch: val, hasFocus: true })
    }
    setFocus(hasFocus) {
        this.setState({ hasFocus });
    }
    _ClearSearch = () => {
        this.textInput.clear()
        this.setState({ hasFocus: false });
    }
    _DeleteLichSu = (index) => {
        var array = [...this.state.lstLichSu];
        array.splice(index, 1);
        Utils.nlog('Gia tri index - arrr after ', index, array)
        this.setState({ lstLichSu: array });
    }
    render() {
        const { keySearch, hasFocus, lstLichSu } = this.state
        return (
            <View style={stModal_Search.background}>
                <View onTouchEnd={this._goBack} style={stModal_Search.shadow} />
                <HeaderSVL
                    styleContainer={{ paddingBottom: 10, }}
                    iconLeft={ImagesSVL.icBackSVL}
                    onPressLeft={this._goBack}
                    maxWidth_LR={60}
                    onPressRight={() => { this.CallBack(keySearch); this._goBack() }}
                    titleRight='Tìm'
                    Sright={{ color: colorsSVL.grayTextLight }}
                    componentTitle={<View style={{ flex: 1 }}>
                        <View style={stModal_Search.header}>
                            <TouchableOpacity onPress={() => this._callBack(keySearch)} style={stModal_Search.touchimg} >
                                <Image source={ImagesSVL.icSearchSVL} style={[nstyles.nIcon20]} />
                            </TouchableOpacity>
                            <TextInput
                                ref={input => { this.textInput = input }}
                                autoFocus={true}
                                style={stModal_Search.input}
                                placeholder={'Tìm kiếm'}
                                value={keySearch}
                                onFocus={() => this.setFocus(true)}
                                onChangeText={(val) => {
                                    this.onChangeText(val)
                                }}
                                returnKeyType='search'
                                onSubmitEditing={() => this._callBack(keySearch)}
                            />
                            <TouchableOpacity onPress={this._ClearSearch} style={stModal_Search.touchimg} >
                                <Image source={ImagesSVL.icCloseBlackSVL} style={[nstyles.nIcon20]} />
                            </TouchableOpacity>
                        </View>
                    </View>}
                />
                {
                    lstLichSu.map((item, index) => {
                        return (<View key={index} style={[{
                            backgroundColor: colorsSVL.white,
                        }]}>
                            <TouchableOpacity onPress={() => this._callBack(item.Name)} style={stModal_Search.contain}>
                                <View style={{ flexDirection: 'row', flex: 1, }}>
                                    <Image source={ImagesSVL.icLichSuSearch} style={{ alignSelf: 'center', }} />
                                    <TextApp style={stModal_Search.text} >{item.Name}</TextApp>
                                </View>
                                <TouchableOpacity onPress={() => this._DeleteLichSu(index)} style={{ padding: 10, }}>
                                    <Image source={ImagesSVL.icCloseSVL} />
                                </TouchableOpacity>
                            </TouchableOpacity>
                            <View style={stModal_Search.gachngang} />
                        </View>)
                    })
                }

            </View>

        )
    }
}

export default Modal_Search
const stModal_Search = StyleSheet.create({
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: colorsSVL.grayBgrInput, borderRadius: 25, paddingHorizontal: 10, },
    input: { flex: 1, fontSize: reText(14), paddingLeft: 5, },
    gachngang: { height: 1, backgroundColor: colorsSVL.grayBgrInput, marginHorizontal: 13 },
    shadow: { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 },
    background: { backgroundColor: 'rgba(0,0,0,0.50)', flexDirection: 'column', height: '100%' },
    contain: { flexDirection: 'row', backgroundColor: colorsSVL.white, padding: 10, justifyContent: 'center', alignItems: 'center', },
    text: { marginHorizontal: 10, fontSize: reText(14) },
    touchimg: { padding: 5, paddingVertical: 10 }
})