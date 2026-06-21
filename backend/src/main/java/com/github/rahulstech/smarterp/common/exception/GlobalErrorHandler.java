package com.github.rahulstech.smarterp.common.exception;

import com.github.rahulstech.smarterp.common.dto.ErrorResponse;
import org.jspecify.annotations.NonNull;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalErrorHandler {

    @ExceptionHandler(HttpException.class)
    public ResponseEntity<@NonNull ErrorResponse> handleHttpException(HttpException e) {
        var body = new ErrorResponse.SimpleError(e.status.value(), e.getMessage());
        return ResponseEntity.status(e.status).body(body);
    }
}
