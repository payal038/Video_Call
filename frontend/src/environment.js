let IS_PROD = true;
const server = IS_PROD
    ? "https://video-call-5z81.onrender.com"
    : "http://localhost:8000"

export default server;