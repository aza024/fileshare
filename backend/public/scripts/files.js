// -----------------------------------------
// ---------- Global Variables -------------
// -----------------------------------------

let 
  loggedIn = localStorage.getItem('logged-in'),
  username = localStorage.getItem('username') 

var 
  sorted = $('#sortListOpts').val(),
  selected = $('#sortListOpts :selected').text();

// -----------------------------------------
// ---------- Global Functions -------------
// -----------------------------------------
  // Does not work with ES6
  String.prototype.hexEncode = function(){
    var 
      hex, 
      i,
      result = "";

    for (i = 0; i < this.length; i++) {
        hex = this.charCodeAt(i).toString(16);
        result += ("000"+hex).slice(-4);
    }

    return result
}

//Replace difficult characters with URI readable characters
escapeHtml = (unsafe) => {
  return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

uploadFile = (filename, data, done, fail) => {
  const username = localStorage.getItem('username')
  
  $.ajax({
    url: `/files/${username}`, 
    type: 'POST',
    headers: {
      "Authorization": 'Bearer ' + localStorage.getItem('usertoken')
    },
    data, 
    processData: false,
    contentType: false                   
  })
  .done(done)
  .fail(fail);
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

getShareUrl = (username, filename, uuid) => {
  return `http://localhost:3001/shareFile/${username}/${filename}/${uuid}`
}


downloadBtn = (filename, fileId) => {
  const username = localStorage.getItem('username')
  let filenameBtn = $(`#${fileId}Btn`)
  
  filenameBtn.append(
    `<form>
      <button class="downBtn" id=${fileId}DwBtn >Download</button>
    </form>`
  )

  $(`#${fileId}DwBtn`).on('click',(e)=>{
    e.preventDefault()
    downloadfile(username, 
      filename,
      fileId,
      (res) => {
          createdownload(res.Body.data, filename)
        },
      (res) => {console.log('ERR: Could not retrive file ' + filename)}
    )
  })
}


deleteBtn = (filename, fileId) => {
  const username = localStorage.getItem('username')
  let deleteBtn = $(`#${fileId}Btn`)

  deleteBtn.append(
    `<form>
      <button class="deleteBtn" id=${fileId}deleteBtn >Delete</button>
    </form>`
  )

  $(`#${fileId}deleteBtn`).on('click',(e) => {
    $.ajax({
      dataType: 'json',
      type: 'GET',
      url:`/files/delete/${username}/${filename}/${fileId}`,
      // data: {username, filename, fileId},
      headers: {
        "Authorization": 'Bearer ' + localStorage.getItem('usertoken')
      },
      done: () => {
        // e.preventDefault()
        removeFile(filename)
        display()
        console.log('INFO: File deleted')
      },
      fail: console.log('ERROR: Unable to delete file')
    })
    }
  )
}
class FileDisplayManager{
  constructor(fileList) {
    this.fileList = fileList.slice()
    this.toDisplay = fileList.slice()
    this.currentSearch = null
    this.currentSort = null
  }

  clear(){
    this.fileList.length = 0
    this.toDisplay.length = 0
  }

  removeFile(filename){
    let removeIdx = null
    for(let i = 0; i < this.fileList.length; i++ ){
      var file = this.fileList[i]
      if (filename === file.filename){
        removeIdx = i;
        break;
      }
    }

    if (removeIdx != null){
      this.fileList.splice(removeIdx, 1)
    }

    removeIdx = null
    for(let i = 0; i < this.toDisplay.length; i++ ){
      var file = this.toDisplay[i]
      if (filename === file.filename){
        removeIdx = i;
        break;
      }
    }

    if (removeIdx != null){
      this.toDisplay.splice(removeIdx, 1)
    }
  }

  addFile(file){
    this.fileList.push(file)
    this.toDisplay.push(file)
  }
  
  sortMostRec(){
    this.currentSort = 'MostRec'
    this.toDisplay.sort((a, b) => {
      if (a.modified > b.modified) return -1;
      if (a.modified < b.modified) return 1;
      return 0;
    })
  }

  sortLeastRec(){
    this.currentSort = 'LeastRec'
    this.toDisplay.sort((a, b) => {
      if (a.modified < b.modified) return -1;
      if (a.modified > b.modified) return 1;
      return 0;
    })
  }
  
  sortSizeLow(){
    this.currentSort = 'SizeLow'
    this.toDisplay.sort((a, b) => {
      if (a.size < b.size) return -1;
      if (a.size > b.size) return 1;
      return 0;
    })
  }

  sortSizeHigh(){
    this.currentSort = 'SizeHigh'
    this.toDisplay.sort((a, b) => {
      if (a.size > b.size) return -1;
      if (a.size < b.size) return 1;
      return 0;
    })
  }

  sortAlpha(){
    this.currentSort = 'Alpha'
    this.toDisplay.sort((a, b) => {
      if (a.filename < b.filename) return -1;
      if (a.filename > b.filename) return 1;
      return 0;
    })
  }

  sortRevAlpha(){
    this.currentSort = 'RevAlpha'
    this.toDisplay.sort((a, b) => {
      if (a.filename > b.filename) return -1;
      if (a.filename < b.filename) return 1;
      return 0;
    })
  }

  reSort() {
    if (this.currentSort == 'MostRec') {
      this.sortMostRec()
    }
    else if (this.currentSort == 'LeastRec') {
      this.sortLeastRec()
    }
    else if (this.currentSort == 'SizeLow') {
      this.sortSizeLow()
    }
    else if (this.currentSort == 'SizeHigh') {
      this.sortSizeHigh()
    }
    else if (this.currentSort == 'Alpha') {
      this.sortAlpha()
    }
    else if (this.currentSort == 'RevAlpha') {
      this.sortRevAlpha()
    }
  }

  search(searchStr){
    let str = searchStr || this.currentSearch

    this.currentSearch = str
    this.toDisplay = []
    for(let i = 0; i < this.fileList.length; i++){
      let 
      file = this.fileList[i], 
      filename = file.filename

      if(filename.indexOf(str)!=-1){
        this.toDisplay.push(file)
      }
    }
  }

  display(){
    $('.filesInfo').empty()

    for (let i =0; i < this.toDisplay.length; i++) {
      const 
        file = this.toDisplay[i],
        fileId = file.fileId,
        modified = file.modified
      let 
        formatted = new Date(modified),
        formattedDate = formatted.toISOString().substring(0, 10);

      $('.filesInfo').append(
        `
          <div id = "${fileId}picPreview"></div>
            <div class = "fileWrapper" id = ${fileId}Wrapper>
              <div id = "${fileId}fileInfo"> 
                <div class = "fileExt"> 
                  <h1 id="${fileId}extenCirc">.${escapeHtml(file.extension)}</h1>
                </div>
                <div class = "fileDetail">
                  <h3 class="bold">Filename: ${escapeHtml(file.filename)}</h3>

                  <div id="${fileId}DwlDelBtn">
                    <div class = "dlBtnAppend" id = ${fileId}Btn></div>
                  </div>

                  <h3>Last Modified Date: ${formattedDate}</h3>
                  <h3>Size: ${file.size} </h3>

                  <div id="${fileId}sharePrev" class = "sharePrev">
                    <div class = "${fileId}prevbtn"></div>
                    <button class = "filePgBtn" id ="${fileId}shareBtn">Share</button>
                    <div class = "shareLink" id = "${fileId}shareLink"></div>
                </div>

                
            </div>
          </div>
        `
      )
      // CSS
      $(`#${fileId}Wrapper`).css('display','flex')
      $(`#${fileId}Wrapper`).css('justify-content','space-between')
      $(`#${fileId}Wrapper`).css('flex-direction','column')
      $(`#${fileId}Wrapper`).css('flex-wrap','wrap')
      $(`#${fileId}Wrapper`).css('border','5px solid #008080')
      $(`#${fileId}Wrapper`).css('background-color','#F7F9FA')
      $(`#${fileId}Wrapper`).css('margin','auto')
      $(`#${fileId}Wrapper`).css('margin-bottom','100px')
      $(`#${fileId}Wrapper`).css('width','35%')

      $(`#${fileId}fileInfo`).css('text-align','center')

      $(`#${fileId}extenCirc`).css('background-color', 'grey')
      $(`#${fileId}extenCirc`).css('color', 'white')
      $(`#${fileId}extenCirc`).css('width', '100px')

      $(`#${fileId}DwlDelBtn`).css('display', 'flex')
      $(`#${fileId}DwlDelBtn`).css('flex-direction', 'column')

   
      if(file.extension == 'jpg'){
        $(`#${fileId}extenCirc`).css('background-color', 'red')
      } else if ( file.extension == 'mp4'){
        $(`#${fileId}extenCirc`).css('background-color', 'blue')
      } else if ( file.extension == 'txt'){
        $(`#${fileId}extenCirc`).css('background-color', 'green')
      } else {
        $(`#${fileId}extenCirc`).css('background-color', 'purple')
      }
    
  
      //CALL FUNCTION HERE TODO 
      shareBtn(file.filename, fileId)

      if (isImage(file.extension) || isVideo(file.extension)) {
        // $(`.${fileId}fileInfo`).css('background-color','red')
        $(`.${fileId}prevbtn`).append(
          `<div id = "preview">
            <button class = "filePgBtn" id = "${fileId}prevBtn"> Preview </button>
          </div>`
        )
      }

      $(`#${fileId}prevBtn`).on('click',()=>{
        const username = localStorage.getItem('username')

        
        downloadfile(
          username, 
          file.filename,
          fileId,
          (res) => {
            const extension = file.extension;
            if (isImage(extension)) {
              previewImage(res.Body.data, filename, fileId)
              $(`.${fileId}Wrapper`).hide()
            } else if (isVideo(file.extension)) {
              previewVideo(res.Body.data, filename, fileId)
              $(`.${fileId}Wrapper`).hide()
            }
          },
          (res) => {console.log('Error')}
        )


        $(`#${fileId}picPreview`).append(
          `<button class ="${fileId}closePicPrev">Close</button>`
        )

        $(`.${fileId}closePicPrev`).on('click', () => {
          console.log('close click prev')
          $(`#${fileId}picPreview`).hide()
          $(`.${fileId}Wrapper`).show()
        })

        
      })

      downloadBtn(file.filename, fileId)
      deleteBtn(file.filename, fileId)
    }
  } 
} //end fileDisplayManager


isImage = (extension) => {
  return extension === 'png' ||
    extension === 'jpg' ||
    extension === 'gif'

}


isVideo = (extension) => {
  return extension === 'mp4' ||
    extension === 'ogg'

}


$('#search').keyup(function(){
  let str = $(this).val()
    displayManager.search(str)
    displayManager.display()
})

$('#sortListOpts').on('change', function() {
  let opt = $(this).val()

    if (opt === '1'){
      displayManager.sortMostRec()
    } else if(opt === '2'){
      displayManager.sortLeastRec()
    } else if(opt === '3'){
      displayManager.sortAlpha()
    } else if(opt === '4'){
      displayManager.sortRevAlpha()
    } else if(opt === '5'){
      displayManager.sortSizeLow()
    } else if(opt === '6'){
      displayManager.sortSizeHigh()
    } 
    else {
      console.log('Invalid Option')
    }

  displayManager.display()
})

let displayManager = new FileDisplayManager([]) 

// Text conversion: decode bytes to utf-8 string
pad = (segment) => { 
  return (segment.length < 2 ? '0' + segment : segment); 
}

decodeUtf8 = (data) => {
  return decodeURIComponent(
    data.map(byte => ('%' + pad(byte.toString(16)))).join('')
  );
}

uploadButtonOnClick = (e) => {
    // File Upload
    // '#uploadBtn'
    $(e).on('click',(e)=>{
      e.preventDefault();
      let 
      username = localStorage.getItem('username'),

      filename = $('#createFileForm').serialize()
      const data = new FormData($('#uploadbanner')[0])

      uploadFile(
          filename,
          data, 
          function(){
              console.log("INFO:Files successfully sent!");
              // res.status(200)
              displayManager.clear()
              const lastSearch = displayManager.currentSearch
              const lastSort = displayManager.currentSort

              loadLoginPage()

              displayManager.currentSearch = lastSearch
              displayManager.currentSort = lastSort
              displayManager.reSort()
              displayManager.search(null)
          },
          function(){
              console.log("ERR: Files couldn't be sent.");
              // res.status(200)
          }
        )
  })
}

loadLoginPage = () => {
 //end ajax
    uploadButtonOnClick('#uploadBtn')

    $('.logout').on('click',()=>{
      localStorage.removeItem('username')
      localStorage.removeItem('useremail')
      localStorage.removeItem('logged-in')
      localStorage.removeItem('usertoken')
      loggedIn = false

      location.reload()
    })

    console.log(localStorage.getItem('usertoken'))
    $.ajax({
        dataType: 'json',
        method: 'GET',
        url:`/listfiles/${username}`,
        data:{username},
        headers: {
          "Authorization": 'Bearer ' + localStorage.getItem('usertoken')
        },
        success: (res)=>{
          let files = res.Contents

          for(let i =0; i < files.length; i++){
            let
              modified = (files[i].LastModified),
              key = (files[i].Key),
              size = (files[i].Size),
              filename = key.replace(/^.*[\\\/]/, ''),
              extension = filename.split('.').pop(),
              fileId = files[i].uuid
          
              displayManager.addFile({
                modified,
                key,
                size,
                filename,
                extension,
                fileId
              })
          }
          displayManager.sortMostRec()
          displayManager.display()
        },
        error: (res)=>{
          console.log('ERR: Unable to retrieve files ' + JSON.stringify(res))
        }
    }
  )
}

if (loggedIn = true){
  loadLoginPage()
} else {
    let children = $('.filesInfo').remove()
}

previewVideo = (arr, filename, fileId) => {
  let byteArray = new Uint8Array(arr),
      objTo = document.getElementById(`${fileId}picPreview`),
      divtest = document.createElement("video")
  
  const 
    url = window.URL.createObjectURL(new Blob([byteArray], { type: 'application/octet-stream' }))
    
  divtest.setAttribute('controls', 'controls')
  divtest.setAttribute ('src', url)
  objTo.appendChild(divtest)

}


previewImage = (arr, filename,fileId) => {
  let byteArray = new Uint8Array(arr),
      objTo = document.getElementById(`${fileId}picPreview`),
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


createFile = () => {
  const 
    data = document.getElementById('txt').value,
    filename = document.getElementById('filename').value,
    url = window.URL.createObjectURL(new Blob([data])),
    link = document.createElement('a')

  link.href = url
  link.setAttribute('download', filename || `filename.txt`)

  document.body.appendChild(link)
  link.click()

  document.body.removeChild(link)
}


$('.trigger').click(() => {
  $('.modal-wrapper').toggleClass('open')
  $('.page-wrapper').toggleClass('blur')
  return false;
})

$('#downloadNewFile').click(() => {
  createFile();
  return false;
})

$('#uploadNewFile').click((e) => {
  e.preventDefault();
  let filename = $('#createFileForm').serialize();
    // username = localStorage.getItem('username'),  
  const data = new FormData($('#createFileForm')[0]);

  uploadFile(
    filename, 
    data, 
    () => {console.log("INFO:Files successfully sent!")},
    () => {console.log("ERR: Files couldn't be sent.")}
  )
})


shareBtn = (filename, fileId) => {
  let username = localStorage.getItem('username')
  const url = getShareUrl(username, filename, fileId)

  $(`#${fileId}shareBtn`).on('click', (e) => {
    e.preventDefault();
    console.log('clicked')

    console.log(filename)
    // Remove any shared link if it exists
    document.getElementById(`${fileId}shareLink`).innerHTML = ''
    // Create href
    let hrefUrl = document.createElement("a")
    // Create url text
    var hrefText = document.createTextNode(url);

    hrefUrl.appendChild(hrefText)

    hrefUrl.setAttribute('href', url)
    document.getElementById(`${fileId}shareLink`)
    .append(hrefUrl)
 
  })
}
