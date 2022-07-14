/**
 * Javascript for login-register.html
 * 
 * @author Jacky Foo <jfoo0016@student.monash.edu>
 * @author Hou Ruiqian <rhou0006@student.monash.edu>
 * @author Kuan Wai Shuet <wkua0005@student.monash.edu>
 * @author Arvind <acha0094@student.monash.edu>
 * @author Joshua Ee <jeee0002@student.monash.edu>
 * @author Jordan Poon <jord0004@student.monash.edu>
 * 
 * Reference: Google Firebase official documentation for Authentication service
 *            https://firebase.google.com/docs/auth/web/manage-users#web-version-8_12
 * 
 *            Google Firebase official documentation for FireStore service
 *            https://firebase.google.com/docs/firestore/manage-data/add-data
 * 
 *            Responsive Login & Registration Form Using HTML & CSS & JS | Sliding Sign In & Sign Up Form
 *            https://www.youtube.com/watch?v=piG91X4sV2U&t=1631s
 * 
 * Created at     : 2021-09-05 02:30
 * Last modified  : 2021-09-10 20:00 
 */

const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const container = document.querySelector(".container");
const parent_container = document.querySelector(".parent-container")

sign_up_btn.addEventListener("click", () => {
  container.classList.add("sign-up-mode");
});

sign_in_btn.addEventListener("click", () => {
  container.classList.remove("sign-up-mode");
});

// Login 
const btn_login_ref = document.getElementById("btn-login");
const btn_forgot_password = document.getElementById("btn-forgot-password")
const btn_close = document.querySelector(".close")
const popup = document.querySelector(".popup")

btn_login_ref.addEventListener("click", () =>{
  let login_email_ref = document.getElementById("login-email");
  let login_password_ref = document.getElementById("login-password");
  
  firebase.auth().signInWithEmailAndPassword(login_email_ref.value, login_password_ref.value).then((userCredential) => {
    // Signed in
    let user_id = userCredential.user.uid;
    let newLastSignInTime = userCredential.user.metadata.lastSignInTime;
    updateLastSignInTime(db,user_id,newLastSignInTime);
    alert("Signed in succesfully!");
    updateLoginCounter(db, user_id);
  })
  .catch((error) => {
    alert(error);
  });
});

// Forgot password 
btn_forgot_password.addEventListener("click", () => {
  popup.classList.remove("hide");
  parent_container.classList.add("blur");
})

// Close button (close the popup window)
btn_close.addEventListener("click", () => {
  popup.classList.add("hide");
  parent_container.classList.remove("blur");

})

//Reset Password
const btn_reset_password = document.getElementById("btn-reset-password");

btn_reset_password.addEventListener("click", () =>{
  let reset_email_ref = document.getElementById("reset-email");
  console.log("reset password");
  firebase.auth().sendPasswordResetEmail(reset_email_ref.value)
  .then(() => {
    // Password reset email sent!
    window.alert("An email to reset your password has been sent to you. Please check your email.");
  })
  .catch((error) => {
    console.log(error)
    window.alert("This email does not exist in our database. Please check for any spelling errors.");
  });
});

// Register
const btn_sign_up_ref = document.getElementById("btn-sign-up");

btn_sign_up_ref.addEventListener("click", () =>{
  let sign_up_username_ref = document.getElementById("sign-up-username");
  let sign_up_email_ref = document.getElementById("sign-up-email");
  let sign_up_password_ref = document.getElementById("sign-up-password");
  let sign_up_phone_ref = document.getElementById("sign-up-phone");
  
  // invalid input for username
  if(!sign_up_username_ref.value){
    alert("Please enter a valid username!")
  }
   // invalid input for email
  else if(!sign_up_email_ref.value){
    alert("Please enter a valid email!")
  }
   // invalid input for password
  else if (sign_up_password_ref.value.length < 8){
    alert("Password should have a minimum of 8 characters!");
  }
  // invalid input for phone number
  else if (sign_up_phone_ref.value.length != 10){
    alert("Please enter a valid phone number!");
  }
  // register successfully
  else{
    firebase.auth().createUserWithEmailAndPassword(sign_up_email_ref.value, sign_up_password_ref.value).then((userCredential) => {
      let user_id = userCredential.user.uid;
      addUserToFirestore(db,user_id,sign_up_username_ref,sign_up_email_ref,sign_up_phone_ref);
      alert("Signed up successfully!");
      container.classList.remove("sign-up-mode");
    })
    .catch((error) => {
      alert(error);
    });
  }
});

// Function to add new user account in Firestore
function addUserToFirestore(db,user_id,sign_up_username_ref,sign_up_email_ref,sign_up_phone_ref){
  db.collection('users').doc(user_id).set({
    username: sign_up_username_ref.value,
    email: sign_up_email_ref.value,
    phone: sign_up_phone_ref.value,
    superuser: false,
    lastSignInTime: "New User!",
    loginCount: 0,
  });
}

//
function updateLastSignInTime(db,user_id,newLastSignInTime){
  db.collection('users').doc(user_id).update({
    lastSignInTime: newLastSignInTime,
  });
}

//Function to count logins
function updateLoginCounter(db,user_id){
  const increment = firebase.firestore.FieldValue.increment(1);
  db.collection('users').doc(user_id).update({
    loginCount: increment
  }).then(function() {
    window.location = "index.html";
  });
}