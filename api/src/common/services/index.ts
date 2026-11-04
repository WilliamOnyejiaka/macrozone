import ApiException from "../errors/api-exception";

export default class BaseService {

    public normalizeLimit(limit?: number) {
        const MIN_LIMIT = 1;
        const MAX_LIMIT = 50;
        const DEFAULT_LIMIT = 10;
        if (!limit) return DEFAULT_LIMIT;

        return Math.min(Math.max(limit, MIN_LIMIT), MAX_LIMIT);
    }

    public offset(page: number, limit: number) {
        return (page - 1) * limit;
    }

    public responseData(statusCode: number, error: boolean, message: string | null, data: any = {}) {
        return {
            statusCode: statusCode,
            json: {
                error: error,
                message: message,
                data: data
            }
        };
    }

    public successResponse(statusCode: number, message: string | null, data: any = {}) {
        return this.responseData(statusCode, false, message, data);
    }

    public errorResponse(statusCode: number, message: string | null) {
        return this.responseData(statusCode, true, message);
    }

    public pagination(page: number, limit: number, totalRecords: number) {
        const totalPages = Math.ceil(totalRecords / limit);

        return {
            currentPage: page,
            nextPage: page < totalPages ? page + 1 : null,
            prevPage: page > 1 ? page - 1 : null,
            hasNext: page < totalPages,
            hasPrev: page > 1,
            totalPages,
            totalRecords,
        };
    }

    public handleError(error: unknown) {
        console.error(error); // always log for debugging

        if (error instanceof ApiException) return this.responseData(error.statusCode, true, error.message, error.data);

        let statusCode = 500;
        let message = "Something went wrong.";

        const err = error as any;

        if (err?.code) {
            switch (err.code) {
                case "23505": {
                    // unique_violation
                    statusCode = 409;

                    // postgres often provides detail or constraint name
                    const detail = err.detail || err.constraint || "field";
                    message = `Duplicate value violation on: ${detail}.`;
                    break;
                }

                case "23503": {
                    // foreign_key_violation
                    statusCode = 400;

                    const detail = err.detail || "foreign key constraint";
                    message = `Foreign key constraint failed: ${detail}.`;
                    break;
                }

                case "23502": {
                    // not_null_violation
                    statusCode = 400;

                    const column = err.column || "unknown field";
                    message = `Missing required field: ${column}.`;
                    break;
                }

                case "22P02": {
                    // invalid_text_representation
                    statusCode = 400;
                    message = "Invalid input format.";
                    break;
                }

                default: {
                    statusCode = 400;
                    message = "Database request error.";
                }
            }
        }

        // Optional: connection-level errors (depends on driver)
        else if (err?.name === "PostgresError") {
            statusCode = 500;
            message = "Database error occurred.";
        }

        return this.responseData(statusCode, true, message);
    }


}