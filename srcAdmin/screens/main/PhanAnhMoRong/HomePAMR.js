import React, { Component } from 'react'
import { Text, View } from 'react-native'
import { nstyles } from '../../../../styles/styles'
import { HeaderCom } from '../../../../components'
import { Images } from '../../../images'

export class HomePAMR extends Component {
    _openMenu = () => {
        this.props.navigation.openDrawer();
    }
    render() {
        return (
            <View style={nstyles.ncontainer}>
                <View
                    style={nstyles.nbody}>
                    <HeaderCom
                        titleText='Phản ánh mở rộng'
                        iconLeft={Images.icSlideMenu}
                        onPressLeft={this._openMenu}
                    />
                    {/* {} */}
                </View>
            </View>
        )
    }
}

export default HomePAMR
