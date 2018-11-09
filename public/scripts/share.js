
console.log('Javascript is loaded')

isImage = (extension) => {
    return extension === 'png' ||
    extension === 'jpg' ||
    extension === 'gif'

}


isVideo = (extension) => {
    return extension === 'mp4' ||
    extension === 'ogg'

}

previewVideo = (arr, filename, fileId) => {
    console.log('previewing video')
    let byteArray = new Uint8Array(arr),
        objTo = document.getElementById('previewDiv'),
        divtest = document.createElement("video")

    const 
        url = window.URL.createObjectURL(new Blob([byteArray], { type: 'application/octet-stream' }))
            
        divtest.setAttribute('controls', 'controls')
        divtest.setAttribute ('src', url)
        objTo.appendChild(divtest)

}


previewImage = (arr, filename,fileId) => {
    let byteArray = new Uint8Array(arr),
        objTo = document.getElementById(`previewDiv`),
        divtest = document.createElement("img"),
        img = document.createElement('img')
    const 
        url = window.URL.createObjectURL(new Blob([byteArray], { type: 'application/octet-stream' }))

    img.setAttribute('src', url)
    divtest.setAttribute ('src', url)
    objTo.appendChild(divtest)
}

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

getFileId = (url) => {
    const lastIndex = url.lastIndexOf('/')
    return url.substr(lastIndex + 1)
}

getFileName = (url) => {
    const lastIndex = url.lastIndexOf('/')
    const modifiedUrl = url.substr(0, lastIndex)

    const lastIndex2 = modifiedUrl.lastIndexOf('/')
    return modifiedUrl.substring(lastIndex2 + 1)

}

getUsername = (url) => {
    const lastIndex = url.lastIndexOf('/')
    const modifiedUrl = url.substr(0, lastIndex)

    const lastIndex2 = modifiedUrl.lastIndexOf('/')
    const modifiedUrl2 = modifiedUrl.substring(0, lastIndex2)


    const lastIndex3 = modifiedUrl2.lastIndexOf('/')
    return modifiedUrl2.substring(lastIndex3 + 1)
}

downloadfile = (username, filename, fileId, success, error) => {
    $.ajax({
      dataType: 'json',
      method: 'GET',
      url:`/files/${username}/${filename}/${fileId}`,
      success,
      error
    })
  }

const currentUrl = window.location.href.replace('shareFile', 'files');
const filename = getFileName(currentUrl)
const extension = filename.split('.').pop()

if (isImage(extension) || isVideo(extension)) { 

    document.getElementById('previewDiv').innerHTML = ''
    let previewBtn = document.createElement('button')
    previewBtn.setAttribute('id', 'previewBtn')

    let previewBtnText = document.createTextNode('Preview')

    previewBtn.appendChild(previewBtnText)

    // $(previewBtn).on('click',)
    
    document.getElementById('previewDiv').appendChild(previewBtn)

}

const username = getUsername(currentUrl)
let textH3 = document.createElement(`h3`)
let text = document.createTextNode(`${username} has shared ${filename} with you!`)

textH3.appendChild(text)

document.getElementById('shareText').appendChild(textH3)

$(`#previewBtn`).on('click',()=>{
    console.log('clicked preview button')
    
    const username = getUsername(currentUrl)

    console.log(currentUrl)
    const filename = getFileName(currentUrl)
    const fileId = getFileId(currentUrl);
    downloadfile(
      username, 
      filename,
      fileId,
      (res) => {
        const extension = filename.split('.').pop()
        document.getElementById('previewDiv').innerHTML = ''

        if (isImage(extension)) {
          previewImage(res.Body.data, filename, fileId)
        } else if (isVideo(extension)) {
          previewVideo(res.Body.data, filename, fileId)
        }
      },
      (res) => {console.log('Error')}
    )
})

$('#fileDownloadButton').click((e) => {
    e.preventDefault()
    console.log('INFO: Downloading File')
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