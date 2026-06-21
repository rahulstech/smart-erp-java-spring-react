package com.github.rahulstech.smarterp.common.exception;

import org.springframework.http.HttpStatus;

public class HttpException extends RuntimeException {

    public final HttpStatus status;

    public HttpException(int code, String message) {
        super(message);
        this.status = HttpStatus.valueOf(code);
    }


    public static HttpException notFound(String message) {
        return new HttpException(404, message);
    }

    public static HttpException badRequest(String message) {
        return new HttpException(400, message);
    }

    public static HttpException unauthorized(String message) {
        return new HttpException(401, message);
    }

    public static HttpException forbidden(String message) {
        return new HttpException(403, message);
    }

    public static HttpException internalServerError(String message) {
        return new HttpException(500, message);
    }
}
