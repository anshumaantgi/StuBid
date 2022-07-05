import { sendPasswordResetEmail } from "firebase/auth";

export default class ForgotPasswordView {
    constructor(auth) {
        this.auth = auth;
    }

    async resetPassword(email) {
        /**
         * Resets User's Password , by sending a rest password link to the email Provided
         * 
         * @Params : email
         */
        await sendPasswordResetEmail(this.auth, email)
        .then(() => {
            console.log(email);
          })
        .catch((err) => {
            console.log(err);
            throw new Error(err.message);});
    }

}