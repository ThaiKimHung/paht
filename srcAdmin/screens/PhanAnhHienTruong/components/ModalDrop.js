import React, { Component } from 'react';
import {
    StyleSheet,
    Dimensions,
    View,
    Text,
    TouchableWithoutFeedback,
    TouchableOpacity,
    Modal,
    FlatList,
    Image,
    Platform
} from 'react-native';
import PropTypes from 'prop-types';
import { colors, sizes, nstyles } from '../../../../styles';
import { Images } from '../../../images';
import Utils from '../../../../app/Utils';
import { nheight, nwidth } from '../../../../styles/styles';
class ModalDrop extends Component {
    static propTypes = {
        isDrop: PropTypes.bool,
        isChuyenMuc: PropTypes.bool,
        disabled: PropTypes.bool,
        scrollEnabled: PropTypes.bool,
        defaultIndex: PropTypes.number,
        defaultValue: PropTypes.string,
        options: PropTypes.array,
        animated: PropTypes.bool,
        texttitle: PropTypes.any,
        showsVerticalScrollIndicator: PropTypes.bool,
        keyboardShouldPersistTaps: PropTypes.string,
        Name: PropTypes.string,
        style: PropTypes.oneOfType([PropTypes.number, PropTypes.object, PropTypes.array]),
        textStyle: PropTypes.oneOfType([PropTypes.number, PropTypes.object, PropTypes.array]),
        dropdownStyle: PropTypes.oneOfType([PropTypes.number, PropTypes.object, PropTypes.array]),
        dropdownTextStyle: PropTypes.oneOfType([PropTypes.number, PropTypes.object, PropTypes.array]),
        dropdownTextHighlightStyle: PropTypes.oneOfType([PropTypes.number, PropTypes.object, PropTypes.array]),
        styleContent: PropTypes.oneOfType([PropTypes.number, PropTypes.object, PropTypes.array]),
        renderRow: PropTypes.func,
        onselectItem: PropTypes.func,
        value: PropTypes.oneOfType([PropTypes.number, PropTypes.object, PropTypes.array]),
        keyItem: PropTypes.string
    };
    static defaultProps = {
        isChuyenMuc: false,
        isDrop: true,
        disabled: false,
        scrollEnabled: true,
        defaultIndex: -1,
        defaultValue: 'Please select...',
        options: [],
        Name: 'title',
        animated: true,
        showsVerticalScrollIndicator: true,
        keyboardShouldPersistTaps: 'never',
        onselectItem: () => { },
        value: {},
        keyItem: '',
        texttitle: ''
    };
    constructor(props) {
        super(props);
        this._button = null;
        this._buttonFrame = null;
        this._nextValue = null;
        this._nextIndex = null;

        this.state = {
            // accessible: !!props.accessible,
            // loading: !props.options,
            showDropdown: false,
            buttonText: this.props.options ? this.props.options[0] : defaultValue,
            selectedIndex: 0
        };
    }

    _renderButton() {
        const { textStyle, Name, texttitle, stTouch, value } = this.props;
        const { buttonText } = this.state;

        return (
            <View style={{ flex: 1 }} >
                <Text style={[{
                    fontSize: sizes.sizes.sText12,
                    lineHeight: sizes.reSize(14), marginTop: 5
                }]}>{texttitle}</Text>
                <TouchableOpacity
                    ref={button => this._button = button}
                    onPress={this._onButtonPress}
                    style={[{
                        backgroundColor: colors.colorGrayTwo,
                        borderWidth: 0.5, borderRadius: 2, padding: 10, borderColor: colors.brownGreyTwo,
                        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 5
                    }, stTouch]}>
                    <Text numberOfLines={1} style={[{ fontSize: sizes.sizes.sText14, flex: 1 }, textStyle]}>
                        {value ? value[`${Name}`] : buttonText ? buttonText[`${Name}`] : this.props.textDefault}
                    </Text>
                    <Image source={Images.icDropDown} style={[nstyles.nstyles.nIcon15, { tintColor: colors.brownGreyThree }]} resizeMode='contain' />
                </TouchableOpacity>
            </View>
            // <TouchableOpacity
            //     style={{ width: 200, height: 40, }}
            //     ref={button => this._button = button}
            //     onPress={this._onButtonPress}
            // >
            //     {
            //         (
            //             <View style={styles.button}>
            //                 <Text style={[styles.buttonText, textStyle]}
            //                     numberOfLines={1}
            //                 >
            //                     {buttonText[`${Name}`]}
            //                 </Text>
            //             </View>
            //         )
            //     }
            // </TouchableOpacity>
        );
    }
    _updatePosition(callback) {
        if (this._button && this._button.measure) {
            this._button.measure((fx, fy, width, height, px, py) => {
                this._buttonFrame = { x: px, y: py, w: width, h: height };
                callback && callback();
            });
        }
    }
    _onButtonPress = () => {
        this._updatePosition(() => {
            this.setState({
                showDropdown: true
            });
        });
    };
    _calcPosition() {
        const { dropdownStyle, style } = this.props;
        const dropdownHeight = (dropdownStyle && StyleSheet.flatten(dropdownStyle).height) ||
            StyleSheet.flatten(styles.dropdown).height;
        const bottomSpace = nheight() - this._buttonFrame.y - this._buttonFrame.h;
        const rightSpace = nwidth() - this._buttonFrame.x;
        const showInBottom = bottomSpace >= dropdownHeight || bottomSpace >= this._buttonFrame.y;
        const showInLeft = rightSpace >= this._buttonFrame.x;

        const positionStyle = {
            height: dropdownHeight,
            top: showInBottom ? this._buttonFrame.y + this._buttonFrame.h : Math.max(0, this._buttonFrame.y - dropdownHeight),
        };

        if (showInLeft) {
            positionStyle.left = this._buttonFrame.x;
        } else {
            const dropdownWidth = (dropdownStyle && StyleSheet.flatten(dropdownStyle).width) ||
                (style && StyleSheet.flatten(style).width) || -1;
            if (dropdownWidth !== -1) {
                positionStyle.width = dropdownWidth;
            }
            positionStyle.right = rightSpace - this._buttonFrame.w;
        }
        return positionStyle;
    }
    _onRequestClose = () => {
        this.setState({
            showDropdown: false
        });
    };
    _onModalPress = () => {
        this.setState({
            showDropdown: false
        });
    };
    _renderModal() {
        const { animated, dropdownStyle } = this.props;
        const {
            showDropdown,
        } = this.state;
        if (showDropdown && this._buttonFrame) {
            const frameStyle = this._calcPosition();
            const animationType = animated ? 'fade' : 'none';
            return (
                <Modal
                    animationType={'fade'}
                    visible={true}
                    transparent={true}
                    onRequestClose={this._onRequestClose}
                    supportedOrientations={['portrait', 'portrait-upside-down', 'landscape', 'landscape-left', 'landscape-right']}
                >
                    <TouchableWithoutFeedback
                        disabled={!showDropdown}
                        onPress={this._onModalPress}
                    >
                        <View style={styles.modal}>
                            <View style={[styles.dropdown, dropdownStyle, frameStyle, { flex: 1 }]}>
                                {this._renderDropdown()}
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>
            );
        } else {
            return null
        }
    }
    _renderDropdown() {
        const { scrollEnabled, showsVerticalScrollIndicator, keyboardShouldPersistTaps, options } = this.props;
        // Utils.nlog("gia tri data drop", options);
        return (
            <FlatList
                scrollEnabled={scrollEnabled}
                style={styles.list}
                data={options}
                renderItem={this._renderRow}
                showsVerticalScrollIndicator={showsVerticalScrollIndicator}
                keyboardShouldPersistTaps={keyboardShouldPersistTaps}
                keyExtractor={(item, index) => index.toString()}
            />
        );
    }
    _onRowPress = (item, index) => {
        const { onselectItem } = this.props
        this.setState({
            buttonText: item,
            selectedIndex: index,
            showDropdown: false
        }, () => onselectItem(item));
    }

    _renderRow = ({ item, index }) => {


        const { dropdownTextStyle, dropdownTextHighlightStyle, Name, isChuyenMuc = false } = this.props;
        // Utils.nlog("gia tri item ------------", item, isChuyenMuc)
        const { selectedIndex } = this.state;
        const key = `${index}`;
        const highlighted = index == selectedIndex;
        const row = (<Text
            style={[
                styles.rowText,
                dropdownTextStyle,
                highlighted && styles.highlightedRowText,
                highlighted && dropdownTextHighlightStyle,
                { width: this._buttonFrame.w }

            ]}
        > {item[`${Name}`].toString() + `${item.Prob != undefined ? ` - ${item.Prob.toString()}` : ''}`}
        </Text>)
        return (
            <TouchableOpacity
                key={key}
                onPress={() => this._onRowPress(item, index)}>
                {row}
            </TouchableOpacity>
        );
    };
    componentDidUpdate() {
        const { options, value, keyItem } = this.props;
        const { buttonText } = this.state;
        if (options.length > 0) {
            if (value[`${keyItem}`] != buttonText[`${keyItem}`]) {
                for (let i = 0; i < options.length; i++) {
                    const item = options[i];
                    if (item[`${keyItem}`] == value[`${keyItem}`]) {
                        this.setState({ buttonText: item, selectedIndex: i });
                        return;
                    };
                };
            }
        }

    }
    componentDidMount() {

        const { options, value, keyItem } = this.props;
        if (value) {
            for (let i = 0; i < options.length; i++) {
                const item = options[i];
                if (item[`${keyItem}`] == value[`${keyItem}`]) {
                    this.setState({ buttonText: item, selectedIndex: i });
                    return;
                };
            };
        };
    }

    render() {
        const { styleContent, isDrop } = this.props
        return (
            <View style={[{ flex: 1 }, styleContent]}>
                {
                    this._renderButton()
                }
                {isDrop == true ?
                    this._renderModal() : null
                }
            </View>
        );
    }
}
const styles = StyleSheet.create({
    button: {
        justifyContent: 'center'
    },
    buttonText: {
        fontSize: 12
    },
    modal: {
        flexGrow: 1,


    },
    dropdown: {
        position: 'absolute',
        height: (33 + StyleSheet.hairlineWidth) * 5,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: 'lightgray',
        borderRadius: 2,
        marginTop: Platform.OS == 'android' ? -20 : 0,
        backgroundColor: 'white',
        justifyContent: 'center'
    },
    loading: {
        alignSelf: 'center'
    },
    list: {


        //flexGrow: 1,
    },
    rowText: {
        paddingHorizontal: 6,
        paddingVertical: 10,
        fontSize: 11,
        color: 'gray',
        backgroundColor: 'white',
        textAlignVertical: 'center'
    },
    highlightedRowText: {
        color: nstyles.nColors.main
    },
    separator: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: 'lightgray'
    }
});
export default ModalDrop;
