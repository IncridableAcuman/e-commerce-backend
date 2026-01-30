package com.server.exception;

import com.server.dto.ErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;


@RestControllerAdvice
public class GlobalExceptionHandler {

    private ResponseEntity<ErrorResponse> buildErrorResponse(Exception e,HttpStatus status,HttpServletRequest request){
        ErrorResponse errorResponse = new ErrorResponse(
                status.value(),
                status.getReasonPhrase(),
                e.getMessage(),
                request.getRequestURI(),
                LocalDateTime.now()
        );
        return ResponseEntity.status(status).body(errorResponse);
    }

    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<ErrorResponse> badRequest( BadRequestException e, HttpServletRequest request){
        return buildErrorResponse(e,HttpStatus.BAD_REQUEST,request);
    }
    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<ErrorResponse> notFound(NotFoundException e,HttpServletRequest request){
        return buildErrorResponse(e,HttpStatus.NOT_FOUND,request);
    }
    @ExceptionHandler(UnAuthorizeException.class)
    public ResponseEntity<ErrorResponse> unAuthorize(UnAuthorizeException e,HttpServletRequest request){
        return buildErrorResponse(e,HttpStatus.UNAUTHORIZED,request);
    }
}
