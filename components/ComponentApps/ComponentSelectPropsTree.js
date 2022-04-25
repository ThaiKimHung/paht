import React, { Fragment, Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, SafeAreaView, Image, TouchableHighlight, ScrollView } from 'react-native';
import Utils from '../../app/Utils';
import { colors } from '../../styles';
import { reText } from '../../styles/size';
import { Height } from '../../styles/styles';
import TreeView from 'react-native-final-tree-view';
import * as Animatable from 'react-native-animatable'
import { ImgComp } from '../ImagesComponent';
// import HeaderSelect from './HeaderSelect';


class ComponentSelectPropsTree extends Component {
    constructor(props) {
        super(props);
        this.Title = Utils.ngetParam(this, 'title');
        this.callback = Utils.ngetParam(this, 'callback');
        this.item = Utils.ngetParam(this, 'item');
        this.AllThaoTac = Utils.ngetParam(this, 'AllThaoTac');
        this.ViewItem = Utils.ngetParam(this, 'ViewItem', () => { });
        this.Key = Utils.ngetParam(this, 'key', 'Name');
        this.IsSearch = Utils.ngetParam(this, 'Search', false);
        this.getNode = Utils.ngetParam(this, 'selectKhuVuc', null)
        this.state = {
            textempty: 'Không có dữ liệu',
            opacity: new Animated.Value(0),
            data: this.AllThaoTac,
            keySearch: '',
            result: null,
            end: false,
            selected: this.getNode,
            opacity: new Animated.Value(0),
        }
    };
    _select = (item, level) => {
        if (item.children.length > 0) {
            return;
        } else {
            this.setState({
                selected: item
            }, () => {
                this.callback(item);
                this._goback();
            })
        }
    }

    mapTree(data) {
        var list = []
        if (Array.isArray(data) && data.length > 0) {
            list = data.map((item, index) => {
                if (item.hasOwnProperty('children')) {
                    var children = this.mapTree(item.children)
                    return {
                        id: item.data.IdGroup,
                        name: item.data.GroupName,
                        children: children //Gán lại data hiện tại là Chilren
                    }
                }
                else {
                    return {
                        id: item.IdGroup,
                        name: item.GroupName,
                    }
                }
            })
        }
        else {
            return (
                list
            )
        }
        return (
            list
        )
    }

    _goback = () => {
        setTimeout(() => {
            Animated.timing(this.state.opacity, {
                toValue: 0,
                duration: 250
            }).start(() => {
                // this.comeback();
                Utils.goback(this)
            });
        }, 100);
    }
    _renderItem = ({ item, index }) => {
        return <TouchableHighlight underlayColor={colors.backgroundModal} key={index.toString()} onPress={this._select(item)} style={{ flex: 1 }}>
            {
                this.ViewItem(item)
            }
        </TouchableHighlight>
    }

    componentDidMount() {
        this._startAnimation(0.4)

        Utils.nlog("giá trị all thao tác", this.AllThaoTac)

    }

    _startAnimation = (value) => {
        setTimeout(() => {
            Animated.timing(this.state.opacity, {
                toValue: value,
                duration: 300
            }).start();
        }, 350);
    };

    onChangeText = (val) => {
        this.setState({ keySearch: val })

        let datanew = this.AllThaoTac.filter(item => Utils.removeAccents(item[this.Key].toUpperCase()).includes(val.toUpperCase()))
        this.setState({ data: datanew })
    }

    _getIndicator = (isExpanded, hasChildrenNodes) => {
        if (!hasChildrenNodes) {
            return ('+');
        } else if (isExpanded) {
            return ('-');
        } else {
            return ('*');
        }
    };



    render() {
        const { data, end, selected, opacity } = this.state
        Utils.nlog(this.mapTree(this.AllThaoTac.children))

        return (
            <View style={{
                flex: 1,
                // backgroundColor: 'rgba(0,0,0,0.50)',
                flexDirection: 'column',
                justifyContent: 'center',
            }}>

                <Animated.View
                    style={{
                        position: 'absolute',
                        top: 0, bottom: 0, left: 0, right: 0, backgroundColor: 'black', opacity
                    }} onTouchEnd={this._goback} />
                <Animatable.View animation={'zoomInDown'} style={{
                    // marginTop: 100,
                    marginHorizontal: 10,
                    borderTopRightRadius: 3,
                    borderTopLeftRadius: 3,
                    paddingBottom: 60
                }}>
                    <View style={{
                    }}>

                        <View style={{
                            height: "auto",
                            minHeight: 500,
                            width: '100%',
                            borderRadius: 3,
                            backgroundColor: 'white',
                            borderRadius: 10,
                            maxHeight: Height(70)
                            // flex:1
                        }}>
                            <View style={{ flexDirection: 'row', backgroundColor: colors.colorHeaderApp, paddingVertical: 10, borderTopLeftRadius: 10, borderTopRightRadius: 10 }}>
                                <TouchableOpacity
                                    onPress={() => this._goback()}
                                    style={{
                                        height: 30,
                                        paddingHorizontal: 10,
                                        alignItems: 'center', justifyContent: 'center',
                                    }}>
                                    <Image
                                        source={ImgComp.icBack}
                                        style={{
                                            width: 16, height: 16,
                                            tintColor: colors.white
                                        }} resizeMode='contain' />
                                </TouchableOpacity>
                                <View style={{ minWidth: 200, flex: 1, alignSelf: 'center' }}>
                                    <Text style={{
                                        fontWeight: 'bold', fontSize: reText(16), textAlign: 'center',
                                        color: colors.white, marginRight: 40,
                                    }}>{this.Title}</Text>
                                </View>
                            </View>
                            <ScrollView style={{
                                marginLeft: 10, marginVertical: 10, backgroundColor: 'white',
                            }}>
                                <Text style={{ fontSize: reText(16), fontWeight: 'bold', paddingVertical: 10 }}>{'Chọn khu vực'}</Text>
                                <TreeView
                                    data={this.mapTree(this.AllThaoTac.children)}
                                    initialExpanded={true}
                                    // activeOpacityNode={0.5}
                                    onNodePress={({ node, level }) => this._select(node, level)}
                                    renderNode={({ node, level, isExpanded, hasChildrenNodes }) => {
                                        return (
                                            <Text
                                                style={{
                                                    marginLeft: 30 * level,
                                                    fontSize: reText(16),
                                                    paddingHorizontal: 10,
                                                    color: selected != null && selected.id == node.id ? colors.greenFE : colors.black,
                                                    fontWeight: selected != null && selected.id == node.id ? 'bold' : 'normal',
                                                    height: 40
                                                }}>
                                                {this._getIndicator(node, isExpanded, hasChildrenNodes)} {node.name}
                                            </Text>
                                        );
                                    }}
                                />
                            </ScrollView>

                        </View>


                    </View>


                </Animatable.View>

            </View >
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
});
export default ComponentSelectPropsTree