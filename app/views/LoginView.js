import { signInWithEmailAndPassword } from "firebase/auth";

export default class LoginView {
    constructor(auth) {
        this.auth = auth;
        this.user = null;
    }

    async logUser( email, password ) {
        /**
         * Sends User credentials to the Firebase module functions , so user can be authenticated
         * 
         * @Params : email , password
         * @Return : None
         * @Throw : FireBase Errors
         */

        await signInWithEmailAndPassword(this.auth, email, password)
        .then((userCredential) => {
            // Signed in 
            let logger =  userCredential.user;
            if (logger.emailVerified){
                return logger;
            } else {
                throw new Error("Please verify your email First !");
            }
            
          })
          .catch((error) => {
            throw new Error(error.message);
          });
    }
}