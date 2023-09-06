/* eslint-disable @typescript-eslint/explicit-function-return-type */
import MyToken from './myToken';
import fetch from 'node-fetch';
import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import {
    ClientBuilder,

    // Import middlewares
    type AuthMiddlewareOptions, // Required for auth
    type HttpMiddlewareOptions,
    PasswordAuthMiddlewareOptions,
    Client,
    AnonymousAuthMiddlewareOptions,
} from '@commercetools/sdk-client-v2';

const CTP_PROJECT_KEY = 'ecom_app';
const CTP_CLIENT_SECRET = 'SOD9EBG_EpE0m8SVaeJa5DaIWQnT6sm2';
const CTP_CLIENT_ID = 'Kw1PsiB2LYvTBb6ClYXf2qRB';
const CPT_AUTH_URL = 'https://auth.europe-west1.gcp.commercetools.com';
const CPT_API_URL = 'https://api.europe-west1.gcp.commercetools.com';
const CPT_SCOPES = [
    'view_cart_discounts:ecom_app manage_orders:ecom_app view_project_settings:ecom_app manage_my_shopping_lists:ecom_app manage_customers:ecom_app view_messages:ecom_app view_published_products:ecom_app introspect_oauth_tokens:ecom_app manage_my_profile:ecom_app view_shipping_methods:ecom_app create_anonymous_token:ecom_app manage_products:ecom_app manage_shopping_lists:ecom_app view_shopping_lists:ecom_app view_payments:ecom_app view_orders:ecom_app view_categories:ecom_app view_discount_codes:ecom_app manage_my_orders:ecom_app',
];
const ANONYMOUS_ID = 'idAnonym1';

export const myToken = new MyToken();

// Configure authMiddlewareOptions
const authMiddlewareOptions: AuthMiddlewareOptions = {
    host: CPT_AUTH_URL,
    projectKey: CTP_PROJECT_KEY,
    credentials: {
        clientId: CTP_CLIENT_ID,
        clientSecret: CTP_CLIENT_SECRET,
    },
    scopes: CPT_SCOPES,
    fetch,
};

// Configure httpMiddlewareOptions
const httpMiddlewareOptions: HttpMiddlewareOptions = {
    host: CPT_API_URL,
    fetch,
};

const anonymousMiddlewareOptions: AnonymousAuthMiddlewareOptions = {
    host: 'https://auth.europe-west1.gcp.commercetools.com',
    projectKey: 'ecom_app',
    credentials: {
        clientId: CTP_CLIENT_ID,
        clientSecret: CTP_CLIENT_SECRET,
        anonymousId: ANONYMOUS_ID,
    },
    scopes: [
        'view_cart_discounts:ecom_app manage_orders:ecom_app view_project_settings:ecom_app manage_my_shopping_lists:ecom_app manage_customers:ecom_app view_messages:ecom_app view_published_products:ecom_app manage_my_profile:ecom_app view_shipping_methods:ecom_app manage_shopping_lists:ecom_app view_shopping_lists:ecom_app view_payments:ecom_app view_orders:ecom_app view_categories:ecom_app view_discount_codes:ecom_app manage_my_orders:ecom_app',
    ],
    fetch,
};

function getPasswordFlowOptions(username: string, password: string) {
    const options: PasswordAuthMiddlewareOptions = {
        host: CPT_AUTH_URL,
        projectKey: CTP_PROJECT_KEY,
        credentials: {
            clientId: CTP_CLIENT_ID,
            clientSecret: CTP_CLIENT_SECRET,
            user: {
                username: username,
                password: password,
            },
        },
        tokenCache: myToken,
        scopes: CPT_SCOPES,
        fetch,
    };
    return options;
}
export const getCredentialFlowClient = (): Client => {
    const ctpClient = new ClientBuilder()
        .withProjectKey(CTP_PROJECT_KEY)
        .withClientCredentialsFlow(authMiddlewareOptions)
        //.withAnonymousSessionFlow(anonymousMiddlewareOptions)
        .withHttpMiddleware(httpMiddlewareOptions)
        .withLoggerMiddleware()
        .build();

    return ctpClient;
};

export const getAnonymousFlowClient = (): Client => {
    const ctpClient = new ClientBuilder()
        .withProjectKey(CTP_PROJECT_KEY)
        .withClientCredentialsFlow(authMiddlewareOptions)
        .withAnonymousSessionFlow(anonymousMiddlewareOptions)
        .withHttpMiddleware(httpMiddlewareOptions)
        .withLoggerMiddleware()
        .build();

    return ctpClient;
};

export const getPasswordFlowClient = (username: string, password: string): Client => {
    const ctpClient = new ClientBuilder()
        .withProjectKey(CTP_PROJECT_KEY)
        .withClientCredentialsFlow(authMiddlewareOptions)
        .withPasswordFlow(getPasswordFlowOptions(username, password))
        .withHttpMiddleware(httpMiddlewareOptions)
        .withLoggerMiddleware() // Include middleware for logging
        .build();

    return ctpClient;
};

export const getApiRootForCredentialFlow = () => {
    const apiRootForAnonumousFlow = createApiBuilderFromCtpClient(getCredentialFlowClient()).withProjectKey({
        projectKey: CTP_PROJECT_KEY,
    });

    return apiRootForAnonumousFlow;
};

export const getApiRootForAnonymousFlow = () => {
    const apiRootForAnonumousFlow = createApiBuilderFromCtpClient(getAnonymousFlowClient()).withProjectKey({
        projectKey: CTP_PROJECT_KEY,
    });

    return apiRootForAnonumousFlow;
};

export const getApiRootForPasswordFlow = (username: string, password: string) => {
    const apiRootForPasswordFlow = createApiBuilderFromCtpClient(
        getPasswordFlowClient(username, password)
    ).withProjectKey({
        projectKey: CTP_PROJECT_KEY,
    });

    return apiRootForPasswordFlow;
};
