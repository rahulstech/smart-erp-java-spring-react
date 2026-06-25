package com.github.rahulstech.smarterp.common.exception;

import com.github.rahulstech.smarterp.common.dto.ErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.jspecify.annotations.NonNull;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;
import java.util.stream.Collectors;

/**
 * Intercepts exceptions thrown by controllers and translates them 
 * into uniform, structured JSON error responses.
 */
@Slf4j
@RestControllerAdvice
public class GlobalErrorHandler {

    /**
     * Translates application HttpException instances into appropriate
     * HTTP response entities carrying a simple error message.
     */
    @ExceptionHandler(HttpException.class)
    public ResponseEntity<@NonNull ErrorResponse> handleHttpException(HttpException e) {
        var body = new ErrorResponse.SimpleError(e.status.value(), e.getMessage());
        return ResponseEntity.status(e.status).body(body);
    }

    /**
     * Processes controller validation failures. Logs the failed URI path at ERROR level
     * and maps each rejected field's cause into a detailed debug string and a JSON response.
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<@NonNull ErrorResponse> handleValidationException(
            MethodArgumentNotValidException e, HttpServletRequest request) {
        
        // Log the endpoint path that failed validation
        log.error("Validation error on path: {}", request.getRequestURI());

        // Log specific field names and values for debugging
        if (log.isDebugEnabled()) {
            String debugDetails = e.getBindingResult().getFieldErrors().stream()
                    .map(error -> String.format("field='%s', value='%s', message='%s'",
                            error.getField(), error.getRejectedValue(), error.getDefaultMessage()))
                    .collect(Collectors.joining("; "));
            log.debug("Validation failure details: {}", debugDetails);
        }

        // Collect distinct field validation errors into a map.
        // If the same field fails multiple constraints, the first message is retained.
        Map<String, String> reasons = e.getBindingResult().getFieldErrors().stream()
                .filter(error -> error.getField() != null && error.getDefaultMessage() != null)
                .collect(Collectors.toMap(
                        FieldError::getField,
                        FieldError::getDefaultMessage,
                        (existing, replacement) -> existing
                ));

        var body = new ErrorResponse.FieldError(HttpStatus.BAD_REQUEST.value(), reasons);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
    }
}
