/* eslint-disable @typescript-eslint/explicit-function-return-type */
import fetch from 'node-fetch';
import MyToken from './myToken';
import { ApiRoot, createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import {
    ClientBuilder,

    // Import middlewares
    type AuthMiddlewareOptions, // Required for auth
    type HttpMiddlewareOptions,
    PasswordAuthMiddlewareOptions,
    Client,
} from '@commercetools/sdk-client-v2';

const projectKey = 'ecom_app';
const scopes = [
    'view_cart_discounts:ecom_app manage_orders:ecom_app view_project_settings:ecom_app manage_my_shopping_lists:ecom_app manage_customers:ecom_app view_messages:ecom_app view_published_products:ecom_app manage_my_profile:ecom_app view_shipping_methods:ecom_app manage_shopping_lists:ecom_app view_shopping_lists:ecom_app view_payments:ecom_app view_orders:ecom_app view_categories:ecom_app view_discount_codes:ecom_app manage_my_orders:ecom_app',
];

const myToken = new MyToken();

// Configure authMiddlewareOptions
const authMiddlewareOptions: AuthMiddlewareOptions = {
    host: 'https://auth.europe-west1.gcp.commercetools.com',
    projectKey: projectKey,
    credentials: {
        clientId: 'UJTD3OU8CioK_XrFbFC_efra',
        clientSecret: 't_OVmNdZWvATtcojxwUvAUzlQxTrhIti',
    },
    scopes,
    fetch,
};

// Configure httpMiddlewareOptions
const httpMiddlewareOptions: HttpMiddlewareOptions = {
    host: 'https://api.europe-west1.gcp.commercetools.com',
    fetch,
};

function getPasswordFlowOptions(username: string, password: string) {
    const options: PasswordAuthMiddlewareOptions = {
        host: 'https://auth.europe-west1.gcp.commercetools.com',
        projectKey: projectKey,
        credentials: {
            clientId: 'UJTD3OU8CioK_XrFbFC_efra',
            clientSecret: 't_OVmNdZWvATtcojxwUvAUzlQxTrhIti',
            user: {
                username: username,
                password: password,
            },
        },
        tokenCache: myToken,
        scopes,
        fetch,
    };
    return options;
}

export const getCredentialFlowClient = (): Client => {
    const ctpClient = new ClientBuilder()
        .withProjectKey(projectKey)
        .withClientCredentialsFlow(authMiddlewareOptions)
        .withHttpMiddleware(httpMiddlewareOptions)
        .withLoggerMiddleware() // Include middleware for logging
        .build();

    return ctpClient;
};

export const getPasswordFlowClient = (username: string, password: string): Client => {
    const ctpClient = new ClientBuilder()
        .withProjectKey(projectKey)
        .withClientCredentialsFlow(authMiddlewareOptions)
        .withPasswordFlow(getPasswordFlowOptions(username, password))
        .withHttpMiddleware(httpMiddlewareOptions)
        .withLoggerMiddleware() // Include middleware for logging
        .build();

    return ctpClient;
};

// export const apiRoot = createApiBuilderFromCtpClient(
//     getPasswordFlowClient('julia2@example.com', 'examplePassword')
// ).withProjectKey({ projectKey: 'ecom_app' });

// const getProject = async () => {
//     try {
//         apiRoot
//             .me()
//             .login()
//             .post({
//                 body: {
//                     email: 'julia2@example.com',
//                     password: 'examplePassword',
//                 },
//             })
//             .execute();
//         console.log(myToken);
//         (myToken.get().token);
//     } catch (error) {
//         console.log(error);
//     }
// };
// Retrieve Project information and output the result to the log

// getProject();

// Example call to return Project information
// This code has the same effect as sending a GET request to the commercetools Composable Commerce API without any endpoints.
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type

// // Retrieve Project information and output the result to the log
// getProject().then(console.log).catch(console.error);
