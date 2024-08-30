const errorHandler = (err, req, res, next) => {

    return res.status(500).json({
        error_code: 'INTERNAL_SERVER_ERROR',
        error_description: 'Ocorreu um erro interno no servidor. Por favor, tente novamente mais tarde.'
    });
};

module.exports = errorHandler;
