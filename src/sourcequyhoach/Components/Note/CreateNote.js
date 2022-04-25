import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    FlatList,
    Text,
    TouchableOpacity, Alert,
    TextInput,
    Keyboard,
    Dimensions,
    ScrollView,
    Image,TouchableWithoutFeedback
} from 'react-native';
import COLOR from '../../Styles/Colors';
import FONT from '../../Styles/Font';
import POSITION from '../../Styles/Position';
import HeaderBar from '../UI/HeaderBar';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ImagePicker from 'react-native-image-picker';
import {BaseButton} from '../UI/Button';
import {uploadImage,createNote} from '../../Containers/Note';
import Icon2 from 'react-native-vector-icons/Ionicons';
import moment from 'moment';

const CELL_SIZE = (Dimensions.get('window').width/6) - 10;

const options = {
    title: 'Chọn ảnh đính kèm',
    storageOptions: {
        skipBackup: true,
        path: 'images',
    },
    cancelButtonTitle:'Hủy bỏ',
    takePhotoButtonTitle:'Chụp ảnh',
    chooseFromLibraryButtonTitle:'Chọn ảnh từ thư viện'
};


export default class CreateNote extends Component<{}> {

    state = {
        editable:false,
        noteContent:'',
        imageAdd:[]
    };

    onUploadImageByThuaDat = (payload)=>
    {
        this.setState({statusCode:'loading'});
        let onSuccess = (statusCode,response)=>
        {
            if (statusCode === 200)
            {
                this.onCreateNote(response);

            }
            else
                Alert.alert(
                    'Thông báo',
                    'Đăng ảnh thất bại, xin vui lòng thử lại.',
                    [
                        {text: 'Đồng ý', onPress: () => this.onUploadImageByThuaDat(payload), style: 'cancel'},
                        {text: 'Hủy bỏ', onPress: () => this.setState({statusCode:200}), style: 'cancel'}
                    ],
                    {cancelable: false},
                );
        };
        uploadImage(payload,onSuccess)
    };

    onCreateNote = (payload)=>
    {
        this.setState({statusCode:'loading'});
        let onSuccess = (statusCode)=>
        {
            if (statusCode === 200)
            {
                this.props.route.params.reload();
                Alert.alert(
                    'Thông báo',
                    'Tạo ghi chú thành công.',
                    [
                        {text: 'Đồng ý', onPress: () => this.props.navigation.goBack(), style: 'cancel'}
                    ],
                    {cancelable: false},
                );
            }
            else
            {
                Alert.alert(
                    'Thông báo',
                    'Tạo ghi chú thất bại, xin vui lòng thử lại.',
                    [
                        {text: 'Đồng ý', onPress: () => this.onCreateNote(payload), style: 'cancel'},
                        {text: 'Hủy bỏ', onPress: () => this.setState({statusCode:200}), style: 'cancel'}
                    ],
                    {cancelable: false},
                );
            }
        };
        createNote(payload,onSuccess);
    };

    _onChangeNote = noteContent =>this.setState({noteContent});

    onImageAddButtonPress = ()=>
    {
        ImagePicker.showImagePicker(options, (response) => {

            if (!response.didCancel && !response.error && !response.customButton) {
                if (!response.fileName)
                {
                    let type = response.type.split('/')[1],
                        fileName = moment().valueOf() + "." + type;
                    response = {
                        ...response,
                        fileName
                    }
                }
                response = {
                    filename:response.fileName,
                    data:response.data,
                    type:response.type,
                    name:response.fileName.replace('.','')
                };
                this.setState({
                    imageAdd:[...this.state.imageAdd,response]
                })
            }
        })
    };

    onImageRemove = (index)=>()=>
    {
        this.setState({imageAdd:this.state.imageAdd.filter((_,i)=>i !== index)});
    };

    onDonePress = ()=>
    {
        Keyboard.dismiss();
        let {noteContent,imageAdd} = this.state;
        if (noteContent || imageAdd.length)
        {
            let {madvhc,soto,sothua,tendaydu} = this.props.route.params,
                payload = {
                    fullname:tendaydu,
                    type:'0',
                    objectid:'',
                    kvhcid:madvhc,
                    sothua,
                    soto,
                    tyle:'',
                    noidung:noteContent,
                    urlImage:imageAdd
                };
            if (imageAdd.length)
                this.onUploadImageByThuaDat(payload);
            else
            {
                payload = {
                    ...payload,
                    urlImage:''
                };
                this.onCreateNote(payload);
            }
        }
        else
        {
            Alert.alert(
                'Thông báo',
                'Vui lòng nhập đầy đủ nội dung ghi chú',
                [
                    {text: 'Đồng ý', onPress: () => {}, style: 'cancel'}
                ],
                {cancelable: false},
            );
        }
    };


    render() {
        let {editable,statusCode} = this.state,
            disabled = statusCode === 'loading';
        return (
            <View style = {styles.container}>
                <HeaderBar
                    menuRight = {editable}
                    rightMenuPress = {this.onCreateNavigatePress}
                    title = 'Tạo ghi chú'
                    isLoading = {statusCode === 'loading'}
                />
                <ScrollView>
                    <View style = {{paddingHorizontal:16}}>
                        <Text style = {styles.title}>Nội dung ghi chú</Text>
                        <TextInput
                            style={styles.input }
                            onChangeText={this._onChangeNote}
                            value={this.state.noteContent}
                            multiline
                            placeholder={'Nhập nội dung ghi chú cho thửa đất'}
                            returnKeyType = 'done'
                            editable = {!disabled}
                        />
                        <View style = {styles.divide}/>
                        <Text style = {styles.title}>Hình ảnh hiện trường</Text>
                        <View style={styles.imageRow}>
                            {this.state.imageAdd.map((e,i)=>(
                                <ImageBox
                                    key = {i.toString()}
                                    data = {e.data}
                                    disabled = {disabled}
                                    onRemove = {this.onImageRemove(i)}
                                />
                            ))}

                            <ButtonAddImage
                                onPress = {this.onImageAddButtonPress}
                                disabled = {disabled}
                            />
                        </View>
                    </View>
                    <View style = {{height:260}}/>
                </ScrollView>
                <BaseButton
                    title='Tạo mới'
                    disabled = {disabled}
                    onPress = {this.onDonePress}
                />
            </View>
        );
    }
}

const ButtonAddImage = props =>
{
    return (
        <TouchableOpacity
            style = {styles.imageView}
            onPress = {props.onPress}
            disabled = {props.disabled}
        >
            <Icon name = 'add' size={30} color={COLOR.darkGray}/>
        </TouchableOpacity>
    )
};

const ImageBox = props =>
{
    return (
        <View style = {styles.imageView}>
            <Image
                style={styles.image}
                source={{
                    uri:
                        'data:image/png;base64,' + props.data,
                }}
            />
            <TouchableWithoutFeedback onPress = {props.onRemove}>
                <View style = {styles.removeImage}>
                    <Icon2 name='ios-close' style={styles.removeIcon}/>
                </View>
            </TouchableWithoutFeedback>

        </View>
    )
};


const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:COLOR.white
    },
    title:{
        fontFamily:FONT.FontFamily,
        fontSize:15,
        color:COLOR.darkGray,
        marginBottom:10,
        marginTop:20
    },
    input:{
        padding:0,
        fontFamily:FONT.FontFamily,
        fontSize:16,
        color: COLOR.black,
        paddingBottom:20
    },
    divide:{
        height:1,
        backgroundColor: COLOR.border
    },
    imageRow:{
        flexDirection:POSITION.row,
        flexWrap:'wrap'
    },
    imageView:{
        height: CELL_SIZE,
        width:CELL_SIZE,
        justifyContent:POSITION.center,
        alignItems:POSITION.center,
        backgroundColor:COLOR.whiteGray,
        margin:5,
        borderRadius:5,
        overflow:'hidden'
    },
    image:{
        height: CELL_SIZE,
        width:CELL_SIZE,
    },
    removeImage:{
        height: CELL_SIZE/2,
        width:CELL_SIZE/2,
        position:'absolute',
        justifyContent:POSITION.start,
        alignItems:POSITION.end,
        top:0,
        right:0,
        paddingRight:6
    },
    removeIcon:{
        color:COLOR.white,
        fontSize:26,
        textShadowColor: 'rgba(0, 0, 0, 0.65)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 10,
        marginTop: -3
    }
});
