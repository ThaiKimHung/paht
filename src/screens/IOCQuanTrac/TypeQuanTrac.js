export const TYPESTRAM = {
    KHONGKHI: 4,
    NUOC: 1
}

export const KPI = [
    {
        "color": "#00e400",
        "to": 51,
        "from": 0,
        "name": "0 - 50",
        "status": "Tốt",
        "textColor": "#fff",
        "note": "Chất lượng không khí tốt, không ảnh hưởng tới sức khỏe",
        "icon": "icExellent"
    },
    {
        "color": "#ffff00",
        "to": 101,
        "from": 51,
        "name": "`51 - 100`",
        "status": "Trung bình",
        "textColor": "#000",
        "note": "Chất lượng không khí ở mức chấp nhận được. Tuy nhiên, đối với những người nhạy cảm (Người già, trẻ em, người mắc các bện hô hấp tim mạnh...) có thể chụi những tác động nhất định tới sức khỏe.",
        "icon": "icVerryGood"
    },
    {
        "color": "#ff7e00",
        "to": 151,
        "from": 101,
        "name": "101 - 150",
        "status": "Kém",
        "textColor": "#fff",
        "note": "Những người nhạy cảm gặp phải các vấn đề về sức khỏe, những người bình thường ít ảnh hưởng.",
        "icon": "icGood"
    },
    {
        "color": "#ff0000",
        "to": 201,
        "from": 151,
        "name": "151 - 200",
        "status": "Xấu",
        "textColor": "#fff",
        "note": "Những người bình thường bắt đầu có các ảnh hưởng tới sức khỏe, nhóm người nhạy cảm có thể gặp những vấn đề về sức khỏe nghiêm trọng hơn.",
        "icon": "icNotGood"
    },
    {
        "color": "#8f3f97",
        "to": 301,
        "from": 201,
        "name": "201 - 300",
        "status": "Rất xấu",
        "textColor": "#fff",
        "note": "Cảnh báo hưởng tới sức khỏe: mọi người bị ảnh hưởng tới sức khỏe nghiêm trọng hơn.",
        "icon": "icBad"
    },
    {
        "color": "#7e0019",
        "to": 500.0001,
        "from": 301,
        "name": "301-500",
        "status": "Nguy hại",
        "textColor": "#fff",
        "note": "Cảnh báo khẩn cấp về sức khỏe: Toàn bộ dân số bị ảnh hưởng tới sức khỏe nghiêm trọng.",
        "icon": "icVerryBad"
    }
];

export const RECOMMEND = [
    {
        "from": 0,
        "to": 50,
        "recommend": [
            "Tự do thực hiện các hoạt động ngoài trời."
        ]
    },
    {
        "from": 51,
        "to": 100,
        "recommend": [
            "Tự do thực hiện các hoạt động ngoài trời.",
            "Nên theo dõi các triệu chứng như ho hoặc khó thở, nhưng vẫn có thể hoạt động bên ngoài."
        ]
    },
    {
        "from": 151,
        "to": 200,
        "recommend": [
            "Mọi người nên giảm các hoạt động mạnh khi ở ngoài trời, tránh tập thể dục kéo dài và nghỉ ngơi nhiều hơn trong nhà.",
            "Nên ở trong nhà và giảm hoạt động mạnh. Nếu cần thiết phải ra ngoài, hãy đeo khẩu trang đạt tiêu chuẩn."
        ]
    },
    {
        "from": 201,
        "to": 300,
        "recommend": [
            "Mọi người hạn chế tối đa các hoạt động ngoài trời và chuyển tất cả các hoạt động vào trong nhà. Nếu cần thiết phải ra ngoài, hãy đeo khẩu trang đạt tiêu chuẩn.",
            "Nên ở trong nhà và giảm hoạt động mạnh."
        ]
    },
    {
        "from": 201,
        "to": 300,
        "recommend": [
            "Mọi người nên ở trong nhà, đóng cửa ra vào và cửa sổ. Nếu cần thiết phải ra ngoài, hãy đeo khẩu trang đạt tiêu chuẩn."
        ]
    }
];

export const KEY_CHART_KK = [
    {
        id: 1,
        title: 'Tốc độ gió',
        key: 'Tốc độ gió',
        display: false
    },
    {
        id: 2,
        title: 'NO',
        key: 'NO',
        display: false
    },
    {
        id: 3,
        title: 'Lượng mưa',
        key: 'Lượng mưa',
        display: false
    },
    {
        id: 4,
        title: 'PM-10',
        key: 'PM-10',
        display: true
    },
    {
        id: 5,
        title: 'PM-1',
        key: 'PM-1',
        display: false
    },
    {
        id: 6,
        title: 'O3',
        key: 'O3',
        display: true
    },
    {
        id: 7,
        title: 'Radiation',
        key: 'Radiation',
        display: false
    },
    {
        id: 8,
        title: 'CO',
        key: 'CO',
        display: true
    },
    {
        id: 9,
        title: 'Hướng gió',
        key: 'Hướng gió',
        display: false
    },
    {
        id: 10,
        title: 'PM-Total',
        key: 'PM-Total',
        display: false
    },
    {
        id: 11,
        title: 'NO2',
        key: 'NO2',
        display: true
    },
    {
        id: 12,
        title: 'PM4',
        key: 'PM4',
        display: false
    },
    {
        id: 13,
        title: 'NOx',
        key: 'NOx',
        display: false
    },
    {
        id: 14,
        title: 'Nhiệt độ',
        key: 'Nhiệt độ',
        display: false
    },
    {
        id: 15,
        title: 'Humidity',
        key: 'Humidity',
        display: false
    },
    {
        id: 16,
        title: 'SO2',
        key: 'SO2',
        display: false
    },
    {
        id: 17,
        title: 'Benzen',
        key: 'Benzen',
        display: false
    },
    {
        id: 18,
        title: 'Tiếng ồn',
        key: 'Tiếng ồn',
        display: false
    },
    {
        id: 19,
        title: 'Áp suất khí quyển',
        key: 'Áp suất khí quyển',
        display: false
    },
    {
        id: 20,
        title: 'PM-2-5',
        key: 'PM-2-5',
        display: true
    },
]

export const KEY_CHART_NUOC = [
    {
        id: 1,
        title: 'pH',
        key: 'pH',
        display: true
    },
    {
        id: 2,
        title: 'DO',
        key: 'DO',
        display: false
    },
    {
        id: 3,
        title: 'COD',
        key: 'COD',
        display: false
    },
    {
        id: 4,
        title: 'TSS',
        key: 'TSS',
        display: false
    },
    {
        id: 5,
        title: 'Mn',
        key: 'Mn',
        display: false
    },
    {
        id: 6,
        title: 'Fe',
        key: 'Fe',
        display: false
    }
    // {
    //     id: 7,
    //     title: 'NH4+',
    //     key: 'NH4+',
    //     display: false
    // } //Thấy API k có dùng
]

export default {
    TYPESTRAM, KPI, RECOMMEND, KEY_CHART_KK, KEY_CHART_NUOC
}