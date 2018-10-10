// const axios = require('axios')

// File Upload
$('#uploadBtn').on('click',(e)=>{
    e.preventDefault();
  
    $.ajax({
        url: '/files', 
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