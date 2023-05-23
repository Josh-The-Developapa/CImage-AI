function errorHandler(err, req, res, next) {
    res.status(err.statusCode || 500).json({
        success: true,
        message: err.message
    })
}

export default errorHandler;