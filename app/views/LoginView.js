import { signInWithEmailAndPassword } from "firebase/auth";

export default class LoginView {
    constructor(auth) {
        this.auth = auth;
        this.user = null;
    }

    async logUser( email, password ) {

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