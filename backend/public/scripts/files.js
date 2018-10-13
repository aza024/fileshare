// Global Variables
let 
  loggedIn = localStorage.getItem('logged-in'),
  username = localStorage.getItem('username')

//Global Functions
// Text conversion: decode bytes to utf-8 string
function pad(segment) { 
    return (segment.length < 2 ? '0' + segment : segment); 
  }
function decodeUtf8(data) {
  return decodeURIComponent(
    data.map(byte => ('%' + pad(byte.toString(16)))).join('')
  );
}

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

            $('.filesInfo').append(
              `<div class = "fileInfo"> 
                <div class = "fileExt"> 
                  <h1>.${extension}</h1>
                </div>
                <div class = "fileDetail">
                  <h3>Filename: ${filename}</h3>
                  <div class = "dlBtnAppend"></div>
                  <h3>Last Modified Date: ${modified}</h3>
                  <h3>Size: ${size} </h3>
                </div>
              </div>`)
        

        // $('#search').keyup(function(){
        //   $('#result').html('');
        //   $('#state').val('');
        //   var searchField = $('#search').val();
        //   var expression = new RegExp(searchField, "i");
         
        //   $.getJSON('data.json', function(data) {
        //    $.each(data, function(key, value){
        //     if (value.name.search(expression) != -1 || value.location.search(expression) != -1)
        //     {
        //      $('#result').append('<li class="list-group-item link-class"><img src="'+value.image+'" height="40" width="40" class="img-thumbnail" /> '+value.name+' | <span class="text-muted">'+value.location+'</span></li>');
        //     }
        //    });   
        //   });
        //  });
            }
         $('#result').on('click', 'li', function() {
          var click_text = $(this).text().split('|');
          $('#search').val($.trim(click_text[0]));
          $("#result").html('');
         });
        

        $('.dlBtnAppend').append(
          `<button class="downBtn">Download</button>`
        )
        //TODO refactor into seprate AJAX call or figure out how to get both
        $('.downBtn').on('click',(e)=>{
          console.log('DOWNLOAD CLICKED')
          $.ajax({
            dataType: 'json',
            method: 'GET',
            url:`/files/admin/_atestfile.txt`,
            // data:{
            //       username, 
            //       filename
            //     },
            success: (res)=>{
              //get data field

              console.log('Success '+ JSON.stringify(res.Body))

            

              console.log(decodeUtf8(res.Body.data))
              fileContent = decodeUtf8(res.Body.data)

              // if (res.Body.data.length >= 65535){
              //   console.log('File is too large to display')
              //   return
              // } else {
              //   let fileContent = String.fromCharCode.apply(null, res.Body.data)
              //   //display file content 
              //   console.log(fileContent )
              // }
              
            },
            error:   (res) =>{
              console.log('Error')
            }
          })
        })
    },
    error: (res)=>{
      console.log('Error: Unable to retrieve files ' + JSON.stringify(res))
    }
}, //end ajax


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
          console.log('Success '+ res)
        },
        error:   (res) =>{
          console.log('Error')
        }
    })
  }),
  $('.logout').on('click',()=>{
    localStorage.removeItem('logged-in')
    localStorage.removeItem('usertoken')
    loggedIn = false
  })
// end logged in condition
)}

