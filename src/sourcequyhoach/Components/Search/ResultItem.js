import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import COLOR from '../../Styles/Colors';
import FONT from '../../Styles/Font';
import Icon from 'react-native-vector-icons/Entypo';
import { useDispatch } from 'react-redux';
// import {useNavigation} from '@react-navigation/native';
import Type from '../../Redux/Type';
import { onGetPolygonByToThua } from '../../Containers/HienTrang';
import { onShowOnPanel } from '../../Containers/PanelInfo';
import Utils from '../../../../app/Utils';


const SearchResultItem = ({ item }) => {

    const dispatch = useDispatch()
    // const navigation = useNavigation();

    const onResultItemPress = () => {
        dispatch({ type: Type.PANEL_INFO.DATA, value: item });
        let dataLoadPolygon = {
            SoTo: item.SOTO,
            SoThua: item.SOTHUA,
            MaDvhc: item.MADVHC,
            TenChu: '',
        };
        Utils.nlog("giá trị res réuild --------item", item)
        onGetPolygonByToThua(dataLoadPolygon);
        onShowOnPanel();
        Utils.BackStack();
        // navigation.goBack();
    }

    return (
        <View style={styles.cardView}>
            <TouchableOpacity onPress={onResultItemPress}>
                {item.Ten1 ?
                    <View>
                        <Text style={styles.cardOwner}>{item.Ten1}</Text>
                        <Text style={styles.ownerInfo}>
                            <Text style={{ fontWeight: FONT.Bold }}>{item.NamSinh1}</Text>
                            <Icon name="dot-single" size={18} />
                            <Text>{item.DiaChi1}</Text>
                        </Text>
                    </View>
                    : null
                }
                {item.Ten2 ? <Text style={styles.cardOwner}>{item.Ten2}</Text> : null}
                {item.Ten2 ?
                    <Text style={styles.ownerInfo}>
                        <Text style={{ fontWeight: FONT.Bold }}>{item.NamSinh2}</Text>
                        <Icon name="dot-single" size={18} />
                        <Text>{item.DiaChi2}</Text>
                    </Text>
                    : null
                }
                {item.Ten2 || item.Ten2 ? <View style={styles.cardDiv} /> : null}

                <Text style={styles.cardTitle}>Thông tin thửa đất</Text>
                <View style={{ flexDirection: 'row' }}>
                    <View style={styles.cardInfoView}>
                        <Text style={styles.cardInfoTitle}>TỜ</Text>
                        <Text style={styles.cardInfoContent}>{item.SOTO}</Text>
                    </View>
                    <View style={styles.cardInfoView}>
                        <Text style={styles.cardInfoTitle}>THỬA</Text>
                        <Text style={styles.cardInfoContent}>{item.SOTHUA}</Text>
                    </View>
                    <View style={{ flex: 1 }} />
                    <View style={{ ...styles.cardInfoView }}>
                        <Text style={styles.cardInfoTitle}>Diện tích</Text>
                        <Text numberOfLines={1} style={styles.cardInfoContent}>{item.DienTich} m2</Text>
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    );
}

export default SearchResultItem;


const styles = StyleSheet.create({
    cardView: {
        marginHorizontal: 10,
        marginBottom: 16,
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLOR.border,
    },
    cardTitle: {
        fontSize: 13,
        color: COLOR.darkGray,
        marginBottom: 10,
    },
    cardOwner: {
        fontSize: 15,
        color: COLOR.blue,
    },
    cardDiv: {
        height: 2, width: 120, backgroundColor: COLOR.border, marginBottom: 10,
    },
    cardInfoView: {
        padding: 10,
        paddingHorizontal: 10,
        borderRadius: 8,
        backgroundColor: COLOR.whiteGray,
        flexDirection: 'row',
        marginRight: 8,
    },
    cardInfoTitle: {
        fontSize: 11,
        color: COLOR.darkGray,
        marginRight: 8,
    },
    cardInfoContent: {
        fontSize: 11,
        color: COLOR.darkBlue,
        fontWeight: 'bold',
    },
    infoIcon: {
        fontSize: 14, marginRight: 10, color: COLOR.darkGray,
    },
    ownerInfo: {
        fontSize: 14,
        color: COLOR.darkGray,
        fontFamily: FONT.FontFamily,
        marginBottom: 16,
        lineHeight: 16,
        marginTop: 3,
    },
});
