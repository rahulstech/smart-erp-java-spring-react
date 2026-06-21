package com.github.rahulstech.smarterp.common.dto;

public sealed interface ErrorResponse {

    record SimpleError(int code, String message) implements ErrorResponse {}
}
