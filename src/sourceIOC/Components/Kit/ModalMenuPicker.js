import React from 'react';
import {Stack, Color, Fit, HeaderBarStatus, Text, ButtonColor, Font,Divider} from '../Kit';
import {StyleSheet,TouchableOpacity,FlatList,View,TextInput} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon2 from  'react-native-vector-icons/MaterialIcons';


const ModalMenuPicker = ({navigation,route}) =>
{
    const [textFilter, setTextFilter] = React.useState('');
    const [dataList, setDataList] = React.useState(route.params.dataList || [])
    const [isFocus, setFocus] = React.useState(false);
    const _onFocus = () => setFocus(true);
    const _onBlur = () => setFocus(false);
    const _renderItem = ({item,index})=>
    {
        return (
            <Item
                active = {item.key === route.params.selected}
                onPress = {onItemPress(item)}
                value={item.value}
            />
        )
    };

    const onItemPress = (item)=>()=>
    {
        let {preRouteName,routeState} = route.params;
        navigation.navigate(preRouteName,{
            value:item,
            routeState
        })
    };

    const onFilterChange = text=>
    {
        setTextFilter(text);
        setDataList(route.params.dataList.filter(e=>e.value.toLowerCase().indexOf(text.toLowerCase()) !== -1))
    }

    const _keyExtractor = (item)=>item.key.toString();

    return (
        <Stack flexFluid style={styles.container}>
            <HeaderBarStatus
                title = {route.params.title}
            />
            <View>
                <Stack horizontal verticalAlign = {Fit.center} style={styles.searchView}>
                    <Icon2 name={'search'} size={Font.xLarge}/>
                    <TextInput
                        style={styles.input}
                        onChangeText={onFilterChange}
                        value={textFilter}
                        placeholder={'Tìm kiếm'}
                        onFocus={_onFocus}
                        onBlur={_onBlur}
                    />
                </Stack>
                <View style = {styles.divider(isFocus)}/>
            </View>
            <FlatList
                keyExtractor = {_keyExtractor}
                data={dataList}
                renderItem={_renderItem}
            />
        </Stack>
    )
}

const Item = props =>
{
    return (
        <TouchableOpacity
            style = {styles.item(props.active)}
            disabled = {props.active}
            onPress = {props.onPress}
        >
            <Text style={styles.itemTitle(props.active)}>{props.value}</Text>
            {props.active ?
                <Icon name={'check'} size={Font.xLarge} color={Color.secondary}/>
                :
                null
            }

        </TouchableOpacity>
    )
}



export default ModalMenuPicker;

const styles = StyleSheet.create({
    container:{
        backgroundColor:Color.white
    },
    item:active=>({
        backgroundColor: active ? ButtonColor.smoothPrimary.backgroundColor : Color.transparent,
        flexDirection:Fit.row,
        alignItems:Fit.center,
        height:47,
        paddingHorizontal:21
    }),
    itemTitle:active=>({
        color:active ? Color.secondary : Color.black,
        flex:1
    }),
    searchView:{
        paddingHorizontal:16,
        paddingVertical:3
    },
    input:{
        height:42,
        padding:0,
        marginLeft:5,
        flex:1
    },
    divider:isFocus=>({
        height:isFocus ? 1.5 : 1,
        backgroundColor: isFocus ? Color.secondary : Color.gray30
    })
})


