import React, { Component } from 'react'
import { Text, View, ScrollView } from 'react-native'
import { AvatarUser } from '../../../../components'
import InfoUser from '../../../../srcAdmin/screens/main/InfoUser'
import { colors } from '../../../../styles'

export class InfoCanBo extends Component {
    render() {
        return (
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 150 }}>
                <InfoUser hideHeader={true} nthis={this.props.nthis} />
            </ScrollView>
        )
    }
}

export default InfoCanBo
