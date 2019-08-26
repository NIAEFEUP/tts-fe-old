require("dotenv-flow").config();

export default {
    port: process.env.PORT,
    apiUri: process.env.API_URI,
};
