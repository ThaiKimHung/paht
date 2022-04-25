import React, { useState } from 'react'
import { View, Text, Image, TouchableOpacity } from 'react-native'
import { useSelector } from 'react-redux'
import { nGlobalKeys } from '../../../app/keys/globalKey'
import Utils from '../../../app/Utils'
import { colors } from '../../../styles'
import FontSize from '../../../styles/FontSize'
import { reText } from '../../../styles/size'
import { nstyles, Width } from '../../../styles/styles'
import { Images } from '../../images'

const InfoTiemChung = (props) => {
    const { userCD, tokenCD } = useSelector(state => state.auth)
    const [showInfo, setshowInfo] = useState(false)
    if (tokenCD && userCD.hasOwnProperty('TiemChung') && Utils.getGlobal(nGlobalKeys.isDichBenh, 'false') == 'true') {
        const TiemChung = userCD?.TiemChung
        let isTiemVaccine = 0
        if (TiemChung?.TenVaccineMui1) {
            isTiemVaccine = 1
        }
        if (TiemChung?.TenVaccineMui1 && TiemChung?.TenVaccineMui2) {
            isTiemVaccine = 2
        }
        return (
            <View>
                <TouchableOpacity onPress={() => { setshowInfo(!showInfo) }} style={{}}>
                    {/* <View style={{ backgroundColor: colors.BackgroundHome, height: FontSize.scale(5) }}></View> */}
                    <View style={{ borderRadius: 15, flexDirection: 'row', paddingVertical: 10, paddingHorizontal: 15, backgroundColor: isTiemVaccine == 0 ? colors.white : isTiemVaccine == 1 ? colors.yellowHCM : colors.blueHCM }}>
                        <Image source={isTiemVaccine == 0 ? Images.icChuaTiemChung : Images.icDaTiemChung} style={[isTiemVaccine != 0 ? { tintColor: colors.greenFE } : {}, nstyles.nIcon24]} resizeMode='contain' />
                        <Text style={{
                            alignSelf: 'center', flex: 1, marginLeft: 10, fontSize: reText(16), fontWeight: '600', color: isTiemVaccine == 0 ? colors.black : colors.greenFE
                        }}>{isTiemVaccine == 0 ? 'Chưa tiêm Vaccine' : isTiemVaccine == 1 ? 'Đã tiêm 01 mũi Vaccine' : 'Đã tiêm 02 mũi Vaccine'}</Text>
                        <Image source={Images.icOpenDetail} style={{ alignSelf: 'center', transform: [{ rotate: showInfo ? '90deg' : '0deg' }] }} />
                    </View>
                    {/* <View style={{ backgroundColor: colors.BackgroundHome, height: FontSize.scale(5) }}></View> */}
                </TouchableOpacity>
                {
                    showInfo && TiemChung?.TenVaccineMui1 ?
                        <>
                            <TextLine title={'Tên vaccine mũi 1'} value={TiemChung?.TenVaccineMui1} />
                            <TextLine title={'Số lô mũi 1'} value={TiemChung?.SoloMui1} />
                            <TextLine title={'Ngày tiêm mũi 1'} value={TiemChung?.NgayTiemMui1} />
                            <TextLine title={'Địa điểm tiêm mũi 1'} value={TiemChung?.DiaDiemTiemMui1} />
                            <View style={[{ backgroundColor: colors.black_10, height: 3 }, TiemChung?.TenVaccineMui2 ? { height: 2, marginHorizontal: 20 } : {}]} />
                        </>
                        : null
                }
                {
                    showInfo && TiemChung?.TenVaccineMui2 ?
                        <>
                            <TextLine title={'Tên vaccine mũi 2'} value={TiemChung?.TenVaccineMui2} />
                            <TextLine title={'Số lô mũi 2'} value={TiemChung?.SoloMui2} />
                            <TextLine title={'Ngày tiêm mũi 2'} value={TiemChung?.NgayTiemMui2} />
                            <TextLine title={'Địa điểm tiêm mũi 2'} value={TiemChung?.DiaDiemTiemMui2} />
                            <View style={{ backgroundColor: colors.black_10, height: 3 }} />
                        </>
                        : null
                }
                <View style={{ backgroundColor: colors.black_10, height: 0.5, marginHorizontal: 10 }} />
            </View>
        )
    } else {
        return null
    }
}

const TextLine = (props) => {
    let { title = '', value = '' } = props
    return (
        <View {...props} style={{ flexDirection: 'row', backgroundColor: colors.white, alignItems: 'center', padding: 3, paddingHorizontal: 10 }}>
            <Text style={{ fontWeight: 'bold', minWidth: Width(25), fontSize: reText(14) }}>{title}: </Text>
            <Text style={{ flex: 1, textAlign: 'right', paddingVertical: 8 }}>{value ? value : '-'}</Text>
        </View>
    )
}

export default InfoTiemChung
