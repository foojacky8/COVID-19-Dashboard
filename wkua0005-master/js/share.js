/**
 * Javascript for that will be used in multiplt html.
 * Include the code to get the current signed in user and code for log out.
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
 *            Google Firebase official documentation for FireStore service
 *            https://firebase.google.com/docs/firestore/manage-data/add-data
 * 
 * Created at     : 2021-09-05 02:30
 * Last modified  : 2021-09-10 20:00 
 */

// Get the current signed in user
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      let user_id = user.uid;
      let docRef = db.collection("users").doc(user_id);
      docRef.get().then((doc) => {
          if (doc.exists) {
              console.log("Document data:", doc.data());
              //Updating profile details
              let username_ref = document.getElementById("username");
              let email_ref = document.getElementById("email");
              username_ref.innerHTML = doc.data().username;
              email_ref.innerHTML = doc.data().email;
              // Registered Users Button for SuperUser
              let registered_users_ref = document.getElementById("registered_users");
              if (doc.data().superuser) {
                registered_users_ref.style.display = "block";
              }
          } else {
              // doc.data() will be undefined in this case
              console.log("No such document!");
          }
      }).catch((error) => {
          console.log("Error getting document:", error);
      });

    } else {
      // User is signed out
      console.log("No user");
    }
  });

// Logout
let btn_sign_out_ref = document.getElementById("sign-out-btn");
btn_sign_out_ref.addEventListener("click", (e) => {
    e.preventDefault();
    firebase.auth().signOut().then((userCredential) => {
        console.log("User has signed out");
    });
    window.location = "login-register.html";
    alert("Log out successfully");
});