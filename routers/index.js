const authRoute = require('./routeAuth');
const movieRoute = require('./routeMovie');
const cinemaRoute = require('./routeCinema');
const userRoute = require('./routeUser');

function route(app) {
    app.use('/auth', authRoute);
    app.use('/api', movieRoute);
    app.use('/api', cinemaRoute);
    app.use('/api', userRoute);
}

module.exports = route;