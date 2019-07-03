# Auth Service for Elevate


Uses bindaas endpoint to determine users and their permissions.

Set SECRET to the jwt secret, or use /keys/certificate with a certificate, or /keys/jwk.json with a jwk.

Use EXPIRY to set a token expiration other than the default one hour.

This tool needs key and key.pub mounted to /keys to sign JWTs to elevate. In this distribution, run jwt_keys/make_keys.sh to do so.
