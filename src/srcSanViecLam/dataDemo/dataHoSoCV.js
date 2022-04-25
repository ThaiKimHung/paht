import { ImagesSVL } from "../images";

export const dataHoSoCV = [
    {
        id: 0,
        name: 'Mai Văn Hậu',
        nghanh: 'Designer',
        image: ImagesSVL.icUser1,
        viTri: 'Công nhân/ nhân viên',
        kinhNghiem: '3 năm',
        thoiGian: 'Toàn thời gian',
        luong: 'Từ 10 - 15 Tr/tháng',
        khuVuc: 'Quận 1 - TP. Hồ Chí Minh',
        thoiGianLamViec: [],
        isCongKhai: false,
        typeHoSo: 'Người lao động',
        tuoi: 29,
        DiaChi: '123 Trần Tấn, Phường Tân Sơn Nhì, Quận Tân Phú, Thành phố Hồ Chí Minh',
        gioitinh: 'Nam',
        isChoose: false,
        isSave: true
    },
    {
        id: 1,
        name: 'Nguyễn Kim Thu',
        nghanh: 'Designer',
        image: ImagesSVL.icUser2,
        viTri: 'Công nhân/ nhân viên',
        kinhNghiem: '',
        thoiGian: 'Bán thời gian',
        luong: 'Từ 7 - 10 Tr/tháng',
        khuVuc: 'Quận Tân Phú - TP. Hồ Chí Minh',
        thoiGianLamViec: [
            {
                time: 'Từ 20/12/2021 đến 28/01/2021',
            },
        ],
        isCongKhai: true,
        typeHoSo: 'Người lao động',
        DiaChi: '123 Trần Tấn, Phường Tân Sơn Nhì, Quận Tân Phú, Thành phố Hồ Chí Minh',
        tuoi: 33,
        gioitinh: 'Nữ',
        isChoose: false,
        isSave: true
    },
    {
        id: 2,
        name: 'Lê Văn Nam',
        nghanh: 'Lao động phổ thông',
        image: ImagesSVL.icUser3,
        viTri: 'Công nhân/ nhân viên',
        kinhNghiem: '',
        thoiGian: 'Bán thời gian',
        luong: 'Từ 15 - 35k/ giờ',
        khuVuc: 'TP. Hồ Chí Minh',
        thoiGianLamViec: [
            {
                time: 'Từ 20/12/2021 đến 28/01/2021',
            },
            {
                time: 'Thứ 2,4,6 từ 18:00 - 20:00'
            },
            {
                time: 'Thứ 3,5,7,cn từ 08:00 - 17:00'
            }
        ],
        isCongKhai: false,
        typeHoSo: 'Học sinh, sinh viên',
        DiaChi: '123 Trần Tấn, Phường Tân Sơn Nhì, Quận Tân Phú, Thành phố Hồ Chí Minh',
        tuoi: 21,
        gioitinh: 'Nam',
        isChoose: false,
        isSave: false
    },
    {
        id: 3,
        name: 'Mai Thành Nhân',
        nghanh: 'Dev Mobile',
        image: ImagesSVL.icUser2,
        viTri: 'Lập trình mobile',
        kinhNghiem: '1 năm',
        thoiGian: 'Toàn thời gian',
        DiaChi: '123 Trần Tấn, Phường Tân Sơn Nhì, Quận Tân Phú, Thành phố Hồ Chí Minh',
        luong: 'Từ 8 - 12 Tr/tháng',
        khuVuc: 'Tân Phú - TP. Hồ Chí Minh',
        thoiGianLamViec: [],
        isCongKhai: true,
        typeHoSo: 'Người lao động',
        tuoi: 25,
        gioitinh: 'Nam',
        isChoose: false,
        isSave: false
    },
];