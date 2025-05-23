# Smat token dashboard

TODO!

</br>

---

</br>

## Environment variables:

Create a `.env.local` file and add the following variables:

~~~~
# API

BASE_API_URL=

# CONFIG

NEXT_PUBLIC_SMAT_APP_URL=https://app.smat.io
NEXT_PUBLIC_DOMAIN=http://localhost:3000

# Minio

NEXT_PUBLIC_MINIO_BUCKET=
NEXT_PUBLIC_MINIO_URL=
MINIO_ACCESS_KEY=
MINIO_SECRET_KEY=

# SMAT
NEXT_PUBLIC_SMAT_WALLET=
NEXT_PUBLIC_TEST_WALLET=
NEXT_PUBLIC_SMAT_TOKEN_CONTRACT_ADDRESS=
NEXT_PUBLIC_PITCHDECK_FR=
NEXT_PUBLIC_PITCHDECK_EN=

# DEBUG
I18N_DEBUG=false

# reCaptcha
NEXT_PUBLIC_CAPTCHA_CLIENT_PK=
CAPTCHA_SERVER_PK=

# Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=
NEXT_PUBLIC_GA_DEBUG=

#Auth0
AUTH0_SECRET=
AUTH0_BASE_URL=$NEXT_PUBLIC_DOMAIN
AUTH0_ISSUER_BASE_URL=https://dev-yztvar0b.us.auth0.com
AUTH0_CLIENT_ID=
AUTH0_CLIENT_SECRET=
AUTH0_AUDIENCE=
AUTH_NAMESPACE=

# SiwE RPC URLs

NEXT_PUBLIC_ALCHEMY_MUMBAI_ID=KHi4ouNT3IVrSjd6hXf3i3WK0IWsCqKs
NEXT_PUBLIC_ALCHEMY_POLYGON_ID=ZJga2LVfdIAWXd4S5kHmIw1qiH68N5bd
NEXT_PUBLIC_ALCHEMY_MAINNET_ID=bJ1mxcJxtTd_duK4fSkVG6wh99O3ewQ2
NEXT_PUBLIC_ALCHEMY_GOERLI_ID=Ci86kon2AYuEAvBN9oW00nRZQOIjDhdU

# RAMP

NEXT_PUBLIC_RAMP_API_KEY=
NEXT_PUBLIC_RAMP_TEST_API_KEY=

# FEATURE FLAGS

NEXT_PUBLIC_FEATURE_RAMP=true
NEXT_PUBLIC_FEATURE_DASHBOARD=true
NEXT_PUBLIC_SMAT_TOKEN_STATUS=true
~~~~
## Available Scripts

In the project directory, you can run:

### `yarn dev`

Runs the app in the development mode.

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `yarn build`

Builds the app for production to the `.next` folder using `.env.production` env vars.
It correctly bundles React/Next in production mode and optimizes the build for the best performance.
The build is minified and the filenames include the hashes. </br>
**BE CAREFUL: all environments are production ones, so data will be sent to production API**

### `yarn start`

Run the application builded files in [http://localhost:3000](http://localhost:3000) so you can verify that builded app works as expected.
