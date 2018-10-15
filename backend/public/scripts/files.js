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
    data, 
    processData: false,
    contentType: false                   
  })
  .done(done)
  .fail(fail);
}

downloadfile = (username, filename, success, error) => {
  $.ajax({
    dataType: 'json',
    method: 'GET',
    url:`/files/${username}/${filename}`,
    success,
    error
  })
}


downloadBtn = (filename, fileid) => {
  const username = localStorage.getItem('username')
  let filenameBtn = $(`#${fileid}Btn`)
  
  filenameBtn.append(
    `<form>
      <button class="downBtn" id=${fileid}DwBtn >Download</button>
    </form>`
  )

  $(`#${fileid}DwBtn`).on('click',(e)=>{
    e.preventDefault()
    downloadfile(username, 
      filename,
      (res) => {
          createdownload(res.Body.data, filename)
        },
      (res) => {console.log('Error')}
    )
  })
}

deleteBtn = (filename, fileid) => {
  const username = localStorage.getItem('username')
  let deleteBtn = $(`#${fileid}Btn`)

  deleteBtn.append(
    `<form>
      <button class="deleteBtn" id=${fileid}deleteBtn >Delete</button>
    </form>`
  )

  $(`#${fileid}deleteBtn`).on('click',() => {
    $.ajax({
      dataType: 'json',
      type: 'GET',
      url:`/files/delete/${username}/${filename}`,
      data: {username, filename},
      headers: {
        "Authorization": 'Bearer ' + localStorage.getItem('usertoken')
      },
      done: console.log('INFO: File deleted'),
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

    for (let i =0; i<this.toDisplay.length; i++) {
      const 
        file = this.toDisplay[i],
        fileid = file.filename.hexEncode(),
        modified = file.modified
      let 
        formatted = new Date(modified),
        formattedDate = formatted.toISOString().substring(0, 10);

      $('.filesInfo').append(
        `<div class = "fileInfo"> 
          <div class = "fileExt"> 
            <h1>.${escapeHtml(file.extension)}</h1>
          </div>
          <div class = "fileDetail">
            <h3>Filename: ${escapeHtml(file.filename)}</h3>
            <div class = "dlBtnAppend" id = ${fileid}Btn></div>
            <h3>Last Modified Date: ${formattedDate}</h3>
            <h3>Size: ${file.size} </h3>
            <div class = "deleteBtn" id = ${fileid}deleteBtn> </div>
            <div class = "${fileid}prevbtn"></div>
          </div>
        </div>`)
        
        
        if (isImage(file.extension)) {

          $(`.${fileid}prevbtn`).append(
          `
          <div id = "preview">
            <button id = "${fileid}prevBtn"> Preview </button>
          </div>
          `)

          // previewFile(res.Body.data, filename)
        }

        $(`#${fileid}prevBtn`).on('click',()=>{
          console.log('prev')
          const username = localStorage.getItem('username')
          downloadfile(username, 
            file.filename,
            (res) => {
              const extension = file.extension;

              if (isImage(extension)) {
                previewFile(res.Body.data, filename)
              }
            },
            (res) => {console.log('Error')}
          )

          // addDiv()
        })
      
        downloadBtn(file.filename, fileid)
        deleteBtn(file.filename, fileid)
    }
  } 
} //end fileDisplayManager

isImage = (extension) => {
  return extension === 'png' ||
  extension === 'jpg' ||
  extension === 'gif'

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

uploadButtonOnClick = (element) => {
    // File Upload
    // '#uploadBtn'
    $(element).on('click',(e)=>{
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
              filename = key.replace(/^.*[\\\/]/, '')
              extension = filename.split('.').pop();
          
              displayManager.addFile({
                modified,
                key,
                size,
                filename,
                extension
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

function previewFile(arr, filename) {
  var byteArray = new Uint8Array(arr);
  const 
    filenameEdit = filename,
    url = window.URL.createObjectURL(new Blob([byteArray], { type: 'application/octet-stream' })),
    link = document.createElement('a')

  let img = document.createElement('img')
  // set src to object url created above
  img.setAttribute('src', url)
  // add image to the page
  // document.body.appendChild(img)

  var objTo = document.getElementById('preview')
  var divtest = document.createElement("img");
  divtest.setAttribute ('src', url)
  objTo.appendChild(divtest)
}

createdownload = (arr, filename) => {
  var byteArray = new Uint8Array(arr);
  const 
    filenameEdit = filename,
    url = window.URL.createObjectURL(new Blob([byteArray], { type: 'application/octet-stream' })),
    link = document.createElement('a')

    //   // create element of type image for img
    // let img = document.createElement('img')
    // // set src to object url created above
    // img.setAttribute('src', url)
    // // add image to the page
    // document.body.appendChild(img)
// -------------



// ----------------
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


