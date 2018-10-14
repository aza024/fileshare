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
    `<form onsubmit="createdownload();return false;">
      <button class="downBtn" id=${fileid}DwBtn >Download</button>
    </form>`
  )

  $(`#${fileid}DwBtn`).on('click',(e)=>{
    downloadfile(username, 
      filename,
      (res) => {
          //get data field
          createdownload(decodeUtf8(data),filename)
          console.log('INFO: Downloaded File: ' + decodeUtf8(data))
          // TODO: HANDLE - (res.Body.data.length >= 65535){
        },
      (res) => {console.log('Error')}
    )
  })
}
  class FileDisplayManager{
    constructor(fileList) {
      this.fileList = fileList.slice()
      this.toDisplay = fileList.slice()
    }

    addFile(file){
      this.fileList.push(file)
      this.toDisplay.push(file)
    }
    
    sortMostRec(){
      this.toDisplay.sort((a, b) => {
        if (a.modified > b.modified) return -1;
        if (a.modified < b.modified) return 1;
        return 0;
      })
    }

    sortLeastRec(){
      this.toDisplay.sort((a, b) => {
        if (a.modified < b.modified) return -1;
        if (a.modified > b.modified) return 1;
        return 0;
      })
    }
    
    sortSizeLow(){
      this.toDisplay.sort((a, b) => {
        if (a.size < b.size) return -1;
        if (a.size > b.size) return 1;
        return 0;
      })
    }

    sortSizeHigh(){
      this.toDisplay.sort((a, b) => {
        if (a.size > b.size) return -1;
        if (a.size < b.size) return 1;
        return 0;
      })
    }

    sortAlpha(){
      this.toDisplay.sort((a, b) => {
        if (a.filename < b.filename) return -1;
        if (a.filename > b.filename) return 1;
        return 0;
      })
    }

    sortRevAlpha(){
      this.toDisplay.sort((a, b) => {
        if (a.filename > b.filename) return -1;
        if (a.filename < b.filename) return 1;
        return 0;
      })
    }

    search(str){
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
            </div>
          </div>`)

        downloadBtn(file.filename, fileid)
      }
    } 
  } //end fileDisplayManager

  
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



loadLoginPage = () => {
    $.ajax({
        dataType: 'json',
        method: 'GET',
        url:`/listfiles/${username}`,
        data:{username},
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
    }, //end ajax

    // File Upload
      $('#uploadBtn').on('click',(e)=>{
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
                  // displayManager = new FileDisplayManager([])
                  // loadLoginPage()
              },
              function(){
                  console.log("ERR: Files couldn't be sent.");
                  // res.status(200)
              }
            )
      }),
    //get file content
      $('.downBtn').on('click',(e)=>{
        $.ajax({
            dataType: 'json',
            method: 'GET',
            url:`/files/${username}/${filename}`,
            data:{
                  username, 
                  filename
                },
            success: (res)=>{
              console.log('INFO: Success '+ res)
              res.status(200)
            },
            error: (res) =>{
              console.log('ERR: Unable to download files for user ' + username +' file ' + filename)
              res.status(400)
            }
        })
      }),
      
      $('.logout').on('click',()=>{
        localStorage.removeItem('username')
        localStorage.removeItem('useremail')
        localStorage.removeItem('logged-in')
        localStorage.removeItem('usertoken')
        loggedIn = false

        location.reload()
      })
    // end logged in condition
    )
}

if (loggedIn = true){
  loadLoginPage()
} else {
    let children = $('.filesInfo').remove()
}

createdownload = (data,filename) => {
  const 
    filenameEdit = filename,
    url = window.URL.createObjectURL(new Blob([data])),
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

  $('.trigger').click(function() {
    $('.modal-wrapper').toggleClass('open')
    $('.page-wrapper').toggleClass('blur')
    return false;
  })

  $('#downloadNewFile').click(function(){
    createFile();
    return false;
  })

  $('#uploadNewFile').click((e)=>{
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
