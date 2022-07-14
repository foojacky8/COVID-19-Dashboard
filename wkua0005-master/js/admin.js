/**
 * For admin only (superuser), to check the list of users.
 * Also support assign and deassign admin.
 * 
 * @author Hou Ruiqian <rhou0006@student.monash.edu>
 * @author Kuan Wai Shuet <wkua0005@student.monash.edu>
 * Reference: candraKriswinarto's Firebase Realtime Database for Web 
 *            https://github.com/candraKriswinarto/firestore-crud
 * 
 * Created at     : 2021-09-05 02:30
 * Last modified  : 2021-09-10 09:00 
 */

const btnBack = document.querySelector('.btn-back');
const tableUsers = document.querySelector('.table-users');

let id;

// Create element and render users
const renderUser = doc => {
  //console.log(doc.data());

  const tr = `
    <tr data-id='${doc.id}'>
      <td>${doc.data().username}</td>
      <td>${doc.data().phone}</td>
      <td>${doc.data().email}</td>
      <td>${doc.data().lastSignInTime}</td>
      <td>${doc.data().loginCount}</td>
    </tr>
  `;
  tableUsers.insertAdjacentHTML('beforeend', tr);

};

// Click back button
btnBack.addEventListener('click', () => {
  window.location = "index.html";
});


//Real time listener
db.collection('users').onSnapshot(snapshot => {
  snapshot.docChanges().forEach(change => {
    if(change.type === 'added') {
      renderUser(change.doc);
    }
    if(change.type === 'removed') {
      let tr = document.querySelector(`[data-id='${change.doc.id}']`);
      let tbody = tr.parentElement;
      tableUsers.removeChild(tbody);
    }
    if(change.type === 'modified') {
      let tr = document.querySelector(`[data-id='${change.doc.id}']`);
      let tbody = tr.parentElement;
      tableUsers.removeChild(tbody);
      renderUser(change.doc);
    }
  })
});