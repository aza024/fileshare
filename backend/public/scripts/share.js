
console.log('Javascript is loaded')

createdownload = (arr, filename) => {
    var byteArray = new Uint8Array(arr);
    const 
        filenameEdit = filename,
        url = window.URL.createObjectURL(new Blob([byteArray], { type: 'application/octet-stream' })),
        link = document.createElement('a')

    link.href = url
    link.setAttribute('download', filenameEdit || filename)

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
}

getFileName = (url) => {
    const lastIndex = url.lastIndexOf('/')
    const modifiedUrl = url.substr(0, lastIndex)

    const lastIndex2 = modifiedUrl.lastIndexOf('/')
    return modifiedUrl.substring(lastIndex2 + 1)

} 

$('#fileDownloadButton').click(() => {
    console.log('INFO: Downloadingggggg')
    const currentUrl = window.location.href.replace('shareFile', 'files');
    console.log(currentUrl)
    const filename = getFileName(currentUrl)
    
    $.ajax({
        dataType: 'json',
        method: 'GET',
        url: currentUrl,
        success: (res) => {
            console.log('INFO: Successfully downloaded file: ' + JSON.stringify(res))
            createdownload(res.Body.data, filename)

        },
        error: (err) => {
            console.log('ERR: Failed to download file: ' + 
            JSON.stringify(err))
        }
    })
})