import React, { Component } from 'react'
import { TouchableOpacity } from 'react-native'
import { Image } from 'react-native'
import { Text, View } from 'react-native'
import Utils from '../../../../app/Utils'
import { Images } from '../../../images'
import { colors } from '../../../../styles'
import { reText } from '../../../../styles/size'
import { nColors, nstyles } from '../../../../styles/styles'

export class ModalTTDonVi extends Component {
    constructor(props) {
        super(props)
        this.item = Utils.ngetParam(this, 'item')
        this.state = {

        }
    }

    goback = () => {
        Utils.goback(this);
    }
    render() {
        return (
            <View style={[nstyles.ncontainer, { backgroundColor: colors.backgroundModal, }]}>
                <View style={[nstyles.nbody, { justifyContent: 'center', alignItems: 'center' }]}>
                    <View style={{ backgroundColor: colors.white, paddingHorizontal: 70, paddingVertical: 20, borderRadius: 20 }}>
                        <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                            <Image source={Images.icKey} style={[nstyles.nIcon16, { tintColor: colors.waterBlue }]} />
                            <Text style={{ marginLeft: 10, fontSize: reText(14) }}>{`Đơn vị xử lý chính`}</Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Image source={Images.icHoTro} style={nstyles.nIcon16} />
                            <Text style={{ marginLeft: 10, fontSize: reText(14) }}>{`Đơn vị hỗ trợ xử lý`}</Text>
                        </View>
                        <TouchableOpacity onPress={() => this.goback()} style={{
                            alignSelf: 'center', padding: 10, paddingHorizontal: 25,
                            backgroundColor: nColors.main, borderRadius: 5, marginTop: 20
                        }}>
                            <Text style={{ color: colors.white, }}>{`Đóng`}</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </View>

        )
    }
}

export default ModalTTDonVi
