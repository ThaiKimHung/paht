import React, { Fragment } from 'react';
import {
    TouchableOpacity, Text
} from 'react-native';
import Utils from '../../app/Utils';
import { RootLang } from '../../app/data/locales';
import DatePicker from 'react-native-datepicker'
export default class DatePickCus extends React.PureComponent {
    constructor(props) {
        super(props);
        this.valDef = props.value;
        this.show = this.show.bind(this);
        this.hide = this.hide.bind(this);
    }

    show() {
        this.datepick.onPressDate()
    }

    hide() {
        this.datepick.onPressCancel();
    }

    _onchangeDate = (date) => {
        this.valDef = date;
        const { onValueChange = () => { } } = this.props;
        onValueChange(date)
    }

    render() {
        let { style = {}, format, value, isVisible = false, minDate = '1900-01-01', maxDate = '2119-01-01' } = this.props;
        if (format == undefined) { // default
            format = 'll'; //en
            if (RootLang._keys == 'vi') format = 'DD/MM/YYYY'; //en
        };

        let isEmpty = false;
        if (this.valDef == '')
            isEmpty = true;
        if (value == '' || value == undefined)
            value = new Date();

        let displayVal = Utils.formatDate(value.toString(), format);


        return (
            <Fragment>
                <TouchableOpacity
                    disabled={isVisible}
                    style={!isVisible ? [{ justifyContent: 'center', alignItems: 'flex-start' }, style] : {}}
                    onPress={this.show}
                >
                    {
                        isVisible ? null :
                            <Text style={{ color: '#000', fontSize: style.fontSize, fontWeight: style.fontWeight, opacity: isEmpty ? 0.3 : 1 }}>
                                {isEmpty ? 'Ngày sinh' : displayVal}
                            </Text>
                    }

                </TouchableOpacity>
                <DatePicker
                    androidMode={'spinner'}
                    style={{ height: 0 }}
                    date={value}
                    mode="date"
                    placeholder=''
                    // format={format}
                    minDate={minDate}
                    maxDate={maxDate}
                    confirmBtnText="Confirm"
                    cancelBtnText="Cancel"
                    showIcon={false}
                    hideText
                    ref={ref => this.datepick = ref}
                    onDateChange={this._onchangeDate}
                />
            </Fragment>

        );
    }
}







