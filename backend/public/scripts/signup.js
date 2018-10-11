// jQuery(document).ready(function($){


// #TODO Change function declaration to es6 format
// ----------------------------------------
// -------------------Modal----------------
// ----------------------------------------
// Global Variables
var $form_modal = $('.user-modal'),
    $form_login = $form_modal.find('#login'),
    $form_signup = $form_modal.find('#signup'),
    $form_modal_tab = $('.switcher'),
    $tab_login = $form_modal_tab.children('li').eq(0).children('a'),
    $tab_signup = $form_modal_tab.children('li').eq(1).children('a'),  
    $main_nav = $('.main-nav');
    $form_data = $(this).serialize()
     
    $main_nav.on('click', function(e){
      if( $(e.target).is($main_nav) ) {
        $(this).children('ul').toggleClass('is-visible');
      } else {
        $main_nav.children('ul').removeClass('is-visible');
        //show modal layer
        $form_modal.addClass('is-visible'); 
        //show the selected form
        ( $(e.target).is('.signup') ) ? signup_selected() : login_selected();
      }
    });
  
    //close modal
    $('.user-modal').on('click', function(e){
        if( $(e.target).is($form_modal) || $(e.target).is('.close-form') ) {
            $form_modal.removeClass('is-visible');
      } 
    });

    $(document).keyup(function(e){
        //Close when esc key is pressed
        if(e.which=='27'){
            $form_modal.removeClass('is-visible');
        }
      });
  
    // switch tabs
    $form_modal_tab.on('click', function(e) {
        e.preventDefault();
        ( $(e.target).is( $tab_login ) ) ? login_selected() : signup_selected();
    });
  
    //hide or show password
    $('.hide-password').on('click', function(){
        var $this= $(this),
        $password_field = $this.prev('input');

      ( 'password' == $password_field.attr('type') ) ? $password_field.attr('type', 'text') :  
        $password_field.attr('type', 'password');
      ( 'Show' == $this.text() ) ? $this.text('Hide') : $this.text('Show');
    });
  
    function login_selected(){
        $form_login.addClass('is-selected');
        $form_signup.removeClass('is-selected');
        $tab_login.addClass('selected');
        $tab_signup.removeClass('selected');
    }
  
    function signup_selected(){
        $form_login.removeClass('is-selected');
        $form_signup.addClass('is-selected');
        $tab_login.removeClass('selected');
        $tab_signup.addClass('selected');
    }
// ----------------------------------------
// ---------------End Modal----------------
// ----------------------------------------

// Validate user in DB
$('#signin-form').on('submit',function(e){
    e.preventDefault();
    let email = ($('#signin-email').val()),
        password = ($('#signin-password').val())
        console.log(email)
        console.log(password)
    $.ajax({
        dataType: 'json',
        method: 'GET',
        url:'/user',
        data:{
            email,
            password
        },
        success: function(res){
            let token = res.token
            console.log('TOKEN'+JSON.stringify(token))
            localStorage.setItem('User Token', token);
            localStorage.setItem('User Email', email);
            console.log("success " + JSON.stringify(res))
        },
        error: function(res){console.log('Error:' + JSON.stringify(res))}
    })
    
    }
)

$('#signup-form').on('submit', function(e){
        e.preventDefault();
        let username = ($('#signup-username').val()),
            email = ($('#signup-email').val()),
            password = ($('#signup-password').val())

        $.ajax({
            dataType: 'json',
            method: 'POST',
            url:'/user',
            data:{
                username,
                email,
                password
            },
            success: function(){console.log("success")},
            error: function(res){console.log('Error:' + JSON.stringify(res))}
        })
    }
)


  
  
