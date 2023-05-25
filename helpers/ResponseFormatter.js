const ResponseFormatter = {
    success: (res, data, message) => {
        res.status(200).json({
            meta: {
                success: true,
                code: 200,
                message: message,
            },
            data: data,
        });
    },
    error: (res, error, message, code) => {
        res.status(code).json({
            meta: {
                success: false,
                code: code,
                message: message,
            },
            data: error,
        });
    }
}

module.exports = ResponseFormatter;