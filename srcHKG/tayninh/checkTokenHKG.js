const url = 'https://hkg.tayninh.gov.vn/services/WebService.asmx/checktoken';
function checkDangnhapHKG(token) {
    var paramsString = `token=${token}`;
    return fetch(url,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            body: paramsString
        })
        .then((response) => response.json());
        // .then((responseJson) => {
        // console.log(responseJson.thongbao);
    // });
}

module.exports = checkDangnhapHKG;
