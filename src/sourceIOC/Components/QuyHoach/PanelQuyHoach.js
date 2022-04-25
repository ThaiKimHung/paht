import React,{useEffect,useState} from 'react';
import {View,TouchableOpacity,Text,Animated} from 'react-native';
import {useDispatch,useSelector} from 'react-redux';
import COLOR from '../../Styles/Colors';
import POSITION from '../../Styles/Position';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Icon2 from 'react-native-vector-icons/Octicons';
import Icon3 from 'react-native-vector-icons/Ionicons';
import FONT from '../../Styles/Font';
import Animation from '../../Styles/Animation';
import Type from '../../Redux/Type';

const PanelQuyHoach = () =>
{
    const dispatch = useDispatch();
    const [animatedTranslateY] = useState(new Animated.Value(Animation.INFO_OFF.toValue));
    const {isActive,data} = useSelector(state=>state.panelQuyHoach);
    useEffect(()=>{
        if (isActive)
            Animated.spring(animatedTranslateY, {
                ...Animation.INFO_ON,
            }).start();
        else
            Animated.spring(animatedTranslateY, {
                ...Animation.INFO_OFF,
            }).start();

    },[isActive,animatedTranslateY,dispatch]);

    const onClosePress = ()=>{
        dispatch({type:Type.QUY_HOACH_PANEL.SET_SHOWING_OFF})
    }

    return (
        <Animated.View style={styles.container(animatedTranslateY)}>
            <View style={styles.topView}>
                <Text style={styles.topTitle}>Thông tin quy hoạch</Text>
                <TouchableOpacity onPress = {onClosePress}>
                    <Icon name='close' style={styles.topCloseIcon}/>
                </TouchableOpacity>
            </View>
            <View style={styles.bodyRow}>
                {data.geoType === 'polygon' ?
                    <Icon3 name='md-square' color={data.StokeColor} size={18}/>
                    :
                    <Icon name='timeline' color={data.StokeColor} size={25}/>
                }
                <View style = {styles.bodyTopContentView}>
                    <Text style={styles.bodyRowTitle}>{data.name}</Text>
                    {data.tenVung ?
                        <Text style={styles.zoneTitle}>{data.tenVung}</Text>
                        :null
                    }
                </View>
            </View>
            {data.QuyHoach ?
                <View>
                    <View style={styles.horizontalLine}/>
                    <View style={styles.bodyRow}>
                        <Icon name='map' color={COLOR.darkGray} size={16}/>
                        <View style = {styles.bodyTopContentView}>
                            <Text style={styles.bodyTopTitle}>Bản đồ quy hoạch</Text>
                            <Text style={styles.bodyTopContent}>{data.QuyHoach}</Text>
                        </View>
                    </View>
                </View>
                : null
            }
            {data.QuyetDinh ?
                <View>
                    <View style={styles.horizontalLine}/>
                    <View style={styles.bodyRow}>
                        <Icon2 name='law' color={COLOR.darkGray} size={16}/>
                        <View style = {styles.bodyTopContentView}>
                            <Text style={styles.bodyTopTitle}>Quyết định ban hành</Text>
                            <Text style={styles.bodyTopContent}>{data.QuyetDinh}</Text>
                        </View>
                    </View>
                </View>
                : null
            }
        </Animated.View>
    )
}

export default PanelQuyHoach;

const styles = {
    container: (translateY) => ({
        backgroundColor: '#f1f1f1',
        borderColor: COLOR.border,
        borderWidth:1,
        paddingBottom: 5,
        position: 'absolute',
        bottom: 6,
        right: 6,
        left: 6,
        borderRadius:12,
        transform: [{translateY}],
        overflow: 'hidden',
        zIndex:100
    }),
    topView:{
        flexDirection:POSITION.row,
        alignItems:POSITION.center,
    },
    topTitle:{
        fontFamily:FONT.FontFamily,
        fontWeight:FONT.Bold,
        color:COLOR.black,
        fontSize:14,
        marginHorizontal:12,
        flex:1
    },
    topCloseIcon:{
        fontSize: 18,
        margin:10,
        color:COLOR.black,
    },
    bodyView:{
        marginHorizontal: 12
    },
    bodyRow:{
        flexDirection:POSITION.row,
        marginHorizontal:12,
        marginVertical:8,
    },
    bodyRowTitle:{
        fontFamily:FONT.FontFamily,
        color:COLOR.black,
        fontSize:14,
    },
    horizontalLine:{
        height:1,
        backgroundColor:COLOR.border
    },
    bodyTopTitle:{
        fontFamily:FONT.FontFamily,
        color:COLOR.darkGray,
        fontSize:14,
        marginBottom:5
    },
    bodyTopContentView:{
        flex:1,
        marginLeft:10,
    },
    bodyTopContent:{
        fontFamily:FONT.FontFamily,
        color:COLOR.black,
        fontSize:14
    },
    zoneTitle:{
        fontFamily:FONT.FontFamily,
        color:COLOR.darkGray,
        fontSize:13,
    }

}
