import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    TextInput,
    Text,
    TouchableOpacity,
    Keyboard,
    Alert,
} from 'react-native';
import {connect} from 'react-redux';
import COLOR from '../../Styles/Colors';
import FONT from '../../Styles/Font';
import POSITION from '../../Styles/Position';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Animation from '../../Styles/Animation';
import AreaBanner from './AreaBanner';
import ResultBanner from './ResultBanner';
import {getSearchList} from '../../Containers/Search';
import Dash from '../UI/Dash';

class SearchPanel extends Component<{}> {
    constructor(props) {
        super(props);
        let {
            searchText,
            placeholder,
            isSearchByName,
            areaSelected,
            isResultShowOn,
        } = props.searchState;
        this.state = {
            searchText,
            placeholder: props.dataUser
                ? placeholder
                : 'Nhập số tờ/số thửa (VD: 10/123)',
            isSearchByName: props.dataUser ? isSearchByName : false,
            areaSelected,
            resultHeight: Animation.RESULT_BANNER_OFF.toValue,
            isResultShowOn,
        };
    }

    componentDidMount() {
        this._unsubscribe = this.props.navigation.addListener('blur', () => {
            this.props.dispatch({type: 'SET_SEARCH', state: this.state});
        });

        if (this.state.isResultShowOn) {
            this.ResultBanner.onShowOnPanel();
        }
    }

    componentWillUnmount() {
        this._unsubscribe();
    }

    // hàm gọi api tìm kiếm
    onCallAPISearch = (route, payload) => {
        this.ResultBanner.setState({statusCode: 'loading'});
        let onSuccess = (statusCode, response) => {
            if (statusCode === 200) {
                this.ResultBanner.setState({
                    statusCode: 200,
                    listKetQua: response,
                });
            } else {
                this.ResultBanner.setState({
                    statusCode: statusCode,
                });
            }
        };
        getSearchList(route, payload, onSuccess);
    };

    // hàm call khi nhập ký tự tìm kiếm vào thanh search bar
    _onChangeText = (text) => this.setState({searchText: text});

    // hàm thay đổi option tìm kiếm
    onOptionSearchChange = (searchMode) => () => {
        if (this.props.dataUser) {
            let isSearchByName = searchMode === 'byName';
            this.setState({
                isSearchByName,
                placeholder: isSearchByName
                    ? 'Nhập tên chủ sở hữu'
                    : 'Nhập số tờ/số thửa (VD: 10/123)',
            });
        } else {
            Alert.alert(
                'Thông báo',
                'Xin vui lòng đăng nhập để sử dụng chức năng này',
                [
                    {
                        text: 'Đồng ý',
                        onPress: () => {},
                        style: 'cancel',
                    },
                ],
                {cancelable: false},
            );
        }
    };

    // action khi bấm vào khu vực
    onAreaDownPress = () => {
        Keyboard.dismiss();
        this.AreaBanner.onShowOnPanel();
    };

    // thay đổi giá trị của khu vực tìm kiếm
    setAreaTitle = (areaSelected) => {
        this.setState({areaSelected});
        // this.checkValidArea()
    };

    // action khi bấm tìm kiếm
    onSearchPress = () => {
        if (
            (this.props.dataUser && this.state.isSearchByName) ||
            !this.state.isSearchByName
        ) {
            this.onCallActionSearch();
        }
    };

    // hàm gọi các action tìm kiếm
    onCallActionSearch = () => {
        Keyboard.dismiss();
        this.AreaBanner.onShowOffPanel();
        let {isSearchByName, searchText} = this.state,
            idXa = this.AreaBanner.state.xaSelected.searchID;
        if (!idXa) {
            Alert.alert(
                'Hướng dẫn',
                'Vui lòng chọn khu vực (xã/phường) trước khi tìm kiếm.',
                [
                    {
                        text: 'Đồng ý',
                        onPress: () => {},
                        style: 'cancel',
                    },
                ],
                {cancelable: false},
            );
        } else if (!isSearchByName) {
            let arraySearchText = searchText.split('/');
            if (arraySearchText.length !== 2) {
                Alert.alert(
                    'Hướng dẫn',
                    'Vui lòng nhập đúng cú pháp tìm kiếm số tờ/số thửa. Ví dụ để tìm thửa 123, tờ 10, bạn hãy nhập 10/123',
                    [
                        {
                            text: 'Đồng ý',
                            onPress: () => {},
                            style: 'cancel',
                        },
                    ],
                    {cancelable: false},
                );
            } else {
                let SOTO = arraySearchText[0].trim(),
                    SOTHUA = arraySearchText[1].trim(),
                    MADVHC = idXa,
                    payload = {
                        MaDvhc: MADVHC,
                        SoTo: SOTO,
                        SoThua: SOTHUA,
                        TenChu: '',
                    };
                this.onCallAPISearch('byToThua', payload);
                this.ResultBanner.onShowOnPanel();
            }
        } else if (searchText) {
            let payload = {
                TenChu: searchText,
                MaDvhc: idXa.toString(),
                SoTo: '',
                SoThua: '',
            };
            this.onCallAPISearch('byName', payload);
            this.ResultBanner.onShowOnPanel();
        }
    };

    onSetResultShowOnState = (state) => {
        if (!state) {
            this.setState({isResultShowOn: state, searchText: ''});
        } else {
            this.setState({isResultShowOn: state});
        }
    };

    render() {
        let {isSearchByName, searchText} = this.state;
        return (
            <View style={styles.container}>
                {/*Thanh tìm kiếm*/}
                <Dash/>
                <View style={styles.searchMenuBar}>
                    <TextInput
                        ref={(e) => (this.TextInput = e)}
                        style={styles.input}
                        placeholder={this.state.placeholder}
                        placeholderTextColor={COLOR.darkGray}
                        value={searchText}
                        onChangeText={this._onChangeText}
                        underlineColorAndroid="transparent"
                        onSubmitEditing={this.onSearchPress}
                    />
                    <TouchableOpacity
                        onPress={this.onSearchPress}
                        style={styles.btnView}>
                        <Icon name="search" style={styles.btnIcon} />
                    </TouchableOpacity>
                </View>
                {/*Menu tùy chọn tìm kiếm */}
                <View style={styles.optionRow}>
                    <View style={styles.option}>
                        <RadioButton
                            title="Tìm theo tên"
                            selected={isSearchByName}
                            onChange={this.onOptionSearchChange('byName')}
                        />
                        <RadioButton
                            title="Tìm theo tờ thửa"
                            selected={!isSearchByName}
                            onChange={this.onOptionSearchChange('byPage')}
                        />
                    </View>
                </View>
                {/*Menu chọn khu vực hành chính*/}
                <View style={styles.optionRow}>
                    <Text style={styles.areaTitle}>Khu vực: </Text>
                    <Text
                        onPress={this.onAreaDownPress}
                        numberOfLines={1}
                        style={styles.area}>
                        {this.state.areaSelected}
                    </Text>
                    <TouchableOpacity
                        style={styles.btnView}
                        onPress={this.onAreaDownPress}>
                        <Icon
                            name="arrow-drop-down"
                            size={26}
                            color={COLOR.darkGray}
                        />
                    </TouchableOpacity>
                </View>
                {/*Banner chọn khu vực*/}
                <AreaBanner
                    ref={(ref) => (this.AreaBanner = ref)}
                    setAreaTitle={this.setAreaTitle}
                />
                {/*Banner kết quả tìm kiếm*/}
                <ResultBanner
                    ref={(e) => (this.ResultBanner = e)}
                    onReload={this.onCallActionSearch}
                    height={this.state.resultHeight}
                    onSetResultShowOnState={this.onSetResultShowOnState}
                />
            </View>
        );
    }
}

const mapStateToProps = (state) => ({
    searchState: state.search,
    dataUser: state.userInfo,
    showPanelInfo: state.showPanelInfo,
});

export default connect(mapStateToProps)(SearchPanel);

const RadioButton = (props) => {
    return (
        <TouchableOpacity
            style={styles.option}
            onPress={props.onChange}
            disabled={props.selected}>
            <View style={styles.btnView}>
                {props.selected ? (
                    <Icon
                        name="radio-button-checked"
                        size={23}
                        color={COLOR.blue}
                    />
                ) : (
                    <Icon
                        name="radio-button-unchecked"
                        size={23}
                        color={COLOR.darkGray}
                    />
                )}
            </View>
            <Text numberOfLines={1} style={styles.titleOption}>
                {props.title}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLOR.white,
        flex: 1,
    },
    searchMenuBar: {
        flexDirection: POSITION.row,
        alignItems: POSITION.center,
        height: 47,
        marginBottom: 10,
        paddingLeft: 16,
    },
    titleView: {
        flex: 1,
        justifyContent: POSITION.center,
    },
    title: {
        fontFamily: FONT.FontFamily,
        fontSize: 15,
        color: COLOR.darkGray,
        marginRight: 16,
    },
    input: {
        fontFamily: FONT.FontFamily,
        fontSize: 15,
        color: COLOR.black,
        marginRight: 16,
        flex: 1,
        padding: 0,
        height: POSITION.buttonHeight,
    },
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
    rowLine: {
        height: 40,
        width: 1,
        backgroundColor: COLOR.border,
    },
    optionRow: {
        flexDirection: POSITION.row,
        alignItems: POSITION.center,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: COLOR.border,
        paddingVertical: 3,
    },
    option: {
        flexDirection: POSITION.row,
        alignItems: POSITION.center,
        flex: 1,
    },
    titleOption: {
        fontSize: 15,
        color: COLOR.black,
        fontFamily: FONT.FontFamily,
    },
    areaTitle: {
        fontFamily: FONT.FontFamily,
        color: COLOR.black,
        fontSize: 15,
        marginRight: 5,
        marginLeft: 20,
    },
    area: {
        fontFamily: FONT.FontFamily,
        color: COLOR.blue,
        fontSize: 15,
        flex: 1,
    },
});
