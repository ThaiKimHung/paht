import React, { Fragment } from 'react';
import {
    TouchableOpacity, Text, Image, View
} from 'react-native';
import DatePicker from 'react-native-datepicker'
import moment from 'moment';
import { colors, sizes } from '../styles';

import 'moment/locale/vi'
import { ImgComp } from './ImagesComponent';
import Utils from '../app/Utils';
import { nGlobalKeys } from '../app/keys/globalKey';
import AppCodeConfig from '../app/AppCodeConfig';
import { nstyles } from '../styles/styles';

export default class DatePick extends React.Component {
    constructor(props) {
        super(props);
        // this.valDef = props.value;
        this.show = this.show.bind(this);
        this.hide = this.hide.bind(this);
    }

    show() {
        this.datepick.onPressDate()
    }

    hide() {
        this.datepick.onPressCancel();
    }
    render() {
        let { style = {}, format, value, isVisible = false, ChonGio = false, Img, styleIcon } = this.props;
        let isEmpty = false;
        let locale = 'vi';
        let isChonGio = Utils.getGlobal(nGlobalKeys.IsChonGio, '', AppCodeConfig.APP_ADMIN);
        // let displayVal = Utils.formatDate(value.toString(), format);
        // Utils.nlog("gia tri val date", isChonGio)
        return (
            <Fragment>
                <TouchableOpacity
                    disabled={isVisible}
                    style={!isVisible ? [{ justifyContent: 'center', paddingLeft: 10, flexDirection: 'row' }, style] : {}}
                    onPress={this.show}>
                    {
                        isVisible ? null :
                            <Text style={{ color: style.color, flex: 1, fontSize: style.fontSize, fontWeight: style.fontWeight, opacity: isEmpty ? 0.3 : 1 }}>
                                {this.props.value ? moment(this.props.value, ChonGio ? 'HH:mm' : isChonGio ? 'YYYY-MM-DD HH:mm' : 'YYYY-MM-DD').format(ChonGio ? 'HH:mm' : isChonGio ? 'DD/MM/YYYY HH:mm' : 'DD/MM/YYYY') : this.props?.placeholder || 'Chọn ngày'}
                            </Text>
                    }

                    <Image source={Img ? Img : ImgComp.icCalendar} style={[nstyles.nIcon16, {
                        marginHorizontal: 10, tintColor: colors.colorGrayIcon
                    }, styleIcon]} />

                </TouchableOpacity>
                <DatePicker
                    locale={'vi'}
                    androidMode={'spinner'}
                    style={{ height: 0, width: 10 }}
                    date={this.props.value}
                    mode={ChonGio ? "time" : isChonGio ? "datetime" : "date"}
                    placeholder=''
                    // format={format}
                    confirmBtnText="Chấp nhận"
                    cancelBtnText="Thoát"
                    showIcon={false}
                    hideText
                    ref={ref => this.datepick = ref}
                    onDateChange={this.props.onValueChange}

                    customStyles={{
                        datePicker: {
                            backgroundColor: '#d1d3d8',
                            justifyContent: 'center'
                        }
                    }}
                />

            </Fragment>

        );
    }
}







