import React, { Component } from 'react';
import {
    Image, View, StyleSheet, Text, Platform, Alert,
     TouchableOpacity, Modal, Animated,Easing
} from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

const origin = {latitude: 37.3318456, longitude: -122.0296002,latitudeDelta: 0.5,longitudeDelta: 0.5};
const destination = {latitude: 37.771707, longitude: -122.4053769};
const GOOGLE_MAPS_APIKEY = 'AIzaSyAf6RgRY-h9bYagbSh1vXhjFvD-2iWFp_w';


export default class MapsDirection extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            region: {
                latitude: 10.764929, // kinh độ
                longitude: 106.697514, // vĩ độ
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
              },
        }
    }

    componentDidMount(){
      
    }
    
  
    //Menu popup More...
    render() {
        return (
            <View style={styles.container}>
                <MapView
                    provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                    style={styles.map}
                    initialRegion={origin}
                    showsUserLocation={true}
                >
                </MapView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        flex: 1
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    containerText:{
        paddingVertical:10,
        marginHorizontal: 10,
        flexDirection: 'column'
    },
    containerIcon:{
        flexDirection:'row',
    },
    iconDiscription:{
        width:25,
        height:25,
        marginRight:10
    },
    btnRating:{
        backgroundColor:'blue',
        borderRadius:15,
        paddingHorizontal:16,
        paddingVertical: 12,
        marginRight: 15
    },
    txtRating:{
        fontSize:16,
        color:'blue',
        marginRight: 20
    },
    btnBooking:{
        backgroundColor:'orange',
        paddingHorizontal:16,
        paddingVertical: 10,
        borderRadius:15,
    },
});


