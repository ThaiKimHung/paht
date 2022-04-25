import React, {Component} from 'react';
import {View, StyleSheet, Animated, FlatList, Text, TouchableOpacity} from 'react-native';
import COLOR from '../../Styles/Colors';
import FONT from '../../Styles/Font';
import POSITION from '../../Styles/Position';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Animation from '../../Styles/Animation';
import ResultItem from './ResultItem';
import {connect} from 'react-redux';

class ResultBanner extends Component<{}> {

    constructor(props) {
        super(props);
        this.state = {
            listKetQua: props.resultState,
            statusCode: 200,
        };
    }

    shouldComponentUpdate(nextProps, nextState): boolean {
        return (
            nextState.statusCode !== this.state.statusCode
            || nextProps.height !== this.props.height
        );
    }

    componentWillUnmount(): void {
        this.props.dispatch({type: 'SET_SEARCH_RESULT', state: this.state.listKetQua});
    }

    animatedTranslateY = new Animated.Value(Animation.RESULT_BANNER_OFF.toValue);

    // hàm đóng banner
    onShowOffPanel = () => {
        this.setState({listKetQua: []});
        Animated.spring(this.animatedTranslateY, {
            ...Animation.RESULT_BANNER_OFF,
        }).start();
        this.props.onSetResultShowOnState(false);
    };

    // hàm close banner
    onShowOnPanel = () => {
        this.props.onSetResultShowOnState(true);
        Animated.spring(this.animatedTranslateY, {
            ...Animation.AREA_BANNER_ON,
        }).start();
    };


    _keyExtractor = (_, index) => index.toString();

    _renderItem = ({item}) => (
        <ResultItem
            item={item}
        />
    );


    render() {
        let {statusCode} = this.state;
        return (
            <Animated.View style={styles.container(this.animatedTranslateY, this.props.height)}>
                <View style={styles.optionRow}>
                    <Text style={styles.headerTitle}>Kết
                        quả: {statusCode === 200 ? this.state.listKetQua.length : null}</Text>
                    <TouchableOpacity onPress={this.onShowOffPanel} style={styles.btnView}>
                        <Icon name='close' size={23} color={COLOR.darkGray}/>
                    </TouchableOpacity>
                </View>
                <FlatList
                    style={{width: Animation.SCREEN_WIDTH}}
                    contentContainerStyle={styles.flatListContainer}
                    data={this.state.listKetQua}
                    renderItem={this._renderItem}
                    keyExtractor={this._keyExtractor}
                    ListEmptyComponent={
                        <EmptyComponent
                            isLoading={statusCode === 'loading'}
                            isFailed={statusCode !== 'loading' && statusCode !== 200}
                            onReload={this.props.onReload}
                        />
                    }
                />
            </Animated.View>
        );
    }
}

const mapStateToProps = (state) => ({
    resultState: state.result,
});

export default connect(mapStateToProps, null, null, {forwardRef: true})(ResultBanner);

export const EmptyComponent = props => {
    return (
        <View style={styles.emptyContainer}>
            <Text>
                {props.isLoading ?
                    'Đang tìm kiếm...'
                    : props.isFailed ?
                        'Xãy ra lỗi'
                        : 'Không tìm thấy kết quả tương ứng'
                }
            </Text>
            {props.isFailed ?
                <TouchableOpacity
                    style={styles.reloadButtonView}
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
    container: (translateY, height) => ({
        backgroundColor: COLOR.white,
        transform: [{translateY}],
        borderTopWidth: 1,
        borderTopColor: COLOR.border,
        height,
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
    flatListContainer: {
        paddingBottom: 20,
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
