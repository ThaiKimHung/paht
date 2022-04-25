import moment from 'moment'
const DAYS = [
    {
        "topic_id": 0,
        "name": 'Hôm nay',
        "dateFrom": moment().format('YYYY/MM/DD 00:00:00'),
        "dateTo": moment().format('YYYY/MM/DD 23:59:59')
    },
    {
        "topic_id": 1,
        "name": '7 ngày gần đây',
        "dateFrom": moment(moment().add(-6, 'days')).format('YYYY/MM/DD 00:00:00'),
        "dateTo": moment().format('YYYY/MM/DD 23:59:59')
    },
    {
        "topic_id": 2,
        "name": '14 ngày gần đây',
        "dateFrom": moment(moment().add(-13, 'days')).format('YYYY/MM/DD 00:00:00'),
        "dateTo": moment().format('YYYY/MM/DD 23:59:59')
    },
    {
        "topic_id": 3,
        "name": '30 ngày gần đây',
        "dateFrom": moment(moment().add(-29, 'days')).format('YYYY/MM/DD 00:00:00'),
        "dateTo": moment().format('YYYY/MM/DD 23:59:59')
    },
]

export default DAYS;