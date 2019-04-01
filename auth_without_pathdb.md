# QUIP Auth Without PathDB

## About this Method and Guide

PathDB is used as both authentication and authorization. In instances where PathDB is not desired, we use a combination of an external identity provider and an internal authorization service. The authorization service consumes Json Web Tokens (JWTs) from the identity provider, and then will issue JWTs which convey both authentication and authorization, which are consumed by the application.

This guide aims to explain how to make a deployment use this method.

## Getting an Identity Provider and Setting up Login

There are many identity providers, but for testing and examples, we have been using auth0.

When selecting, an identity provider, note that we expect it to provide a JWT, and to have a certificate/public key/secret which can be used to verify such JWTs.

The example given in the Distro within config/login.html is set up for auth0; simply change the corresponding variables for your auth0 application if auth0 is used. If using another identity provider, then login.html, or equivalent, needs to, at least, set the JWT to a cookie called &quot;token&quot;, and call the auth service&#39;s &#39;check&#39; route, and save a successful result as the token. Follow the guide which your identity provider uses for further guidance.

## Keys/Certificates

Add the following files; by default, they are mounted:

- --./jwt\_keys/certificate or ./jwt\_keys/jwk.json is the certificate/public key/secret or jwk (respectively) from the **identity provider**. (If both are included, the jwk takes precedence).
- --./jwt\_keys/key and ./jwt\_keys/key.pub are used as the signing and check keys for the **auth service**
  - --These can (and should) be generated with ./kwt\_keys/make\_keys.sh

## Deployment Configuration

Turn off disable security under the elevate service to block routes.

## Adding Users to Database

Add users as in ./config/add\_mongo\_users.js. Attributes can be added to deny access to routes (e.g. allow only some users to post and delete)

The name field is the email field (or failing that, sub field) in that priority from the identity provider.
