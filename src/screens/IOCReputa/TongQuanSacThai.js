import React, { useRef, useState, useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { BarChart, Grid, XAxis } from 'react-native-svg-charts'
import Utils from '../../../app/Utils'
import { colors } from '../../../styles'
import { reText } from '../../../styles/size'
import { Width } from '../../../styles/styles'
import apis from '../../apis'
import { Text as TextSVG } from 'react-native-svg'
import { IsLoading } from '../../../components'
const TongQuanSacThai = (props) => {
  const refLoading = useRef(null);
  // const [data, setData] = useState([])  //data tổng
  //Các biến truyền từ props
  const idTopic = props.idTopic ? props.idTopic : ''
  const dateFrom = props.dateFrom ? props.dateFrom : ''
  const dateTo = props.dateTo ? props.dateTo : ''
  //Data custom
  const [data, setData] = useState([])  //data tổng
  useEffect(() => {
    getDataNoiDungTH()
  }, [])

  useEffect(() => {
    getDataNoiDungTH()
  }, [props])

  const getDataNoiDungTH = async () => {
    refLoading.current.show()
    let res = await apis.ApiReputa.getNoiDungTH(idTopic, dateFrom, dateTo)
    if (res) {
      let positive_count = 0 //tích cực
      let neutral_count = 0 // trung lập
      let negative_count = 0 //tiêu cực
      res.news?.data?.map(val => {
        positive_count += val.positive_count
        neutral_count += val.neutral_count
        negative_count += val.negative_count
      })
      res.other?.data?.map(val => {
        positive_count += val.positive_count
        neutral_count += val.neutral_count
        negative_count += val.negative_count
      })
      res.socialComment?.data?.map(val => {
        positive_count += val.positive_count
        neutral_count += val.neutral_count
        negative_count += val.negative_count
      })
      res.socialPost?.data?.map(val => {
        positive_count += val.positive_count
        neutral_count += val.neutral_count
        negative_count += val.negative_count
      })
      let arrayChart = [
        {
          value: neutral_count,
          name: 'Trung lập',
          svg: {
            fill: '#DCE6E8',
            onPress: () => Utils.goscreen({ props: props }, 'Modal_DSChiTietThongKe',
              { title: 'Chi tiết trung lập', IdTopic: idTopic, fromdate: dateFrom, todate: dateTo, SacThai: [0], LoaiTinTuc: [] }),
          },
          key: `1`,
        },
        {
          value: negative_count,
          name: 'Tiêu cực',
          svg: {
            fill: '#DC5178',
            onPress: () => Utils.goscreen({ props: props }, 'Modal_DSChiTietThongKe',
              { title: 'Chi tiết tiêu cực', IdTopic: idTopic, fromdate: dateFrom, todate: dateTo, SacThai: [-1], LoaiTinTuc: [] }),
          },
          key: `2`,
        },
        {
          value: positive_count,
          name: 'Tích cực',
          svg: {
            fill: '#35A7C9',
            onPress: () => Utils.goscreen({ props: props }, 'Modal_DSChiTietThongKe',
              { title: 'Chi tiết tích cực', IdTopic: idTopic, fromdate: dateFrom, todate: dateTo, SacThai: [1], LoaiTinTuc: [] }),
          },
          key: `3`,
        }
      ]
      setData(arrayChart)
      refLoading.current.hide()
    }
    else {
      setData([])
      refLoading.current.hide()
    }
  }
  const Labels = ({ x, y, bandwidth, data }) => (

    data?.map((value, index) => {
      // Utils.nlog("VALUE:", value)
      return (<TextSVG
        key={index}
        x={x(value.value) - 20}
        // x={x(index) + (bandwidth / 2)}

        y={y(index) + (bandwidth / 2)}
        fontSize={reText(16)}
        fill={colors.black_50}
        alignmentBaseline={'middle'}
        textAnchor={'middle'}
      >
        {/* {value.SoLuong && value.SoLuong > 0 ? value.SoLuong : '100'} */}
        {value.value}
      </TextSVG>)
    }))

  // onPress: () => Utils.goscreen({ props: props }, 'Modal_DSChiTietThongKe', {
  //     title: 'News Search',
  //     AllThaoTac: dataNewSearch, ViewItem: item => _ViewItem(item, 'name'), Search: true, key: 'name'
  // })

  return (
    <View style={styles.container}>
      <Text style={styles.Title}>TỔNG QUAN VỀ SẮC THÁI</Text>
      <View style={{ height: 200, paddingHorizontal: 20 }}>
        <BarChart style={{ flex: 1, height: '100%', width: '100%', alignSelf: 'flex-end' }}
          data={data}
          horizontal={true}
          formatLabel={"Biểu đồ nhé"}
          yAccessor={({ item }) => item.value}
          gridMin={0}
          // svg={{ fill }}
          contentInset={{ top: 30, bottom: 10 }}>
          <Grid direction={Grid.Direction.VERTICAL} />
          <Labels />
        </BarChart>
      </View>
      <View style={styles.stChuThich}>
        <Text style={styles.chuthich}>Chú thích:</Text>
        <View style={{ flexDirection: 'row' }}>
          <View style={{ width: 10, height: 10, backgroundColor: '#DCE6E8', marginLeft: 5 }} />
          <Text style={styles.textChuThich}> Trung lập</Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <View style={{ width: 10, height: 10, backgroundColor: '#DC5178', marginLeft: 10 }} />
          <Text style={styles.textChuThich}> Tích cực</Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <View style={{ width: 10, height: 10, backgroundColor: '#35A7C9', marginLeft: 10 }} />
          <Text style={styles.textChuThich}> Tiêu cực</Text>
        </View>

      </View>
      <IsLoading ref={refLoading} />
    </View>
  )
}

export default TongQuanSacThai

const styles = StyleSheet.create({
  container: { marginTop: 10, flex: 1 },
  Title: { fontSize: reText(15), alignSelf: 'center', textAlign: 'center', fontWeight: 'bold', color: colors.white },
  stChuThich: { marginHorizontal: 10, marginTop: 10, flexDirection: 'row' },
  chuthich: { color: colors.white, fontSize: reText(12), fontWeight: 'bold' },
  textChuThich: { fontSize: reText(12), color: colors.white, alignSelf: 'center' },
})
