import { Linking } from 'react-native';
import qs from 'qs';

const sendemail = (aId) => {

    async function sendEmail(to, subject, body, options = {}) {
        const { cc, bcc } = options;
    
        let url = `mailto:${to}`;
    
        // Create email link query
        const query = qs.stringify({
            subject: subject,
            body: body,
            cc: cc,
            bcc: bcc
        });
    
        if (query.length) {
            url += `?${query}`;
        }
    
        // check if we can use this link
        const canOpen = await Linking.canOpenURL(url);
    
        if (!canOpen) {
            throw new Error('Provided URL can not be handled');
        }
    
        return Linking.openURL(url);
    }

    sendEmail(
        'stubiduser2122@gmail.com',
           'We need your feedback',
        'UserName, we need 2 minutes of your time to fill this quick survey [link]',
     { cc: 'e0726931@u.nus.edu'}
    ).then(() => {
        console.log('Your message was successfully sent!');
    });
    
}

export default sendemail;
