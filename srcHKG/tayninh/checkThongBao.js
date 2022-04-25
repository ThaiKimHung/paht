const url = 'https://hkg.tayninh.gov.vn/services/WebService.asmx/cauhinh';
function checkThongBao(token, value) {
    var paramsString = `token=${token}&ntb=${value}`;
    return fetch(url,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            body: paramsString
        })
        .then((response) => response.json());
}

module.exports = checkThongBao;
