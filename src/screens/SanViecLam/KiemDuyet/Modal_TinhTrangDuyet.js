import React, { Fragment, Component } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Animated } from 'react-native';
import Utils from '../../../../app/Utils';
import { ListEmpty } from '../../../../components';
import { sizes, colors, nstyles } from '../../../../styles';

export default class Modal_TinhTrangDuyet extends Component {
    constructor(props) {
        super(props);
        this.callback = Utils.ngetParam(this, 'callback');
        this.item = Utils.ngetParam(this, 'item');
        this.AllThaoTac = Utils.ngetParam(this, 'AllThaoTac');
        this.state = {
            textempty: 'Không có dữ liệu',
            opacity: new Animated.Value(0)
        }
    };

    _select = (item) => () => {
        setTimeout(() => {
            Animated.timing(this.state.opacity, {
                toValue: 0,
                duration: 250
            }).start(() => {
                this.callback(item);
                Utils.goback(this);
            });
        }, 100);
    }

    _goback = () => {
        setTimeout(() => {
            Animated.timing(this.state.opacity, {
                toValue: 0,
                duration: 250
            }).start(() => {
                Utils.goback(this);
            });
        }, 100);
    }

    _renderItem = (item) => {
        return <Fragment key={item.Id}>
            <TouchableOpacity onPress={this._select(item)} style={{ padding: 22, paddingVertical: 20 }}>
                <Text style={{ fontSize: sizes.reSize(16), color: (this.item.Id == item.Id ? colors.peacockBlue : 'black') }}>{item.Status}</Text>
            </TouchableOpacity>
            <View style={{ height: 1, backgroundColor: colors.black_20, marginHorizontal: 20 }} />
        </Fragment>
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
            <View style={[nstyles.nstyles.ncontainer, { backgroundColor: `transparent`, justifyContent: 'flex-end' }]}>
                <Animated.View onTouchEnd={this._goback} style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: 'rgb(17,17,17)', opacity }} />
                <View style={{ backgroundColor: colors.white, borderTopLeftRadius: 20, borderTopRightRadius: 20, zIndex: 1, maxHeight: nstyles.Height(50) }}>
                    <ScrollView contentContainerStyle={{ paddingBottom: nstyles.paddingBotX }}>
                        {
                            this.AllThaoTac.length > 0 ? this.AllThaoTac.map(this._renderItem) : <ListEmpty textempty={'Không có dữ liệu'} />
                        }
                    </ScrollView>

                </View>
            </View>
        );
    }
}
