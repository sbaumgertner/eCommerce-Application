import './style.scss';
import App from './app';
//import { getAPIRootWithExistingTokenFlow } from './api/client';

new App();

// getAPIRootWithExistingTokenFlow()
//     .me()
//     .carts()
//     .get()
//     // .post({
//     //     body: { currency: 'USD' },
//     // })
//     .execute()
//     .then((data) => {
//         console.log(data);
//     });

// getAPIRootWithExistingTokenFlow()
//     .me()
//     .carts()
//     .withId({ ID: '420dee88-dda1-4dd7-b537-29a4f11637ac' })
//     .delete({
//         queryArgs: {
//             key: '420dee88-dda1-4dd7-b537-29a4f11637ac',
//             version: 1,
//         },
//     })
// .execute();
