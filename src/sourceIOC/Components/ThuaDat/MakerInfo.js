import React from 'react';
import {View, StyleSheet, Text, Animated, PanResponder} from 'react-native';
import {useDispatch,useSelector} from 'react-redux';
import COLOR from '../../Styles/Colors';
import FONT from '../../Styles/Font';
import POSITION from '../../Styles/Position';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import Icon3 from 'react-native-vector-icons/Entypo';
import Dash from '../UI/Dash';
import Type from '../../Redux/Type';
import {onShowOnPanel,onShowOffPanel,onShowMediumPanel} from '../../Containers/PanelInfo';

const MakerInfo = () => {

    const {showingMode,data,animatedTranslateY,currentValue,zoneList} = useSelector(state=>state.panelInfo);
    const [grantStart,setGrantStart] = React.useState(0)
    const dispatch = useDispatch();

    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderGrant: (evt, gestureState) => {
            setGrantStart(gestureState.y0);
        },
        onPanResponderMove: (evt, gestureState) => {
            animatedTranslateY.setValue(currentValue - grantStart + gestureState.moveY);
        },
        onPanResponderRelease: (evt, gestureState) => {
            let moveY = currentValue - grantStart + gestureState.moveY;
            dispatch({type:Type.PANEL_INFO.CURRENT_ANIMATED_VALUE,value:moveY})
            switch (showingMode) {
                case 'off':
                    onShowOnPanel();
                    break;
                case 'on':
                    onShowMediumPanel();
                    break;
                case 'medium': {
                    if (moveY < 210) {
                        onShowOnPanel();
                    } else {
                        onShowOffPanel();
                    }
                }
                    break;
            }
        },
    });


    const onHeightChange = ({nativeEvent: {layout: {height}}}) => {
        dispatch({type:Type.PANEL_INFO.HEIGHT_BANNER,value:height})
    };

    const getQHInfo = () => {
        let {MaDVHC, SOTO, SOTHUA} = data;
        if (MaDVHC && SOTO && SOTHUA)
        {
            let qhList = zoneList.filter(e => (e.MaDvhc === MaDVHC.toString() && e.SoTo === SOTO && e.SoThua === SOTHUA));
            if (qhList.length) {
                return qhList[0].data;
            }
        }
        return [];
    };
    return (
        <Animated.View
            style={styles.container(animatedTranslateY)}
            onLayout={onHeightChange}
        >
            <Dash/>
            <View style={styles.headerRow}>
                <View style={{flex: 1, flexDirection: POSITION.row}}>
                    <Text style={styles.headerContent}>Số tờ:
                        <Text style={styles.contentValue}> {data.SOTO}</Text>
                    </Text>
                    <Text style={styles.headerContent}>Thửa:
                        <Text style={styles.contentValue}> {data.SOTHUA}</Text>
                    </Text>
                </View>
                <Text style={styles.headerContent}>Diện tích:
                    <Text style={styles.areaTitle}> {data.DienTich} m²</Text>
                </Text>
            </View>
            {Array.isArray(data.MucDichSDD) ?
                <View style={{marginBottom: 6}}>
                    {data.MucDichSDD.map((element, i) => (
                        <Text key={i.toString()} style={styles.useTitle}>{element}</Text>
                    ))}
                </View>
                :
                null
            }
            <View style={styles.infoRow}>
                <Icon2 name="location-pin" size={16} style={{marginRight: 5}} color={COLOR.green}/>
                <Text numberOfLines={1} style={styles.addressTitle}>{data.DiaChiThuaDat}</Text>
            </View>
            <View style={styles.infoRow}>
                <Icon2 name="verified-user" size={14} style={{marginRight: 5}} color={COLOR.green}/>
                <Text numberOfLines={1} style={styles.addressTitle}>{data.TrangThaiThuaDat}</Text>
            </View>
            {data.Ten1 ?
                <View style={styles.ownerView}>
                    <View style={styles.infoRow}>
                        <Icon2 name="account-circle" size={16} style={{marginRight: 5, marginLeft: -2}}
                               color={data.GioiTinh1 ? COLOR.blue : COLOR.orange}/>
                        <Text numberOfLines={1} style={styles.ownerName}>{data.Ten1}</Text>
                    </View>
                    <Text numberOfLines={2} style={styles.ownerAddress}>
                        {data.NamSinh1}
                        <Icon3 name="dot-single"/>
                        {data.DiaChi1}
                    </Text>
                </View>
                : null
            }
            {data.Ten2 ?
                <View style={styles.ownerView}>
                    <View style={styles.infoRow}>
                        <Icon2 name="account-circle" size={16} style={{marginRight: 5, marginLeft: -2}}
                               color={data.GioiTinh2 ? COLOR.blue : COLOR.orange}/>
                        <Text numberOfLines={1} style={styles.ownerName}>{data.Ten2}</Text>
                    </View>
                    <Text numberOfLines={2} style={styles.ownerAddress}>
                        {data.NamSinh2}
                        <Icon3 name="dot-single"/>
                        {data.DiaChi2}
                    </Text>
                </View>
                : null
            }
            <View style={styles.infoRow}>
                <Text numberOfLines={1} style={styles.addressTitle}>Quy hoạch:</Text>
            </View>
            {getQHInfo().length ?
                getQHInfo().map((element, i) => (
                    <View key={i.toString()} style={styles.qhRow}>
                        <Icon name={'square'} color={element.color}/>
                        <Text numberOfLines={1} style={styles.qhTitle}>{element.quyhoach}</Text>
                    </View>
                ))
                :
                <Text style={styles.useTitle}>Không nằm trong quy hoạch</Text>
            }

            {/*<TouchableOpacity onPress={this.onNotePress}>*/}
            {/*    <Text style={styles.noteList}>Ghi chú {`( ${data.soghichu} )`}</Text>*/}
            {/*</TouchableOpacity>*/}
            <View {...panResponder.panHandlers} style={styles.animatedView} />
        </Animated.View>
    );
}



const styles = StyleSheet.create({
    container: (translateY) => ({
        backgroundColor: '#f1f1f1',
        borderColor: COLOR.border,
        paddingHorizontal: 16,
        paddingBottom: 16,
        position: 'absolute',
        bottom: 0,
        right: 0,
        left: 0,
        borderTopRightRadius: 12,
        borderTopLeftRadius: 12,
        transform: [{translateY}],
        overflow: 'hidden',
    }),
    headerRow: {
        flexDirection: POSITION.row,
        alignItems: POSITION.end,
        marginBottom: 5,
    },
    headerContent: {
        fontFamily: FONT.FontFamily,
        color: COLOR.gray,
        fontSize: 12,
        marginRight: 20,
    },
    areaTitle: {
        fontFamily: FONT.FontFamily,
        color: COLOR.darkBlue,
        fontSize: 16,
        fontWeight: FONT.Bold,
    },
    contentValue: {
        color: COLOR.black,
        fontSize: 16,
        fontWeight: FONT.Bold,
    },
    useTitle: {
        fontFamily: FONT.FontFamily,
        fontSize: 14,
        color: COLOR.darkGray,
        marginBottom: 3,
    },
    infoRow: {
        flexDirection: POSITION.row,
        alignItems: POSITION.center,
        marginBottom: 5,
    },
    addressTitle: {
        fontFamily: FONT.FontFamily,
        fontSize: 14,
        color: COLOR.black,
        flex: 1,
    },
    ownerView: {
        marginTop: 10,
        marginBottom: 10,
    },
    ownerName: {
        fontFamily: FONT.FontFamily,
        fontSize: 15,
        color: COLOR.black,
        flex: 1,
        fontWeight: FONT.Bold,
    },
    ownerAddress: {
        fontFamily: FONT.FontFamily,
        fontSize: 14,
        color: COLOR.darkGray,
    },
    noteList: {
        color: COLOR.blue,
        fontFamily: FONT.FontFamily,
        fontSize: 15,
        paddingVertical: 5,
        paddingTop: 12,
    },
    animatedView: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 200,
        backgroundColor:'transparent'
    },
    qhRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 3,
    },
    qhTitle: {
        fontFamily: FONT.FontFamily,
        fontSize: 14,
        color: COLOR.darkGray,
        flex: 1,
        marginLeft: 3
    }
});

export default MakerInfo;
