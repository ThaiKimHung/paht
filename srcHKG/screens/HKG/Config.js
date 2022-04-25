import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';


export default class Config extends Component {
    static navigationOptions = {
        drawerLabel: 'Config',
      };
    render() {
       return (
           <View style={styles.container}>
               <Text>Config</Text>
           </View>
       ); 
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
    //   justifyContent: 'center',
    //   alignItems: 'center',
      backgroundColor: '#D76252',
    }
  });
