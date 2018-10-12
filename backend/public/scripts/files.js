// const axios = require('axios')
let 
  loggedIn = localStorage.getItem('logged-in'),
  username = localStorage.getItem('username')

if (loggedIn = true){
  console.log('IN LOGGED IN')
  $.ajax({
    dataType: 'json',
    method: 'GET',
    url:`/listfiles/${username}`,
    data:{username},
    success: (res)=>{
      let files = res.Contents
      for(var i =0; i < res.Contents.length; i++){
        let
          modified = (files[i].LastModified),
          key = (files[i].Key),
          size = (files[i].Size),
          filename = key.replace(/^.*[\\\/]/, '')
          extension = filename.split('.').pop();
          console.log(extension)

          $('.filesInfo').append(
            `<div class = "fileInfo"> 
              <div class = "fileDetail"> 
                <h1>${extension}</h1>
              </div>
                <h3>Filename: ${filename}</h3>
                <h3>Last Modified Date: ${modified}</h3>
                <h3>Size: ${size} </h3>
            </div>`)

        console.log(filename)
        console.log(modified)
        console.log(key)
        console.log(size)
      }
    },
    error: (res)=>{
      console.log('Error: Unable to retrieve files ' + JSON.stringify(res))
    }

},
// File Upload
  $('#uploadBtn').on('click',(e)=>{
      e.preventDefault();
      // console.log(localStorage.getItem('username'))
      // let username = localStorage.getItem('username')
    
      $.ajax({
          url: `/files/${username}`, 
          type: 'POST',
          data: new FormData($('#uploadbanner')[0]), 
          processData: false,
          contentType: false                   
        }).done(function(){
          console.log("Success: Files sent!");
        }).fail(function(){
          console.log("An error occurred, the files couldn't be sent!");
        });
  })
)}