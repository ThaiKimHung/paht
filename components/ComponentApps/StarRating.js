
import React, { Component } from 'react';
import {
    Image, View, TouchableOpacity, Text
} from 'react-native';
import { sizes, reText } from '../../styles/size';
import PropType from 'prop-types'
import { nstyles, Width } from '../../styles/styles';
import { colors } from '../../styles';
import { ImgComp } from '../ImagesComponent';


/**
 * created by Dang Quang Dong
 * 02/07/2019
 */

const STAR_VALUE_DEFAULT = 5, EMPTY_STAR_VALUE_DEFAULT = 0
class StarRating extends Component {

    constructor(props) {
        super(props);
        var { starValue = STAR_VALUE_DEFAULT, emptyStarValue = EMPTY_STAR_VALUE_DEFAULT } = this.props;
        this.state = {
            starValue: starValue,
            emptyStarValue: emptyStarValue
        }
    }

    // Trả về số sao được đánh giá.
    starNumber = (index) => {
        var {
            onPress = () => { }
        } = this.props;
        var { starValue } = this.state;
        starValue = index + 1;

        this.setState({ starValue });
        onPress(starValue);
    }

    render() {
        var starList = [1, 2, 3, 4, 5];
        var textList = ['Quá tệ', 'Tệ', 'Bình thường', 'Tốt', 'Rất tốt'];
        const {
            starStyle = {},
            starSource = ImgComp.icStarReview,
            //===
            disabledTouch = true,

        } = this.props;

        var { starValue, emptyStarValue } = this.state;
        // Kiểm tra và gán số lượng vào mảng để render số ngôi sao.
        var numberStarShow = 0;
        if (emptyStarValue >= starValue) {
            numberStarShow = emptyStarValue > 0 ? emptyStarValue : 0;
        } else {
            numberStarShow = starValue > 0 ? starValue : 0;;
        }

        // Tăng hiệu năng hiển thị component, hạn chế duyệt for.
        if (numberStarShow >= STAR_VALUE_DEFAULT) {
            for (let i = STAR_VALUE_DEFAULT; i < numberStarShow; i++) {
                starList.push(i)
            }
        } else {
            for (let i = STAR_VALUE_DEFAULT; i > numberStarShow; i--) {
                starList.pop();
            }
        }

        var marginRight = starStyle.marginRight ? starStyle.marginRight : 20;
        var lastPosition = starList.length - 1;
        return (
            <View
                style={{
                    flexDirection: 'row', alignItems: 'center', paddingVertical: 2
                }}>
                {starList.map((item, index) =>
                    <TouchableOpacity
                        activeOpacity={0.7}
                        style={{ alignItems: 'center', width: 60 }}
                        key={index}
                        disabled={disabledTouch}
                        onPress={() => this.starNumber(index)}>
                        <Image
                            source={starSource}
                            resizeMode="contain"
                            style={[nstyles.nIcon35, {
                                ...starStyle
                            }, starValue >= index + 1 ? {} : { tintColor: colors.greyLight }]} />
                        <Text style={{ fontSize: reText(12), lineHeight: 20, letterSpacing: -0.12, marginTop: 6, fontWeight: '500' }}>{textList[index]}</Text>
                    </TouchableOpacity>
                )}
            </View>

        );
    }
}

StarRating.propTypes = {
    starValue: PropType.number.isRequired,
    disabledTouch: PropType.bool,
    onPress: PropType.func,
};

export default StarRating;