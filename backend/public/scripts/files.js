// const axios = require('axios')
let 
  loggedIn = localStorage.getItem('logged-in'),
  username = localStorage.getItem('username')

if (loggedIn = true){
  console.log('IN LOGGED IN')
  $.ajax({
    dataType: 'json',
    method: 'GET',
    // changed from /user
    url:`/listfiles/${username}`,
    data:{
        username
    },
    success: (res)=>{
      let files = res.Contents
      console.log(files)
      for(var i =0; i < res.Contents.length; i++){
        console.log(files[i].LastModified)
        modified = (files[i].LastModified)
      }
    },
    error: (res)=>{
      console.log('Error:' + JSON.stringify(res))
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