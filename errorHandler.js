
class CustomizedError extends Error {
    constructor(message, statuscode) {
        super(message);
        this.message = message;
        this.statuscode = statuscode
    }

    validationError(error) {
        
    }

}