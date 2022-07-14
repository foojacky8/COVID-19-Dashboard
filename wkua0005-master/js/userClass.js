/**
 * Constructor for user
 *
 * @author Joshua <jeee0002@student.monash.edu>
 *
 * Created at     : 2021-09-05 02:30 
 * Last modified  : 2021-09-05 03:00
 */

//Global Variables
var EMAILCHECK =/\S+@\S+\.\S+/;

//User Class
class User {
    constructor(id, username, email, password) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
    }
}
