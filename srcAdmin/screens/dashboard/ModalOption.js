

import React, { useState, useEffect, Component } from 'react'

import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import Utils from '../../../app/Utils';
import { nstyles, colors, sizes } from '../../../styles';
import { IsLoading } from '../../../components';
import DatePicker from 'react-native-datepicker';
import ButtonCus from '../../../components/ComponentApps/ButtonCus';
import momment from 'moment'
import { reText } from '../../../styles/size';


const ModalOption = (props) => {
    const [dateForm, setdateForm] = useState(momment(new Date()).add(-15, 'days').format('DD/MM/YYYY'));
    const [dateTo, setdateTo] = useState(momment(new Date()).format('DD/MM/YYYY'));
    const isUseDate = Utils.ngetParam({ props: props }, "isUseDate");
    const callBack = Utils.ngetParam({ props: props }, "callBack");
    const arrOption = [
        {
            id: 1,
            value: momment(new Date()).format('DD/MM/YYYY'),
            label: 'Hôm nay',

        },
        {
            id: 2,
            value: momment(new Date()).add(-15, 'days').format('DD/MM/YYYY'),
            label: '15 Ngày trước',

        },
        {
            id: 3,
            value: momment(new Date()).add(-30, 'days').format('DD/MM/YYYY'),
            label: '1 Tháng trước',

        },

    ]
    const goback = (Options = '') => {

        if (isUseDate == true) {
            if (callBack) {
                if (Options != '') {
                    callBack('', '', Options);
                } else {
                    callBack(dateForm, dateTo, '');
                }

            }
        } else {
            if (callBack) {
                callBack('', '', Options);
            }
        }
        Utils.goback({ props: props });
    }
    useEffect(() => {
        if (isUseDate == true) {
            // alert(1);
            setdateForm(Utils.ngetParam({ props: props }, "dateForm"))
            setdateTo(Utils.ngetParam({ props: props }, "dateTo"))
        }
    }, [])
    const randomColor = () => ('#' + ((Math.random() * 0xffffff) << 0).toString(16) + '000000').slice(0, 7);

    const onPressItem = (item) => {
        // alert(item.value);
        goback(item.value);
    }

    const TuNgay = (date) => {
        let ToDate = dateTo
        let FromDate = date;
        if (momment(FromDate, "DD/MM/YYYY").isAfter(momment(ToDate, "DD/MM/YYYY"))) {
            FromDate = ToDate
        }
        setdateForm(FromDate)
    }

    const DenNgay = (date) => {
        let FromDate = dateForm
        let ToDate = date;
        if (momment(ToDate, "DD/MM/YYYY").isBefore(momment(FromDate, "DD/MM/YYYY"))) {
            ToDate = FromDate
        }
        setdateTo(ToDate)
    }
    return (
        <View style={[{ flex: 1, justifyContent: 'center', alignItems: 'center', }]} >
            <View style={{
                position: 'absolute', left: 0, top: 0, bottom: 0,
                right: 0, flex: 1, backgroundColor: colors.black_50,
                alignItems: 'center',
            }} onTouchEnd={() => goback('')} />
            <View style={{
                backgroundColor: colors.white,
                marginHorizontal: 40,
                alignItems: 'center', width: '100%',
                justifyContent: 'center', paddingBottom: 0, paddingHorizontal: 10
            }}>
                <View style={{ width: '100%', }}>
                    <View style={{ paddingVertical: 20 }} >
                        <Text style={{ fontSize: reText(20), textAlign: 'center', color: colors.colorHeaderApp, fontWeight: 'bold' }}>{'Bộ lọc'}</Text>
                        <Text style={{ fontSize: reText(14) }}>{'Chọn nhanh'}</Text>
                        <View style={[nstyles.nstyles.nrow, { padding: 10, borderBottomWidth: 2 }]}>
                            {/* <ButtonCus
                                stContainerR={{ flex: 1, backgroundColor: '#05ACD3', marginTop: 0, alignSelf: 'flex-start' }}
                                textTitle='Hôm nay'
                            // stText = {}
                            // onPressB={this.TongHopHomNay}
                            />
                            <ButtonCus
                                stContainerR={{ flex: 1, backgroundColor: '#76AF02', marginTop: 0, alignSelf: 'flex-start' }}
                                textTitle='15 Ngày trước'
                            // onPressB={this.TongHop30NgayTruoc}
                            />
                            <ButtonCus
                                stContainerR={{ flex: 1, backgroundColor: '#D9AC2A', marginTop: 0, alignSelf: 'flex-start' }}
                                textTitle='1 Tháng trước'
                            // onPressB={this.ChooseDate}
                            /> */}
                            <FlatList
                                showsHorizontalScrollIndicator={false}
                                data={arrOption}
                                horizontal
                                renderItem={({ item, index }) => {
                                    return (<ButtonCus
                                        stContainerR={{ flex: 1, backgroundColor: randomColor(), marginTop: 0, alignSelf: 'flex-start' }}
                                        textTitle={item.label}
                                        onPressB={() => onPressItem(item)}
                                    />)
                                }}>

                            </FlatList>
                        </View>
                        <View style={[nstyles.nstyles.nrow, { height: 80 }]}>
                            <View style={{ flex: 1 }}>
                                <Text style={{ paddingVertical: 5 }}>Từ ngày</Text>
                                <DatePicker
                                    customStyles={{
                                        datePicker: {
                                            backgroundColor: '#d1d3d8',
                                            justifyContent: 'center'
                                        }
                                    }}
                                    locale={'vi'}
                                    date={dateForm}
                                    confirmBtnText={'Xác nhận'}
                                    cancelBtnText={'Hủy'}
                                    mode="date"
                                    placeholder="Chọn ngày"
                                    showIcon={false}
                                    format={'DD/MM/YYYY'}
                                    style={{ flex: 1, width: '100%' }}
                                    onDateChange={(date) => {
                                        TuNgay(date)
                                    }}
                                />
                            </View>
                            <View style={{ flex: 1, marginLeft: 5 }}>
                                <Text style={{ paddingVertical: 5 }}>Đến ngày</Text>
                                <DatePicker
                                    customStyles={{
                                        datePicker: {
                                            backgroundColor: '#d1d3d8',
                                            justifyContent: 'center'
                                        }
                                    }}
                                    locale={'vi'}
                                    date={dateTo}
                                    confirmBtnText={'Xác nhận'}
                                    cancelBtnText={'Hủy'}
                                    mode="date"
                                    placeholder="Chọn ngày"
                                    showIcon={false}
                                    format={'DD/MM/YYYY'}
                                    style={{ flex: 1, width: '100%' }}
                                    onDateChange={(date) => DenNgay(date)}
                                />
                            </View>
                        </View>
                        <TouchableOpacity onPress={() => goback('')} activeOpacity={0.5} style={{ backgroundColor: colors.colorHeaderApp, padding: 10, alignSelf: 'flex-end' }}>
                            <Text allowFontScaling={false} style={{ color: colors.white }}>{'Lọc kết quả'}</Text>
                        </TouchableOpacity>
                    </View>
                </View>

            </View>
            <IsLoading />
        </View >
    );

}
export default ModalOption
