import React from 'react';
import {View} from 'react-native';
import {EmptyImage} from './ImageSet';
import Loading from './Loading';

type Props = {
    isLoading?:boolean,
    isError?:boolean,
    isEmpty?:boolean,
    onTryPress?:any,
    height?:number
}


const Background = (props:Props) => {
    let {isLoading,isEmpty,isError} = props;

    return (
        (isLoading || isError || isEmpty) ?
            <View style = {styles.container(props.height)}>
                {isLoading ?
                    <Loading/>
                    :
                    isError ?
                        <EmptyImage
                            error
                            title='Xảy ra lỗi'
                            description='Hiện tại không thể kết nối đến máy chủ'
                            onTryPress={props.onTryPress}
                        />
                        :
                        isEmpty ?
                            <EmptyImage
                                title='Dự liệu trống'
                                description='Hiện tại máy chủ chưa sẳn sàng phục vụ'
                            />
                            :null
                }
            </View>
            : null
    );
};

export default Background;

const styles = {
    container:height=>({
        height:height || 380,
        backgroundColor:'#fff'
    })
};
