const bodyParser = require('body-parser');
const AuthenticationController = require('../controllers/AuthenticationController');

module.exports = app => {
    app.use(function (req, res, next) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT,DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
        next();
    });

    app.use(bodyParser.json());
    // app.use(AuthenticationController.verifyJWT);
    app.get('/', (req, res) => res.send('Checkout Microservice'));
    app.post('/login', AuthenticationController.login)
}