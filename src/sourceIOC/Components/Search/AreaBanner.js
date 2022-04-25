import React, {Component} from 'react';
import {View, StyleSheet, Animated, FlatList, Text, TouchableOpacity, ScrollView} from 'react-native';
import {connect} from 'react-redux';
import COLOR from '../../Styles/Colors';
import FONT from '../../Styles/Font';
import POSITION from '../../Styles/Position';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Animation from '../../Styles/Animation';
import {getListHuyen, getListXa} from '../../Containers/Search';
import setup from '../../Containers/setup';


class AreaBanner extends Component<{}> {

    constructor(props) {
        super(props);
        let {isShowing, listHuyen, listXa, xaSelected, huyenSelected, statusCode} = props.areaState;
        this.state = {
            isShowing,
            listHuyen,
            listXa,
            xaSelected,
            huyenSelected,
            statusCode,
            mode:'huyen',
        };
    }


    shouldComponentUpdate(nextProps, nextState): boolean {
        return (
            nextState.mode !== this.state.mode
            || nextState.statusCode !== this.state.statusCode
            || nextState.xaSelected.id !== this.state.xaSelected.id
            || nextState.huyenSelected.id !== this.state.huyenSelected.id
        );
    }

    componentDidMount(): void {
        if (!this.state.listHuyen.length) {
            this.onLoadListHuyen();
        }
        this.onSetAreaOnRoot();
    }

    componentWillUnmount(): void {
        this.props.dispatch({type: 'SET_LOCAL_PICKUP', state: this.state});
    }

    animatedTranslateY = new Animated.Value(Animation.AREA_BANNER_OFF.toValue);

    // hàm load danh sách huyện
    onLoadListHuyen = () => {
        this.setState({statusCode: 'loadHuyen'});
        let onSuccess = (statusCode, response) => {
            if (statusCode === 200) {
                this.setState({statusCode: 200, listHuyen: response});
                this.onLoadListXa(setup.huyenId)();
            } else {
                this.setState({statusCode});
            }
        };
        getListHuyen(onSuccess);
    };

    // hàm load danh sách xã
    onLoadListXa = (huyenId) => () => {
        this.setState({statusCode: 'loadXa'});
        let onSuccess = (statusCode, response) => {
            if (statusCode === 200) {
                this.props.setAreaTitle('Toàn huyện');
                this.setState({
                    statusCode: 200,
                    listXa: response,
                    xaSelected: response[0],
                });
            } else {
                this.setState({statusCode});
            }
        };
        getListXa(huyenId, onSuccess);
    };

    // hàm đóng banner
    onShowOffPanel = () => {
        this.setState({isShowing: false});
        Animated.spring(this.animatedTranslateY, {
            ...Animation.AREA_BANNER_OFF,
        }).start();

        setTimeout(() => {
            this.onSetAreaOnRoot();
        }, 300);
    };

    onSetAreaOnRoot = () => {
        let {xaSelected, huyenSelected} = this.state,
            areaTitle;
        if (xaSelected) {
            if (xaSelected.id === setup.huyenId.toString()) {
                areaTitle = 'Toàn huyện';
            } else {
                areaTitle = `${xaSelected.name}, ${huyenSelected.name}`;
            }
        } else {
            areaTitle = 'Chưa chọn xã/phường';
        }
        this.props.setAreaTitle(areaTitle);
    };

    // hàm show banner
    onShowOnPanel = () => {
        this.setState({isShowing: true});
        Animated.spring(this.animatedTranslateY, {
            ...Animation.AREA_BANNER_ON,
        }).start();
    };

    // hàm thay đổi chế độ huyện xã
    onAreaModePress = (mode) => () => {
        this.setState({mode});
        if (mode === 'huyen') {
            this.ScrollView.scrollTo({x: 0, animated: true});
        } else {
            this.ScrollView.scrollTo({x: Animation.SCREEN_WIDTH, animated: true});
        }
    };

    // action khi item huyện press
    onHuyenItemPress = (huyen) => () => {
        this.setState({huyenSelected: huyen});
        this.onLoadListXa(huyen.id);
    };

    // action khi item xã press
    onXaItemPress = (xa) => () => {
        this.setState({xaSelected: xa});
        this.onShowOffPanel();
    };

    _keyExtractor = (_, index) => index.toString();

    _renderItemHuyen = ({item}) => (
        <ItemArea
            name={item.name}
            active={item.active}
            selected={this.state.huyenSelected.id === item.id}
            onPress={this.onHuyenItemPress(item)}
        />
    );

    _renderItemXa = ({item}) => (
        <ItemArea
            name={item.name}
            active={item.active}
            selected={this.state.xaSelected.id === item.id}
            onPress={this.onXaItemPress(item)}
        />
    );


    render() {
        let {mode, statusCode} = this.state;
        return (
            <Animated.View style={styles.container(this.animatedTranslateY)}>
                <View style={styles.optionRow}>
                    <Text style={styles.headerTitle}>Khu vực tìm kiếm</Text>
                    <TouchableOpacity onPress={this.onShowOffPanel} style={styles.btnView}>
                        <Icon name="close" size={23} color={COLOR.darkGray}/>
                    </TouchableOpacity>
                </View>
                <View style={styles.optionRow}>
                    <ButtonAreaMode
                        title="Huyện/Thành phố"
                        active={mode === 'huyen'}
                        onChange={this.onAreaModePress('huyen')}
                    />
                    <ButtonAreaMode
                        title="Xã/Phường"
                        active={mode === 'xa'}
                        onChange={this.onAreaModePress('xa')}
                    />
                </View>
                <ScrollView
                    ref={e => this.ScrollView = e}
                    horizontal
                    scrollEnabled={false}
                >
                    <FlatList
                        style={{width: Animation.SCREEN_WIDTH}}
                        contentContainerStyle={styles.flatListContainer}
                        data={this.state.listHuyen}
                        renderItem={this._renderItemHuyen}
                        keyExtractor={this._keyExtractor}
                        ListEmptyComponent={
                            <EmptyComponent
                                isLoading={statusCode === 'loadHuyen'}
                                onReload={this.onLoadListHuyen}
                            />
                        }
                    />
                    <FlatList
                        style={{width: Animation.SCREEN_WIDTH}}
                        contentContainerStyle={styles.flatListContainer}
                        data={this.state.listXa}
                        renderItem={this._renderItemXa}
                        keyExtractor={this._keyExtractor}
                        ListEmptyComponent={
                            <EmptyComponent
                                isLoading={statusCode === 'loadXa'}
                                onReload={this.onLoadListXa(this.state.huyenSelected.id)}
                            />
                        }
                    />
                </ScrollView>
            </Animated.View>
        );
    }
}

const mapStateToProps = (state) => ({
    areaState: state.localPickup,
});

export default connect(mapStateToProps, null, null, {forwardRef: true})(AreaBanner);

const ButtonAreaMode = props => {
    return (
        <TouchableOpacity
            style={styles.modeArea}
            disabled={props.active}
            onPress={props.onChange}
        >
            <Text style={styles.modeAreaTitle(props.active)}>{props.title}</Text>
            {props.active ? <View style={styles.dash}/> : null}
        </TouchableOpacity>
    );
};

export const ItemArea = props => {
    return (
        <TouchableOpacity
            style={styles.optionRow}
            disabled={props.selected || !props.active}
            onPress={props.onPress}
        >
            <View style={styles.btnView}>
                {props.selected ? <Icon name="done" size={23} color={COLOR.blue}/> : null}
            </View>
            <Text style={styles.itemAreaTitle(props.active)}>{props.name}</Text>
        </TouchableOpacity>
    );
};

const EmptyComponent = props => {
    return (
        <View style={styles.emptyContainer}>
            <Text>{props.isLoading ? 'Đang tải dữ liệu...' : 'Dự liệu trống'}</Text>
            {!props.isLoading ?
                <TouchableOpacity
                    style={styles.reloadButtonView}
                    onPress={props.onReload}
                >
                    <Text style={styles.reloadButtonTitle}>Tải lại</Text>
                </TouchableOpacity>
                :
                null
            }
        </View>
    );
};

const styles = StyleSheet.create({
    container: (translateY) => ({
        backgroundColor: COLOR.white,
        transform: [{translateY}],
        borderTopWidth: 1,
        borderTopColor: COLOR.border,
        height: Animation.AREA_BANNER_OFF.toValue,
        bottom: 0,
        position: 'absolute',
        right: 0,
        left: 0,
    }),
    btnView: {
        marginHorizontal: 3,
        height: POSITION.buttonHeight,
        width: POSITION.buttonWidth,
        justifyContent: POSITION.center,
        alignItems: POSITION.center,
    },
    btnIcon: {
        fontSize: 26,
        color: COLOR.darkGray,
    },
    optionRow: {
        flexDirection: POSITION.row,
        alignItems: POSITION.center,
    },
    headerTitle: {
        fontFamily: FONT.FontFamily,
        fontSize: 16,
        color: COLOR.black,
        flex: 1,
        marginHorizontal: 20,
    },
    modeArea: {
        flex: 1,
        height: 40,
        justifyContent: POSITION.center,
        alignItems: POSITION.center,
        marginHorizontal: 16,
    },
    dash: {
        position: 'absolute',
        height: 3,
        bottom: 0,
        right: 6,
        left: 6,
        backgroundColor: COLOR.blue,
    },
    modeAreaTitle: (active) => ({
        fontSize: 13,
        color: active ? COLOR.blue : COLOR.darkGray,
        fontWeight: FONT.Bold,
        fontFamily: FONT.FontFamily,
    }),
    itemAreaTitle: (active) => ({
        fontFamily: FONT.FontFamily,
        color: active ? COLOR.black : COLOR.grey,
        fontSize: 15,
    }),
    flatListContainer: {
        paddingVertical: 20,
    },
    emptyContainer: {
        height: 250,
        justifyContent: POSITION.center,
        alignItems: POSITION.center,
    },
    reloadButtonView: {
        height: 42,
        paddingHorizontal: 20,
        backgroundColor: COLOR.blueBackground,
        justifyContent: POSITION.center,
        alignItems: POSITION.center,
        marginVertical: 10,
        borderRadius: 3,
    },
    reloadButtonTitle: {
        fontFamily: FONT.FontFamily,
        fontSize: 14,
        color: COLOR.blue,
        fontWeight: FONT.Bold,
    },
});
