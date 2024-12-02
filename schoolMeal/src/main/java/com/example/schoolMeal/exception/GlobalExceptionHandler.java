package com.example.schoolMeal.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

// 커스텀 예외처리 핸들러 -> 클라이언트로 사용자에게 오류 메세지 반환
@RestControllerAdvice
public class GlobalExceptionHandler {

	@ExceptionHandler(FileUploadException.class)
	public ResponseEntity<String> handleFileUploadException(FileUploadException e) {
		return ResponseEntity.badRequest().body("파일 업로드 실패: " + e.getMessage());
	}

	@ExceptionHandler(FileDownloadException.class)
	public ResponseEntity<String> handleDownloadException(FileDownloadException e) {
		return ResponseEntity.badRequest().body("파일 다운로드 실패: " + e.getMessage());

	}
	
}
