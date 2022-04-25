import React from 'react';
import {
    View,
    Text,
    TouchableOpacity, FlatList,
} from 'react-native';
import COLOR from '../../Styles/Colors';
import FONT from '../../Styles/Font';
import POSITION from '../../Styles/Position';
import HeaderModalBar from '../UI/HeaderModalBar';
import LocationData from './LocationData';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Dash from '../UI/Dash';
import { onMapMoveTo } from '../../Containers/MapView';
import Utils from '../../../../app/Utils';


const Location = () => {

    const [data] = React.useState(LocationData)

    const onLocationPress = (item) => () => {
        let payload = {
            longitude: item.longitude,
            latitude: item.latitude
        }
        onMapMoveTo(payload)
        Utils.BackStack();
    }

    const _renderItem = ({ item }) => {
        return (
            <LocationItem
                name={item.name}
                onPress={onLocationPress(item)}
            />
        )
    }

    const _keyExtractor = (item, index) => item.id.toString();

    return (
        <View style={styles.container}>
            <Dash />
            <HeaderModalBar
                title='Chuyển đến khu vực'
            />
            <View style={{ flex: 1 }}>
                <FlatList
                    contentContainerStyle={styles.flatListContainer}
                    data={data}
                    keyExtractor={_keyExtractor}
                    renderItem={_renderItem}
                    initialNumToRender={30}
                />
            </View>

        </View>
    );
};

const LocationItem = ({ name, onPress }) => {

    return (
        <TouchableOpacity onPress={onPress} style={styles.locationView}>
            <Icon name='location-pin' size={20} color={COLOR.grey} />
            <Text style={styles.locationTitle}>{name}</Text>
        </TouchableOpacity>
    )
}

export default Location;

const styles = {
    container: {
        flex: 1,
        backgroundColor: COLOR.white,
    },
    headerBar: {
        flexDirection: POSITION.row,
        alignItems: POSITION.center
    },
    flatListContainer: {
        paddingBottom: 20
    },
    locationView: {
        flexDirection: POSITION.row,
        alignItems: POSITION.center,
        paddingHorizontal: 12,
        height: 42,
        borderBottomWidth: 1,
        borderBottomColor: COLOR.border
    },
    locationTitle: {
        flex: 1,
        marginLeft: 10,
        fontFamily: FONT.FontFamily,
        fontSize: 15,
        color: COLOR.black,
    }
};
