
import React, { useRef, useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { HeaderCus, ButtonCom } from '../../../../components'
import { colors } from '../../../../styles'
import Utils, { icon_typeToast }from '../../../../app/Utils'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import FontSize from '../../../../styles/FontSize'
import dataHCM from './dataRender'
import { Images } from '../../../../srcAdmin/images'
import { getBottomSpace } from 'react-native-iphone-x-helper'
import ThongTinChungRender from './ThongTinChungRender'
import { useListDonVi } from './hook'
import apis from '../../../apis'

const DangKyNhanh = (props) => {
    const refTTCaNhan = useRef(null);
    const { data, refreshing, error } = useListDonVi();
    useEffect(() => {
        if (data && data.length > 0 && refTTCaNhan.current) {
            refTTCaNhan.current.setDataDropDown("donviid", data);
        }
    }, [data])
    Utils.nlog("data-------", data, refreshing, error);
    const onPressSubmid = async () => {
        let objectTTCN = refTTCaNhan.current.getData();
        Utils.nlog("res data-------[TH2]", objectTTCN);
        for (let index = 0; index < dataHCM.dataCongDan.length; index++) {
            const element = dataHCM.dataCongDan[index];
            if (element["checkNull"] == true && !objectTTCN[element['key']]) {
                Utils.showToastMsg("Thông báo", "Vui lòng kiểm tra điền đầy đủ thông tin cá nhân", icon_typeToast.warning);
                return;
            }
        }
        Utils.setToggleLoading(true)
        let res = await apis.ApiUser.DangKy_Smart({
            ...objectTTCN,
            ['donviid']: objectTTCN['donviid']['ID'] || ''
        });
        Utils.nlog("res data-------[TH3]", res);
        Utils.setToggleLoading(false)
        if (res.status == 1) {
            Utils.showToastMsg("Thông báo", "Đăng ký tài khoản thành công vui lòng đăng nhập", icon_typeToast.success);
            Utils.goback({ props: props })
        } else {
            Utils.showToastMsg("Thông báo", res.error ? res.error.message : "Thực hiện thất bại", icon_typeToast.warning);
        }

    }
    return (
        <View style={{ flex: 1, paddingBottom: getBottomSpace(), backgroundColor: colors.white, }}>
            <HeaderCus
                title={'ĐĂNG KÝ TÀI KHOẢN'}
                styleTitle={{ color: colors.white }}
                iconLeft={Images.icBack}
                Sleft={{ tintColor: colors.white }}
                onPressLeft={() => Utils.goback({ props })}
            />
            <KeyboardAwareScrollView>
                <View style={{
                    // paddingHorizontal: FontSize.scale(10),
                    paddingTop: FontSize.scale(10),
                    // backgroundColor: colors.blueGrey_20,
                    marginTop: FontSize.verticalScale(10)

                }}>
                    <ThongTinChungRender ref={refTTCaNhan} listCom={dataHCM.dataCongDan} isEdit={true} ></ThongTinChungRender>
                    <View style={{
                        padding: FontSize.scale(10),
                        flexDirection: 'row',
                    }}>
                        <ButtonCom
                            onPress={onPressSubmid}
                            sizeIcon={30}
                            txtStyle={{ color: colors.white }}
                            style={
                                {
                                    borderRadius: FontSize.scale(5),
                                    alignSelf: 'center',
                                    // backgroundColor: colors.blueFaceBook,
                                    flex: 1, padding: FontSize.scale(15),
                                    width: '100%'
                                }}
                            text={'ĐĂNG KÝ'}
                        />
                    </View>
                </View>

            </KeyboardAwareScrollView>
        </View>
    )
}

export default DangKyNhanh

const styles = StyleSheet.create({})
