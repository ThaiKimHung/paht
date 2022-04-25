import React, {useEffect} from 'react';
import {
    View,
    StyleSheet,
    FlatList,
    Text,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import COLOR from '../../Styles/Colors';
import HeaderBar from '../UI/HeaderBar';
import PhotoView from "@merryjs/photo-viewer";
const photos = [
    {
        source: {
            uri:
                "https://images.pexels.com/photos/45170/kittens-cat-cat-puppy-rush-45170.jpeg?w=1260&h=750&auto=compress&cs=tinysrgb"
        },
        title: "Flash End-of-Life",
    },

    {
        source: {
            uri:
                "https://images.pexels.com/photos/142615/pexels-photo-142615.jpeg?w=1260&h=750&auto=compress&cs=tinysrgb"
        }
    },
    {
        source: {
            uri:
                "https://images.pexels.com/photos/82072/cat-82072.jpeg?w=1260&h=750&auto=compress&cs=tinysrgb"
        }
    },
    {
        source: {
            uri:
                "https://images.pexels.com/photos/248261/pexels-photo-248261.jpeg?w=1260&h=750&auto=compress&cs=tinysrgb"
        }
    },
    {
        source: {
            uri: "https://media.giphy.com/media/3o6vXWzHtGfMR3XoXu/giphy.gif"
        },
    }
];


class PhotoViewer extends React.PureComponent{

    state = {
        visible:true,
        initial:0
    };

    onClose = ()=>this.setState({visible:false});

    render()
    {
        return (
            <View style = {styles.container}>
                <HeaderBar
                    title = 'Hình ảnh'
                />
                <PhotoView
                    visible={this.state.visible}
                    data={photos}
                    hideStatusBar={true}
                    initial={this.state.initial}
                    onDismiss={this.onClose}
                />
            </View>
        )
    }
}

export default PhotoViewer;


const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:COLOR.white
    }
});
