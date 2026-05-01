let IS_PROD = false;
const server = IS_PROD ?
    "https://your-new-backend-url.onrender.com" : // <-- Replace with your new backend URL

    "http://localhost:8000"


export default server;