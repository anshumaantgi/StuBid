import User from "../models/User"
import {createUserWithEmailAndPassword, sendEmailVerification} from 'firebase/auth'
import { doc, setDoc} from "firebase/firestore"; 

export default class RegisterationView {
    constructor(db, auth) {
        this.db  = db;
        this.auth = auth;
        this.user = null;
    }
    
    async createUser(name, email, originUni, password,repassword ) {
        if (password != repassword ) {
            throw new Error("Passwords Do Not Match ! ");
        }
        else {
            this.user = new User(name, email, originUni, new Date().toLocaleString());
            await createUserWithEmailAndPassword(this.auth, email, password)
            .then((userCredential) => {
            // Signed in 
            const logger = userCredential.user;
            
            //Setting User Id
            this.user.setId(logger.uid);

            //Sending Email Verification
            sendEmailVerification(logger);

            // Storing User in Collection
            setDoc(doc(this.db,'users',this.user.id), this.user.ToFirestore());

            })
            .catch((error) => {
            const errorMessage = error.message;
            throw new Error(errorMessage);
            });


        }
    }

 }

