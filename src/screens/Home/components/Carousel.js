
import React, { createRef } from 'react'
import { View, FlatList, StyleSheet, Animated } from 'react-native'
import Utils from '../../../../app/Utils';
import { colors } from '../../../../styles';
export default class Carousel extends FlatList {
    constructor(props) {
        super(props);
        this.currentIndex = 0;
        this.counterTime = 0;
        this.flatList = createRef();

    }
    componentDidMount() {
        if (this.props.autoPlay) {
            this.Fouces = this.props.navigation.addListener('didFocus', () => {//V3 # V5 chỗ này
                if (this.currentTimer === null) {
                    this._stop();
                    this.Start();
                }
            })
            this.Blur = this.props.navigation.addListener('didBlur', () => { //V3 # V5 chỗ này
                this._stop();
            })
        }
    }
    componentWillUnmount() {
        this.Fouces.remove(); //V3 # V5 chỗ này
        this.Blur.remove(); //V3 # V5 chỗ này
    }
    Start = () => {
        this.currentTimer = setInterval(() => {
            if (this.props.data && this.props.data.length >= 2)
                this.autoNextItem();
        }, 1000);
    }

    autoNextItem = () => {
        const { autotime = 5 } = this.props
        this.counterTime++;
        if (this.counterTime == autotime) { //-OK thực hiện công việc
            let indexTemp = this.currentIndex + 1;
            if (this.props.data && this.props.data.length > 0 && this?.flatList?.current) {
                this.flatList.current?.scrollToIndex({
                    index: indexTemp,
                    animated: indexTemp == 0 ? false : true,
                });
            }
        }
    };

    onViewableItemsChanged = ({ viewableItems, changed }) => {
        this.currentIndex = changed[0].index;
        this.counterTime = 0;
        if (this.currentIndex == this.props.data.length - 1)
            this.currentIndex = -1;
        // console.log(this.currentIndex)
    }

    _stop = () => {
        this.counterTime = 0;
        if (this.currentTimer) {
            clearInterval(this.currentTimer);
            this.currentTimer = null;
        }
    }
    render() {
        const {
            data,
            autoPlay = false,
            renderItem, paginationStyle = {},
            paginationStyleItem = {},
            showPagination = false,
            activeOpacity = false,
            paginationItem = [10, 20, 10],
            opacityItem = [0.3, 1, 0.3],
            widthBanner = 0,
        } = this.props
        let scrollX = new Animated.Value(0)
        let position = Animated.divide(scrollX, widthBanner) // custom dot view
        if (autoPlay) {
            this._stop();
            this.Start();
        }
        return (
            <View>
                <FlatList
                    ref={this.flatList}
                    data={data}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => index.toString()}
                    horizontal
                    pagingEnabled
                    snapToAlignment='center'
                    scrollEventThrottle={16}
                    decelerationRate={'fast'}
                    showsHorizontalScrollIndicator={false}
                    onViewableItemsChanged={this.onViewableItemsChanged}
                    viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
                    onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                        { useNativeDriver: false }
                    )}
                />
                {showPagination ? <View style={[styles.dotView, paginationStyle]}>
                    {data.map((_, i) => {
                        let opacity = position.interpolate(
                            {
                                inputRange: [i - 1, i, i + 1],
                                outputRange: opacityItem,
                                extrapolate: 'clamp',
                            })
                        let width = position.interpolate(
                            {
                                inputRange: [i - 1, i, i + 1],
                                outputRange: paginationItem,
                                extrapolate: 'clamp',
                            })
                        return (
                            <Animated.View
                                key={i}
                                style={
                                    {
                                        width, borderWidth: 1, borderColor: colors.grayLight,
                                        opacity: activeOpacity ? opacity : 1,
                                        height: 5,
                                        borderRadius: 7,
                                        backgroundColor: 'white',
                                        margin: 6, ...paginationStyleItem
                                    }}
                            />
                        )
                    })}
                </View> : null
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    dotView: {
        flexDirection: 'row',
        position: 'absolute',
        right: 10,
        bottom: 8,
    },
})

