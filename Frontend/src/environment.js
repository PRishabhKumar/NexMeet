let IS_PROD = false;
const server = IS_PROD ?
    "https://nexmeet-backend-lio2.onrender.com" :

    "http://localhost:3000"


export default server;