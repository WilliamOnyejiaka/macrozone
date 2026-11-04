import logger from "../../config/logger";
import ApiException from "./api-exception";

export default class TransactionException extends ApiException {

    constructor(message: string, public statusCode: number) {
        logger.error(`TransactionException: ${message} (Status Code: ${statusCode})`);
        super(message, statusCode);
    }
}