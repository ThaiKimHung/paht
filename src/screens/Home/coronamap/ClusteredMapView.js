import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import {
    Platform,
    Dimensions,
    LayoutAnimation, Text
} from 'react-native'
// map-related libs
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps'
import SuperCluster from 'supercluster'
import GeoViewport from '@mapbox/geo-viewport'
// components / views
import ClusterMarker from './ClusterMarker'
// libs / utils
import {
    regionToBoundingBox,
    itemToGeoJSONFeature,
    getCoordinatesFromItem,
} from './util'

import Utils from '../../../../app/Utils'
import { nheight, nwidth } from '../../../../styles/styles'

export default class ClusteredMapView extends PureComponent {

    constructor(props) {
        super(props)
        this.state = {
            data: [], // helds renderable clusters and markers
            region: props.region || props.initialRegion, // helds current map region
        }
        this.isAndroid = Platform.OS === 'android'
        this.dimensions = [props.width, props.height]
        this.mapRef = this.mapRef.bind(this)
        this.onClusterPress = this.onClusterPress.bind(this)
        this.onRegionChangeComplete = this.onRegionChangeComplete.bind(this)
    }

    componentDidMount() {
        Utils.nlog("vao ditmount")
        const { isMultiTyle, dataType, data } = this.props;
        if (isMultiTyle) {
            this.clusterizeM(data, dataType)
        } else {
            this.clusterize(data)
        }

    }

    componentWillReceiveProps(nextProps) {
        Utils.nlog("vao componentWillReceiveProps")
        if (this.props.data !== nextProps.data) {
            const { isMultiTyle, dataType, data } = this.props;
            if (isMultiTyle) {
                this.clusterizeM(nextProps.data, dataType)
            } else {
                this.clusterize(data)
            }
        }
        // this.clusterize(nextProps.data)
    }
    componentWillUpdate(nextProps, nextState) {
        Utils.nlog("vao componentWillReceiveProps")
        if (!this.isAndroid && this.props.animateClusters && this.clustersChanged(nextState))
            LayoutAnimation.configureNext(this.props.layoutAnimationConf)
    }

    mapRef(ref) {
        this.mapview = ref
    }
    getMapRef() {
        return this.mapview
    }
    getClusteringEngineM = (index) => {
        return this.arrSuperCluster[index];
    }

    getClusteringEngine() {
        return this.index
    }

    clusterize(dataset) {
        this.index = new SuperCluster({ // eslint-disable-line new-cap
            extent: this.props.extent,
            minZoom: this.props.minZoom,
            maxZoom: this.props.maxZoom,
            radius: this.props.radius || (this.dimensions[0] * .045), // 4.5% of screen width
        })

        // get formatted GeoPoints for cluster
        const rawData = dataset.map(item => itemToGeoJSONFeature(item, this.props.accessor))

        // load geopoints into SuperCluster
        this.index.load(rawData)

        const data = this.getClusters(this.state.region)
        this.setState({ data })
    }
    clusterizeM(dataset = [], datatype) {
        Utils.nlog("vao clusSixeM")
        var { data = [] } = this.state;
        data.length = datatype.length
        this.arrSuperCluster = [];
        for (let index = 0; index < datatype.length; index++) {
            var element = datatype[index];
            this.arrSuperCluster[index] = new SuperCluster({ // eslint-disable-line new-cap
                extent: this.props.extent,
                minZoom: this.props.minZoom,
                maxZoom: this.props.maxZoom,
                radius: this.props.radius || (this.dimensions[0] * .045), // 4.5% of screen width
            })
            var dataType = dataset.filter(item => item.DoiLayNhiem == element.DoiLayNhiem);

            var rawData = dataType.map(item => itemToGeoJSONFeature(item, this.props.accessor));
            console.log("data row", rawData)
            this.arrSuperCluster[index].load(rawData)
            data[index] = this.getClustersM(this.state.region, index);
            Utils.nlog("gia tri dât index", data[index]);

        }
        Utils.nlog("data cua state", data)
        this.setState({ data });
    }

    clustersChanged(nextState) {
        return true;//this.state.data.length !== nextState.data.length
    }

    onRegionChangeComplete(region) {
        var { data } = this.state;
        Utils.nlog("gia tri data change complet", data)
        const { dataType } = this.props;
        for (let index = 0; index < dataType.length; index++) {
            data[index] = this.getClustersM(region, index);
            if (index == dataType.length - 1) {
                this.setState({ region, data: data }, () => Utils.nlog("gia tri data sau khi chảng complet", this.state.data))
                // this.setState({ region, data: data }, () => {
                //     Utils.nlog("gia tri data sau khi chảng complet", this.state.data)
                //     this.props.onRegionChangeComplete && this.props.onRegionChangeComplete(region, data)
                // })
            }
        }

    }

    getClusters(region) {
        const bbox = regionToBoundingBox(region),
            viewport = (region.longitudeDelta) >= 40 ? { zoom: this.props.minZoom } : GeoViewport.viewport(bbox, this.dimensions)

        return this.index.getClusters(bbox, viewport.zoom)
    }
    getClustersM(region, index) {
        const bbox = regionToBoundingBox(region),
            viewport = (region.longitudeDelta) >= 40 ? { zoom: this.props.minZoom } : GeoViewport.viewport(bbox, this.dimensions)

        return this.arrSuperCluster[index].getClusters(bbox, viewport.zoom)
    }


    // onClusterPress(cluster) {
    //     // cluster press behavior might be extremely custom.
    //     if (!this.props.preserveClusterPressBehavior) {
    //         this.props.onClusterPress && this.props.onClusterPress(cluster.properties.cluster_id)
    //         return
    //     }

    //     const children = this.index.getLeaves(cluster.properties.cluster_id, this.props.clusterPressMaxChildren)
    //     const markers = children.map(c => c.properties.item)

    //     const coordinates = markers.map(item => getCoordinatesFromItem(item, this.props.accessor, false))

    //     // fit right around them, considering edge padding
    //     this.mapview.fitToCoordinates(coordinates, { edgePadding: this.props.edgePadding })

    //     this.props.onClusterPress && this.props.onClusterPress(cluster.properties.cluster_id, markers)
    // }

    onClusterPress(cluster, index) {
        // cluster press behavior might be extremely custom.
        if (!this.props.preserveClusterPressBehavior) {
            this.props.onClusterPress && this.props.onClusterPress(cluster.properties.cluster_id)
            return
        }

        const children = this.arrSuperCluster[index].getLeaves(cluster.properties.cluster_id, this.props.clusterPressMaxChildren)
        const markers = children.map(c => c.properties.item)

        const coordinates = markers.map(item => getCoordinatesFromItem(item, this.props.accessor, false))

        // fit right around them, considering edge padding
        this.mapview.fitToCoordinates(coordinates, { edgePadding: this.props.edgePadding })

        this.props.onClusterPress && this.props.onClusterPress(cluster.properties.cluster_id, markers)
    }
    render() {
        const { style, ...props } = this.props
        console.log("data state của render mk", this.state.data)
        return (
            <MapView
                {...props}
                showsUserLocation={true}
                followUserLocation={true}
                provider={PROVIDER_GOOGLE}
                zoomEnabled={true}
                style={style}
                ref={this.mapRef}
                onRegionChangeComplete={this.onRegionChangeComplete}
            >
                {
                    this.props.clusteringEnabled && this.state.data.map((datarow, index) => {
                        return datarow.map((d) => {
                            Utils.nlog("gia tri d", d);
                            d.index = index;
                            if (d.properties.point_count === 0)
                                return this.props.renderMarker(d.properties.item)
                            return (
                                <ClusterMarker
                                    {...d}
                                    onPress={this.onClusterPress}
                                    renderCluster={this.props.renderCluster}
                                    key={`cluster-${d.properties.cluster_id}`} />
                            )
                            // return <View><Text>day la group</Text></View>
                        })

                    })
                }
                {
                    !this.props.clusteringEnabled && this.props.data.map(d => this.props.renderMarker(d))
                }
                {this.props.children}
            </MapView>
        )
    }
}

ClusteredMapView.defaultProps = {
    minZoom: 1,
    maxZoom: 20,
    extent: 512,
    accessor: 'location',
    animateClusters: true,
    clusteringEnabled: true,
    clusterPressMaxChildren: 100,
    preserveClusterPressBehavior: true,
    width: nwidth(),
    height: nheight(),
    layoutAnimationConf: LayoutAnimation.Presets.spring,
    edgePadding: { top: 10, left: 10, right: 10, bottom: 10 }
}

ClusteredMapView.propTypes = {
    ...MapView.propTypes,
    // number
    radius: PropTypes.number,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    extent: PropTypes.number.isRequired,
    minZoom: PropTypes.number.isRequired,
    maxZoom: PropTypes.number.isRequired,
    clusterPressMaxChildren: PropTypes.number.isRequired,
    // array
    data: PropTypes.array.isRequired,
    // func
    onExplode: PropTypes.func,
    onImplode: PropTypes.func,
    onClusterPress: PropTypes.func,
    renderMarker: PropTypes.func.isRequired,
    renderCluster: PropTypes.func.isRequired,
    // bool
    animateClusters: PropTypes.bool.isRequired,
    clusteringEnabled: PropTypes.bool.isRequired,
    preserveClusterPressBehavior: PropTypes.bool.isRequired,
    // object
    layoutAnimationConf: PropTypes.object,
    edgePadding: PropTypes.object.isRequired,
    // string
    // mutiple
    accessor: PropTypes.oneOfType([PropTypes.string, PropTypes.func])
}