const url = 'https://hkg.tayninh.gov.vn/services/WebService.asmx/dangnhap';
const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
const Base64 = {
    btoa: (input: string = '') => {
        let str = input;
        let output = '';

        for (let block = 0, charCode, i = 0, map = chars;
            str.charAt(i | 0) || (map = '=', i % 1);
            output += map.charAt(63 & block >> 8 - i % 1 * 8)) {
            charCode = str.charCodeAt(i += 3 / 4);
            if (charCode > 0xFF) {
                throw new Error("'btoa' failed: The string to be encoded contains characters outside of the Latin1 range.");
            }
            block = block << 8 | charCode;
        }
        return output;
    },
    atob: (input: string = '') => {
        let str = input.replace(/=+$/, '');
        let output = '';
        if (str.length % 4 == 1) {
            throw new Error("'atob' failed: The string to be decoded is not correctly encoded.");
        }
        for (let bc = 0, bs = 0, buffer, i = 0;
            buffer = str.charAt(i++);

            ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer,
                bc++ % 4) ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0
        ) {
            buffer = chars.indexOf(buffer);
        }
        return output;
    }
};
function checkDangnhap(tk, mk) {
    var paramsString = `tk=${tk}&mk=${Base64.btoa(mk)}`;
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
    //     console.log(responseJson.token);
    // });

    // var formBody = [];
    // const details = {
    //     "tk": tk,
    //     "mk": mk
    // };
    // for (const property in details) {
    //     const encodedKey = encodeURIComponent(property);
    //     const encodedValue = encodeURIComponent(details[property]);
    //     formBody.push(`${encodedKey}=${encodedValue}`);
    // }
    // formBody = formBody.join('&');
    // return fetch(url, {
    //     method: 'POST',
    //     headers: {
    //         Accept: 'application/json',
    //         'Content-Type': 'application/x-www-form-urlencoded',
    //     },
    //     body: formBody
    // });
}

module.exports = checkDangnhap;
