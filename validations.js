function validateEmpty() {
  n = document.getElementById("name").value;
  e = document.getElementById("email").value;
  p = document.getElementById("pass").value;
  
    console.log("Entra");
  if (n == "" || e == ""  || p  =="" ) {
    alert("You cannot save empty fields, check it and try again");
    return false;
  }else{
    return true
  }
}


function cleanFields(){
  console.log("Entra");
    document.getElementById('name').value = '';
    document.getElementById('email').value = '';
    document.getElementById('pass').value = '';
    

}

function saveData(){
  if(validateEmpty() == true){
    document.getElementById('resp').innerHTML = "Your information was saved";
    cleanFields();
  }
  
}




function validateEmail() {

    var email = document.getElementById('email');
    var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

    if (!filter.test(email.value)) {
    alert('Please provide a valid email address');
    email.focus;
    return false;
 }
}


