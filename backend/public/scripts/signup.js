jQuery(document).ready(function($){
    if (localStorage.getItem('logged-in')){
        $form_modal.removeClass('is-visible');
        $('.profile-page').addClass('is-visible')
        $('.landing-page').css('display','none')

    }
})

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
        ($(e.target).is('.signup') ) ? signup_selected() : login_selected();
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
    let username = ($('#signin-username').val()),
        password = ($('#signin-password').val())
    $.ajax({
        dataType: 'json',
        method: 'GET',
        url:'/user',
        data:{
            username,
            password
        },
        success: function(res){
            let token = res.token
            console.log(res.token)
            localStorage.setItem('usertoken', token);
            localStorage.setItem('username', username);
            localStorage.setItem('logged-in', true)
            loadLoginPage()

        },
        error: function(res){
            console.log('Error:' + JSON.stringify(res))
        }
    })
})

$('#sign-up-submit').on('click', function(e){
        e.preventDefault();
    
    let username = ($('#signup-username').val()),
        email = ($('#signup-email').val()),
        password = ($('#signup-password').val())

    
    if(!signUpVal()){
        console.log('WARN: Invalid signup')
        return false
    } else {

        $.ajax({
            dataType: 'json',
            method: 'POST',
            // changed from /user
            url:`/user/${username}`,
            data:{
                username,
                email,
                password
            },
            success: function(res){
                console.log(res)
                let token = res.token
                localStorage.setItem('username', username);
                localStorage.setItem('usertoken', token);
                localStorage.setItem('useremail', email);
        
                $form_modal.removeClass('is-visible');
                $('.profile-page').addClass('is-visible')
                $('.landing-page').css('display','none')

                localStorage.setItem('logged-in', true);
            },
            error: function(res){
                console.log('RES', res)
                console.log('Error:' + JSON.stringify(res))
                document.getElementById("si gnup-errMsg").innerHTML = "Account already exists with provided username or email."
                console.log('acct exist')
            }
        })
    }
})

// sign in form validation
signInVal = () => {
    var username = document.getElementById('signin-username').value
    var password = document.getElementById('signin-password').value

    console.log(username)
    console.log(password)

    if (username == '' || password == ''){
        document.getElementById("signin-errMsg").innerHTML = "Please enter a username or password."
        return false;
    } else {
        return true; 
    }
}

validateEmail= (email) => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

validatePassword = (password) => {
    if (password.length < 8 || password.length >= 64) {
        return false
    }

    const specialCharacters = ["!", "@", "#", "$", "%", "^", "&", "*"]
    let hasSpecialChar = false
    for (let i = 0; i < specialCharacters.length; i++) {
        const specialChar = specialCharacters[i];
        if (password.indexOf(specialChar) != 0) {
            hasSpecialChar = true
            break
        }
        
    }

    if(!hasSpecialChar) {
        return false
    }

    return true
}

signUpVal = () => {
    let 
        username = document.getElementById('signup-username').value,
        password = document.getElementById('signup-password').value
        email = document.getElementById('signup-email').value;

    console.log(username)
    console.log(password)
    console.log(email)

    if (username == '' || password == '' || email == '' ){
        document.getElementById("signup-errMsg").innerHTML = "Please complete the form.";
        return false;
    }
    // } else if (name.length <= 4 || name.length >= 30){
    //     document.getElementById("signup-errMsg").innerHTML = "Username must be between 4 - 30 characters "
    //     return false
    // } 
    if (email.length > 60) {
        document.getElementById("signup-errMsg").innerHTML = "Email must be less than 60 characters";
        return false;
    } 
    if (validatePassword(password) == false){
        document.getElementById("signup-errMsg").innerHTML = "Password must be between eight and thirty characters, contain a lowercase letter, an uppercase letter, one numeric character and one special character.";
        return false;
    }

    if(email.indexOf('@')<=0){
        document.getElementById("signup-errMsg").innerHTML =
        "Email requires an @ sign";
        return false;
    }
    
    console.log('valid')
    return true;
    // TODO: CHECK TO SEE IF WE HAVE AN EXISTING USER W. SAME CREDENTIALS
    // else if (console.log){
    //     document.getElementById("signup-errMsg").innerHTML = "An existing user has with those credentials."
    //     return false;
    // } 
    
}