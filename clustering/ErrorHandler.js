const expressValidation = require('express-validation');
const errors = require('./errors');

module.exports = (app) => {
    const error_code = {
        INVALID_PARAMETER: 9401,
        NOT_FOUND: 404,
        SERVER_ERROR: 500
    };
    
    app.use((err, req, res, next) => {        
        let miss_param = false;
        console.log(err);

        if (typeof err === "object") {  // 서버쪽 에러
            return res.status(err.status).json({
                status: err.status, message: err.message
            });
        }

        if (err instanceof expressValidation.ValidationError) {  // 잘못된 파라미터 확인
            miss_param = err.errors.map(error => error.messages.join('. ')).join('\n');
            console.log(`\n\x1b[36m[Miss Params] \u001b[0m \n${miss_param}`);
            err = error_code.INVALID_PARAMETER;
        } else if (isNaN(err)) {
            err = error_code.SERVER_ERROR;
        }

        const response_error = errors[err];
        response_error.status = err;
        response_error.miss_param = miss_param ? miss_param : undefined;

        return res.status(response_error.status).json(
            response_error
        );
    });
};