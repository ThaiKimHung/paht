import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Image } from 'react-native';

export default class ImageScaled extends Component {
    constructor(props) {
        super(props);
        this.state = {source: {uri: this.props.uri}};
    }

    UNSAFE_componentWillMount() {
        Image.getSize(this.props.uri, (width, height) => {
            if (this.props.width && !this.props.height) {
                this.setState({width: this.props.width, height: height * (this.props.width / width)});
            } else if (!this.props.width && this.props.height) {
                this.setState({width: width * (this.props.height / height), height: this.props.height});
            } else {
                this.setState({width: width, height: height});
            }
        });
    }

    render() {
        return (
            <Image {...this.props} source={this.state.source} style={[{height: this.state.height, width: this.state.width},...this.props.style]}/>
        );
    }
}

ImageScaled.propTypes = {
    uri: PropTypes.string,
    width: PropTypes.number,
    height: PropTypes.number
};