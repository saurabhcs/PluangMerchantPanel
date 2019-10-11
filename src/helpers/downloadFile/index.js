/*
 * created by akul on 2019-09-26
*/

module.exports = {
    downloadFile: (data, filename, mime, bom) => {
        if (data && data.type === 'Buffer') {
            data = `data:${mime};base64,${new Buffer(data.data, 'binary').toString('base64')}`;
        }
        let blobData = (typeof bom !== 'undefined') ? [bom, data] : [data];
        let blob = new Blob(blobData, { type: mime || 'application/octet-stream' });
        if (/^data\:[\w+\-]+\/[\w+\-]+[,;]/.test(data)) {
            blob = dataUrlToBlob(data);
        }
        if (typeof window.navigator.msSaveBlob !== 'undefined') {
            window.navigator.msSaveBlob(blob, filename);
        } else {
            let blobURL = window.URL.createObjectURL(blob);
            let tempLink = document.createElement('a');
            tempLink.style.display = 'none';
            tempLink.href = blobURL;
            tempLink.setAttribute('download', filename);
            if (typeof tempLink.download === 'undefined') {
                tempLink.setAttribute('target', '_blank');
            }
            document.body.appendChild(tempLink);
            tempLink.click();
            document.body.removeChild(tempLink);
            window.URL.revokeObjectURL(blobURL);
        }
    }
};

function dataUrlToBlob (strUrl) {
    let parts = strUrl.split(/[:;,]/);
    let type = parts[1];
    let decoder = parts[2] === "base64" ? atob : decodeURIComponent;
    let binData = decoder(parts.pop());
    let mx = binData.length;
    let i = 0;
    let uiArr = new Uint8Array(mx);

    for (i; i < mx; ++i) uiArr[i] = binData.charCodeAt(i);

    return new Blob([uiArr], { type: type });
}
