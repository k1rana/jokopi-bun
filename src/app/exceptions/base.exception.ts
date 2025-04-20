type BaseExceptionOptions = {
    status?: number;
    code?: string;
}

export class BaseException extends Error {
    status: number;
    code?: string;
    constructor(message: string, {
        status = 500,
        code,
    }: BaseExceptionOptions = {
        }) {
        super(message);
        this.status = status;
        this.code = code;
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}