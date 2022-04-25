import React, { Component } from 'react'
import { Text, View } from 'react-native'


import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import Entypo from 'react-native-vector-icons/dist/Entypo';
import EvilIcons from 'react-native-vector-icons/dist/EvilIcons';
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';
import Feather from 'react-native-vector-icons/dist/Feather';
import Fontisto from 'react-native-vector-icons/dist/Fontisto';
import Foundation from 'react-native-vector-icons/dist/Foundation';
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import MaterialIcons from 'react-native-vector-icons/dist/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import Octicons from 'react-native-vector-icons/dist/Octicons';
import Zocial from 'react-native-vector-icons/dist/Zocial';
import SimpleLineIcons from 'react-native-vector-icons/dist/SimpleLineIcons';

export const TypeIcon = {
    AntDesign: 'AntDesign',
    Entypo: 'Entypo',
    EvilIcons: 'EvilIcons',
    FontAwesome: 'FontAwesome',
    FontAwesome5: 'FontAwesome5',
    Feather: 'Feather',
    Fontisto: 'Fontisto',
    Foundation: 'Foundation',
    Ionicons: 'Ionicons',
    MaterialIcons: 'MaterialIcons',
    MaterialCommunityIcons: 'MaterialCommunityIcons',
    Octicons: 'Octicons',
    Zocial: 'Zocial',
    SimpleLineIcons: 'SimpleLineIcons',
}


class Icon extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { type = '', ...orther } = this.props
        switch (type) {
            case TypeIcon.AntDesign: {
                return <AntDesign {...orther} />
                break;
            }
            case TypeIcon.Entypo: {
                return <Entypo {...orther} />
                break;
            }
            case TypeIcon.EvilIcons: {
                return <EvilIcons {...orther} />
                break;
            }
            case TypeIcon.AntDesign: {
                return <FontAwesome {...orther} />
                break;
            }
            case TypeIcon.FontAwesome5: {
                return <FontAwesome5 {...orther} />
                break;
            }
            case TypeIcon.Feather: {
                return <Feather {...orther} />
                break;
            }
            case TypeIcon.Fontisto: {
                return <Fontisto {...orther} />
                break;
            }
            case TypeIcon.Foundation: {
                return <Foundation {...orther} />
                break;
            }
            case TypeIcon.Ionicons: {
                return <Ionicons {...orther} />
                break;
            }
            case TypeIcon.MaterialIcons: {
                return <MaterialIcons {...orther} />
                break;
            }
            case TypeIcon.MaterialCommunityIcons: {
                return <MaterialCommunityIcons {...orther} />
                break;
            }
            case TypeIcon.Octicons: {
                return <Octicons {...orther} />
                break;
            }
            case TypeIcon.Zocial: {
                return <Zocial {...orther} />
                break;
            }
            case TypeIcon.SimpleLineIcons: {
                return <SimpleLineIcons {...orther} />
                break;
            }
        }
    }
}

export default Icon
