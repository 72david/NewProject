var validRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
document.getElementById('login-submit').addEventListener('click',validate);
function validate(){
    const email=document.getElementById('login-email');
    const pass=document.getElementById('login-password');
    const emailparent=email.parentElement;
    const passparent=pass.parentElement;
    let emailerror=emailparent.querySelector('.error');
    let passerror=passparent.querySelector('.error');


    if(!email.value.match(validRegex)){
        emailerror.innerHTML='Enter valid email';
        passerror.innerHTML=null;
    }
    else if(pass.value.length<6){
        
        passerror.innerHTML='Password Must be contain 6 character';
        emailerror.innerHTML=null;
    }
    else{
        window.location.href='assests/home.html';
    }
}
