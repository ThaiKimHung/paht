import React from 'react';
import { Stack, Color, Text, Font } from '../Kit';
import DetailRow from '../Home/DetailRow';
import { useSelector } from 'react-redux';
import { getTongSoLieu } from '../../Containers/DichVuCong';
import { IReducerType } from '../../Interface/Reducer';
import Background from '../Kit/Background';
import { View } from 'react-native';


const PanelGeneral = () => {

    const { isLoading, isError, data, isEmpty } = useSelector(state => state.TongSoLieu);
    const option = useSelector((state: IReducerType) => state.Option.TypeOption); // 0 -> 4
    let heightValue = 380;
    const _render = () => {
        if (option != 4) {
            return (
                <View>
                    <DetailRow
                        leftTitle='Hồ sơ đã giải quyết'
                        leftIcon='check-all'
                        leftColor={Color.purple}
                        leftContent={data.DaGiaiQuyet}
                        rightTitle='Hồ sơ chưa giải quyết'
                        rightIcon='circle-half-full'
                        rightColor={Color.orange}
                        rightContent={data.ChuaGiaiQuyet}
                    />
                    <DetailRow
                        leftTitle='Chưa giải quyết quá hạn'
                        leftIcon='calendar-alert'
                        leftColor={Color.red}
                        leftContent={data.ChuaGiaiQuyetQuaHan}
                        rightTitle='Hồ sơ đã trả'
                        rightIcon='send-check-outline'
                        rightColor={Color.purple}
                        rightContent={data.DaTra}
                    />
                    <DetailRow
                        leftTitle='Hồ sơ tồn'
                        leftIcon='forward'
                        leftColor={Color.secondary}
                        leftContent={data.Ton}
                    />
                </View>
            );
        }
        else {
            return (
                <View>
                    <DetailRow
                        leftTitle='Hs mức độ 3 trực tiếp'
                        leftIcon='numeric-3-box'
                        leftColor={Color.yellow10}
                        leftContent={data.TiepNhanMucDo3}
                        rightTitle='Hs mức độ 4 trực tiếp'
                        rightIcon='numeric-4-box'
                        rightColor={Color.orange}
                        rightContent={data.TiepNhanMucDo4}
                    />
                    <DetailRow
                        leftTitle='Hs mức độ 3,4 nhận trực tuyến'
                        leftIcon='lan-connect'
                        leftColor={Color.green}
                        leftContent={data.TrucTuyen}
                        rightTitle='Tổng Hs mức độ 3,4 đã giải quyết'
                        rightIcon='check-all'
                        rightColor={Color.primary}
                        rightContent={data.DaGiaiQuyet34}
                    />
                </View>
            );
        }
    };

    if (isLoading || isError || isEmpty)
        return (
            <Background
                isEmpty={isEmpty}
                isError={isError}
                isLoading={isLoading}
                onTryPress={getTongSoLieu}
            />
        )

    return (
        <Stack style={option != 4 ? { minHeight: 380 } : { minHeight: 300 }}>
            <Stack style={{ marginBottom: 25 }}>
                <Text bold size={Font.xxxLarge} color={Color.cyan}
                    style={{ marginBottom: 3 }}>{data.TiepNhan}</Text>
                <Text color={Color.black} size={Font.mediumPlus} bold>{(option != 4 ? 'Tổng số hồ sơ tiếp nhận' : 'Tổng hồ sơ mức độ 3,4 tiếp nhận')}</Text>
            </Stack>
            {_render()}
        </Stack>
    );
};

export default PanelGeneral;

