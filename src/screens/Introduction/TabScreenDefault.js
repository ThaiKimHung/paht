import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { ListEmpty } from '../../../components';
import AutoHeightWebViewCus from '../../../components/AutoHeightWebViewCus';
import HtmlViewCom from '../../../components/HtmlView';
import { colors } from '../../../styles';

class TabScreenDefault extends Component {
    constructor(props) {
        super(props);
        this.state = {
            route: this.props.route,
            data: '',
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.data != prevState.data) {
            return {
                data: nextProps.data,
            }
        } else {
            return null
        }
    }

    render() {
        const { route, data } = this.state;
        return (
            <ScrollView style={stTabScreenDefault.container} contentContainerStyle={{ paddingBottom: 50 }}>
                {
                    data?.[route.KeyView] ? <AutoHeightWebViewCus
                        textLoading={'Đang tải...'}
                        source={{ html: data?.[route.KeyView] ? data?.[route.KeyView] : '<div></div>' }}
                    /> :
                        <ListEmpty textempty={'Không có dữ liệu'} isImage={true} />
                }
                {/* {View absoluteFillObject fix lỗi autohegit webview vuốt ngang không được}} */}
                <View style={{ ...StyleSheet.absoluteFillObject }} />
            </ScrollView>
        );
    }
}

const stTabScreenDefault = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
        paddingHorizontal: 13,
    },
})

export default TabScreenDefault;
