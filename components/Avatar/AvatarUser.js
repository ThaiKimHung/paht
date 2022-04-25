import React, { Fragment } from 'react'
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native'
import { Images } from '../../src/images'
import { nstyles } from '../../styles/styles'
import PropTypes from 'prop-types'
import IconAntDesign from 'react-native-vector-icons/AntDesign';
import ImageCus from '../ImageCus'

const AvatarUser = (props) => {
    let { onEdit, style, styleIconEdit, componentEdit, defaultAvatar, uriAvatar, nameIcon, sizeIcon, colorIcon } = props
    return (
        <View style={[styles.style, style]}>
            <TouchableOpacity onPress={onEdit}>
                <ImageCus source={uriAvatar ? { uri: uriAvatar } : defaultAvatar} style={nstyles.nAva120} />
            </TouchableOpacity>
            <TouchableOpacity onPress={onEdit} activeOpacity={0.5} style={[styles.styleIconEdit, styleIconEdit]}>
                {
                    componentEdit ?
                        <Fragment>{componentEdit}</Fragment>
                        :
                        <IconAntDesign name={nameIcon} size={sizeIcon} color={colorIcon} />
                }
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    style: {
        alignSelf: 'center'
    },
    styleIconEdit: {
        backgroundColor: 'white',
        position: 'absolute',
        bottom: 10,
        right: 0,
        borderRadius: 30,
        padding: 5
    },
})

AvatarUser.propTypes = {
    style: PropTypes.object,
    defaultAvatar: PropTypes.any,
    styleIconEdit: PropTypes.object,
    onEdit: PropTypes.func,
    componentEdit: PropTypes.any,
    nameIcon: PropTypes.string,
    sizeIcon: PropTypes.number,
    colorIcon: PropTypes.string
}
AvatarUser.defaultProps = {
    style: {},
    defaultAvatar: Images.icUser,
    styleIconEdit: {},
    onEdit: () => { },
    componentEdit: '',
    nameIcon: 'edit',
    sizeIcon: 20,
    colorIcon: 'red'
};

export default AvatarUser
