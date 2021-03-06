import User from "../models/User"
import {createUserWithEmailAndPassword, sendEmailVerification} from 'firebase/auth'
import { doc, setDoc} from "firebase/firestore"; 
import moment from "moment-timezone";

export default class RegisterationView {
    constructor(db, auth) {
        this.db  = db;
        this.auth = auth;
        this.user = null;
    }
    
    async createUser(name, email, originUni, password,repassword ) {
        /**
         * Creates a User used FireBase Authentication Module 
         * Also , sends User email Verification Link and stores user object inside FireStore
         * 
         * @Params : name, email, originUni, password,repassword
         * @Return : None
         * @Throw : Firebase Errors
         */
        if (password != repassword ) {
            throw new Error("Passwords Do Not Match!");
        }
        else {
            this.user = new User(name, email, originUni, moment().tz('Singapore').format('DD/MM/YYYY, HH:mm:ss'));
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

