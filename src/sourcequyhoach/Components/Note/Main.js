import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    FlatList,
    Text,
    TouchableOpacity, Alert,
} from 'react-native';
import COLOR from '../../Styles/Colors';
import FONT from '../../Styles/Font';
import POSITION from '../../Styles/Position';
import {checkPermissionAddNote, loadListNoteByAccount, loadListNoteByThuaDat, removeNote} from '../../Containers/Note';
import {EmptyComponent} from '../Search/ResultBanner';
import HeaderBar from '../UI/HeaderBar';
//import PhotoView from '@merryjs/photo-viewer';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'


export default class Main extends Component<{}> {

    state = {
        editable:false,
        statusCode:200,
        dataList:[],
        showImage:false,
        imageReview:[],
        isManagerNote:this.props.route.name === 'ManageNote'
    };

    componentDidMount(): void {
        if (this.state.isManagerNote)
        {
            this.onLoadListNoteByAccount();
        }
        else
        {
            this.onCheckPermissionAddNote();
            this.onLoadListNoteByThuaDat();
        }

    }

    onLoadListNoteByAccount = ()=>
    {
        let onSuccess = (statusCode,response)=>
        {
            if (statusCode === 200)
                this.setState({statusCode,dataList:response});
            else
                this.setState({statusCode});
        };
        loadListNoteByAccount(onSuccess)
    };

    onLoadListNoteByThuaDat = ()=>
    {
        let {MADVHC,SOTO,SOTHUA} = this.props.route.params.thuatDat,
            payload = {
                "soto":SOTO,
                "sothua":SOTHUA,
                "madvhc":MADVHC
            },
            onSuccess = (statusCode,response)=>
            {
                if (statusCode === 200)
                    this.setState({statusCode,dataList:response});
                else
                    this.setState({statusCode});
            };
        loadListNoteByThuaDat(payload,onSuccess)
    };

    onCheckPermissionAddNote =()=>
    {
        let onSuccess = (statusCode,response)=>
        {
            this.setState({editable:response});
        },
            {tendangnhap} = this.props.route.params.dataUser;
        checkPermissionAddNote(tendangnhap,onSuccess);
    };

    onRemoveFromDatabase = (idNote)=>
    {
        this.setState({statusCode:'loading'});
        let onSuccess = (statusCode)=>
        {
            if (statusCode === 200)
            {
                this.setState({statusCode:200});
                if (this.state.isManagerNote)
                    this.onLoadListNoteByAccount();
                else
                {
                    this.onLoadListNoteByThuaDat();
                    this.props.route.params.reloadGhiChu();
                }

                Alert.alert(
                    'Th??ng b??o',
                    'X??a th??nh c??ng',
                    [
                        {text: '?????ng ??', onPress: () => {}, style: 'cancel'}
                    ],
                    {cancelable: false},
                );
            }
            else
                Alert.alert(
                    'Th???t b???i',
                    'Kh??ng th??? x??a ghi ch?? v??o l??c n??y. Xin vui l??ng th??? l???i.',
                    [
                        {text: 'Th??? l???i', onPress: () => this.onRemoveFromDatabase(idNote)},
                        {text: 'Huy b???', onPress: () => this.setState({statusCode:200}), style: 'cancel'}
                    ],
                    {cancelable: false},
                );
        };
        removeNote(idNote,onSuccess);
    };

    onCreateNavigatePress = ()=>
    {
        let {MADVHC,SOTO,SOTHUA} = this.props.route.params.thuatDat,
            {tendangnhap,tendaydu} = this.props.route.params.dataUser;
        this.props.navigation.navigate("CreateNote",{
            madvhc: MADVHC,
            soto:SOTO,
            sothua:SOTHUA,
            tendangnhap,
            tendaydu,
            reload:()=>{
                this.onLoadListNoteByThuaDat();
                this.props.route.params.reloadGhiChu();
            }
        });

    };

    onNoteImagePress = (item)=>()=>
    {
        let dataImage = item.noidung;
        dataImage = dataImage.map(e=>({
            source:{uri:e}
        }));
        this.setState({
            imageReview:dataImage,
            showImage:true
        })
    };

    onRemoveNotePress = (item)=>()=>
    {
        Alert.alert(
            'X??c nh???n',
            'B???n c?? mu???n x??a ghi ch?? n??y kh??ng ?',
            [
                {text: '?????ng ??', onPress: () => this.onRemoveFromDatabase(item.IdGhiChu), style: 'cancel'},
                {text: 'H???y b???', onPress: () => {}, style: 'cancel'}
            ],
            {cancelable: false},
        );
    };

    onImageReviewerClose = ()=> this.setState({showImage:false,imageReview:[]});

    onNavigateToThuaDat = (data)=>()=>
    {
        let payload = {
            SOTO:data.SoTo,
            SOTHUA:data.SoThua,
            MADVHC:data.MaDVHC.toString()
        };
        this.props.route.params.onShowInfo(payload);
        this.props.navigation.goBack();
    };


    _keyExtractor = (_,index)=>index.toString();

    _renderItem = ({item,index})=>(
        <NoteItem
            item = {item}
            onNoteImagePress = {this.onNoteImagePress(item)}
            disabled = {this.state.statusCode === 'loading'}
            onRemovePress = {this.onRemoveNotePress(item)}
            showAddress = {this.state.isManagerNote}
            onAddressPress = {this.onNavigateToThuaDat(item)}
        />
    );

    render() {
        let {editable,statusCode,isManagerNote} = this.state;
        return (
            <View style = {styles.container}>
                {/* <PhotoView
                    visible={this.state.showImage}
                    data={this.state.imageReview}
                    hideStatusBar={true}
                    initial={0}
                    onDismiss={this.onImageReviewerClose}
                /> */}
                <HeaderBar
                    menuRight = {editable}
                    rightMenuPress = {this.onCreateNavigatePress}
                    title = {isManagerNote ? 'Qu???n l?? ghi ch??' : 'Ghi ch??'}
                    isLoading = {statusCode === 'loading'}
                />
                <FlatList
                    data={this.state.dataList}
                    renderItem={this._renderItem}
                    keyExtractor={this._keyExtractor}
                    ListEmptyComponent = {
                        <EmptyComponent
                            isLoading = {statusCode === 'loading'}
                            isFailed = {statusCode !== 'loading' && statusCode !== 200}
                            onReload = {this.onCreateNavigatePress}
                        />
                    }
                />
            </View>
        );
    }

}

export const NoteItem = props =>
{
    return (
        <View style = {styles.noteItemContainer}>
            <View style={styles.row}>
                <View style = {{flex:1}}>
                    {!props.showAddress ? <Text style={styles.createNote}>{props.item.WriterFullName}</Text> : null}
                    <Text style={styles.createDate}>{props.item.thoigian}</Text>
                    {props.showAddress ? <Text style={styles.address} onPress={props.onAddressPress}>T??? {props.item.SoTo}, th???a {props.item.SoThua}, {props.item.Ten}</Text> : null}
                </View>
                {props.item.isTrueCreator ?
                    <TouchableOpacity
                        style ={styles.buttonRemove}
                        onPress = {props.onRemovePress}
                    >
                        <Icon name ='trash-can-outline' size={20} color={COLOR.darkGray}/>
                    </TouchableOpacity>
                    : null
                }
            </View>
            {props.item.type === 1 ?
                <Text style = {styles.noteContent}>
                    <Text disabled={props.disabled} onPress={props.onNoteImagePress} style={{color:COLOR.blue}}>C?? {props.item.noidung.length} h??nh ???nh </Text>
                    ???????c ????nh k??m</Text>
                :
                <Text style = {styles.noteContent}>{props.item.NoiDung}</Text>
            }
            <View style={styles.divineHorizontal}/>
        </View>
    )
};


const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:COLOR.white
    },
    noteItemContainer:{
        paddingHorizontal: 16,
        paddingTop: 16
    },
    row:{
        flexDirection: POSITION.row,
        alignItems:POSITION.center
    },
    createNote:{
        fontFamily:FONT.FontFamily,
        fontSize:16,
        color:COLOR.black,
        fontWeight: FONT.Bold,
        flex:1
    },
    createDate:{
        fontFamily:FONT.FontFamily,
        fontSize:14,
        color:COLOR.darkGray,
        marginTop:5,
    },
    address:{
        fontFamily:FONT.FontFamily,
        fontSize:14,
        color:COLOR.blue,
        marginTop:5,
        marginBottom:10
    },
    noteContent:{
        fontSize:15,
        color:COLOR.black,
        fontFamily:FONT.FontFamily,
        marginBottom: 20
    },
    divineHorizontal:{
        height:1,
        backgroundColor:COLOR.border
    },
    buttonRemove:{
        marginRight:-10,
        width:30,
        height:30,
        justifyContent:POSITION.center,
        alignItems: POSITION.center,
    }
});
