import React, { Component, createRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Image, Alert } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { nstyles } from '../../../../../styles';
import { HeaderCom, HeaderCus, IsLoading } from '../../../../../components';
import Utils from '../../../../../app/Utils';
import { appConfig } from '../../../../../app/Config';
import { Images } from '../../../../images';
import { colors } from '../../../../../chat/styles';
import apis from '../../../../apis';
import { reText } from '../../../../../styles/size';
export default class AutocompleteMap extends Component {
    constructor(props) {
        super(props);
        this.callback = Utils.ngetParam(this, 'callback');
        this.state = {
            dataMap: [],
            input: '',
            isLoad: false
        }
        this.refLoad = createRef()
    };

    getListAddress = async () => {
        if (this.state.input) {
            this.setState({ isLoad: true })
            let res = await apis.ApiApp.getListAddressViettel(this.state.input)
            Utils.nlog('[LOG data list address', res)
            if (res && res.data && res.data.length != 0) {
                this.setState({ dataMap: res.data, isLoad: false })
            } else {
                this.setState({ dataMap: [], isLoad: false })
            }
        } else {
            this.setState({ dataMap: [] })
        }
    }


    _selectAdd = (data, details = null) => {
        this.callback(data, details);
        Utils.goback(this);
    }

    _goBack = () => {
        Utils.goback(this);
        // nthisBanDo_Root.checkAutoComplete = true;
    }

    ItemAddress = (item, index) => {
        return (
            <TouchableOpacity onPress={() => this.getDetails(item, index)} style={{ marginBottom: 5 }} key={item.placeId}>
                <View style={[nstyles.nstyles.shadow, { backgroundColor: colors.white, padding: 10, borderRadius: 5, flexDirection: 'row', alignItems: 'center' }]} >
                    <Image source={Images.icAddrress} style={nstyles.nstyles.nIcon20} resizeMode='contain' />
                    <Text style={{ fontSize: reText(13), color: 'gray', paddingHorizontal: 10, textAlign: 'justify', flex: 1 }}>{item.text}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    getDetails = async (item, index) => {
        this.refLoad.current.show()
        let res = await apis.ApiApp.getDetailsAddress(item.placeId)
        this.refLoad.current.hide()
        let results = {
            geometry: {
                location: { lat: appConfig.defaultRegion.latitude, lng: appConfig.defaultRegion.longitude }
            }
        }
        if (res && res.data) {
            const { geometry, properties } = res.data
            if (geometry.coordinates && geometry?.coordinates.length != 0 && (properties.full_address || properties.name)) {
                results = {
                    geometry: {
                        location: { lat: geometry.coordinates[1], lng: geometry.coordinates[0] }
                    }
                }
                this._selectAdd({ description: properties.full_address ? properties.full_address : properties.name ? properties.name : `${geometry.coordinates[1]}, ${geometry.coordinates[0]}` }, results)
            } else {
                Alert.alert('Thông báo', 'Lấy dữ liệu vị trí thất bại. Vui lòng tìm kiếm và chọn lại vị trí !')
            }

        } else {
            Alert.alert('Thông báo', 'Lấy dữ liệu vị trí thất bại. Vui lòng tìm kiếm và chọn lại vị trí !')
        }
    }



    render() {
        const { } = this.props;
        return (
            <View style={nstyles.nstyles.ncontainerX}>
                <HeaderCus
                    iconLeft={Images.icBack}
                    title={'Tìm kiếm địa chỉ'}
                    styleTitle={{ color: 'white' }}
                    onPressLeft={this._goBack}
                />
                {/* {useKeyMap: true cua viettel, false cuar google} */}
                {appConfig.useKeyMap ?
                    <View style={{ flex: 1 }}>
                        <TextInput
                            onChangeText={text => this.setState({ input: text }, this.getListAddress)}
                            value={this.state.input}
                            style={[nstyles.nstyles.shadow, { padding: 10, backgroundColor: colors.white, margin: 10, borderRadius: 5, }]}
                            placeholder={'Nhập ví trí cần tìm kiếm...'}
                        />
                        {
                            this.state.isLoad ?
                                <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'flex-start', margin: 10 }}>
                                    <ActivityIndicator size={'small'} />
                                    <Text style={{ fontSize: reText(12), color: colors.colorTextGray, paddingLeft: 10 }}>{'Đang tìm kiếm địa chỉ...'}</Text>
                                </View>
                                : null
                        }
                        <ScrollView style={{ padding: 10 }}>
                            {
                                this.state.dataMap.length > 0 ? this.state.dataMap.map((item, index) => {
                                    return this.ItemAddress(item, index)
                                })
                                    : <Text style={{ textAlign: 'center', fontSize: reText(12), color: colors.colorTextGray, }}>{'Không có dữ liệu...'}</Text>
                            }
                        </ScrollView>
                        <IsLoading ref={this.refLoad} />
                    </View>
                    :
                    <View style={nstyles.nstyles.nbody}>
                        <GooglePlacesAutocomplete
                            placeholder='Tìm kiếm'
                            minLength={2} // minimum length of text to search
                            autoFocus={true}
                            returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
                            keyboardAppearance={'light'} // Can be left out for default keyboardAppearance https://facebook.github.io/react-native/docs/textinput.html#keyboardappearance
                            listViewDisplayed='auto'    // true/false/undefined
                            fetchDetails={true}
                            // renderDescription={row => row.description} // custom description render
                            onPress={this._selectAdd}
                            getDefaultValue={() => ''}

                            query={{
                                // available options: https://developers.google.com/places/web-service/autocomplete
                                key: appConfig.apiKeyGoogle,
                                language: 'vi', // language of the results
                                types: 'address' // default: 'geocode'
                            }}

                            styles={{
                                textInputContainer: {
                                    width: '100%'
                                },
                                description: {
                                    fontWeight: 'bold'
                                },
                                predefinedPlacesDescription: {
                                    color: '#1faadb'
                                },
                                container: { backgroundColor: 'rgba(255,255,255,0.6)' },
                                poweredContainer: { backgroundColor: 'transparent' },
                            }}

                            // currentLocation={true} // Will add a 'Current location' button at the top of the predefined places list
                            // currentLocationLabel="Vị trí hiện tại"
                            nearbyPlacesAPI='GooglePlacesSearch' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
                            GoogleReverseGeocodingQuery={{
                                // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
                            }}
                            GooglePlacesSearchQuery={{
                                // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
                                rankby: 'distance',
                                type: 'cafe'
                            }}

                            GooglePlacesDetailsQuery={{
                                // available options for GooglePlacesDetails API : https://developers.google.com/places/web-service/details
                                fields: 'geometry',
                            }}

                            filterReverseGeocodingByTypes={['street_address']} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
                            // predefinedPlaces={[homePlace, workPlace]}

                            debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
                            // renderLeftButton={() => <Image source={Images.icCamera} />}
                            renderRightButton={this._rightButton}

                        />
                    </View>
                }

            </View>
        );
    }
}