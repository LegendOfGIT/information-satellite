module.exports =
    () => {
        const environment = process.env.NODE_ENV || 'production';
        const configuration = {
            development: {
                application: {
                    host: '127.0.0.1'
                },
                services: {
                    satelliteController: {
                        host: '127.0.0.1'
                    },
                    warehouse: {
                        host: '127.0.0.1'
                    }
                }
            },
            production: {
                application: {
                    host: '0.0.0.0'
                },
                services: {
                    satelliteController: {
                        host: 'satellite-controller'
                    },
                    warehouse: {
                        host: 'warehouse'
                    }
                }
            }
        }

        return configuration[environment];
    };