import { View, Text } from 'react-native'
import React from 'react'

const DaLuuThueNha = (props) => {

    function renderFilter() {
        return <View>

        </View>
    }

    function renderListRaoVat() {   
        return <View>

        </View>
    }

    return (
        <View>
            {/* {render filter} */}
            {renderFilter()}
            {/* {render danh sách rao vặt} */}
            {renderListRaoVat()}
        </View>
    )
}

export default DaLuuThueNha