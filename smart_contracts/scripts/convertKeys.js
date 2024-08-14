function arrayToHexString(arr) {
    return arr.map(byte => byte.toString(16).padStart(2, '0')).join('');
}

const publicKeyArray = [208, 114, 247, 80, 218, 226, 26, 173, 18, 168, 182, 200, 156, 19, 172, 136, 156, 139, 191, 190, 13, 44, 99, 185, 205, 202, 34, 143, 33, 70, 16, 106];
const secretKeyArray = [231, 72, 17, 146, 248, 165, 143, 44, 88, 155, 231, 242, 53, 179, 238, 126, 118, 12, 63, 210, 239, 136, 171, 23, 200, 238, 62, 110, 99, 80, 223, 129, 208, 114, 247, 80, 218, 226, 26, 173, 18, 168, 182, 200, 156, 19, 172, 136, 156, 139, 191, 190, 13, 44, 99, 185, 205, 202, 34, 143, 33, 70, 16, 106];

const publicKeyHex = arrayToHexString(publicKeyArray);
const secretKeyHex = arrayToHexString(secretKeyArray);

console.log('Public Key (Hex):', publicKeyHex);
console.log('Secret Key (Hex):', secretKeyHex);