package com.example.schoolMeal.exception;

// 파일 업로드 예외 처리
public class FileUploadException extends RuntimeException {
	public FileUploadException(String message) {
		super(message);
	}
	
	public FileUploadException(String message, Throwable cause) {
	super(message, cause);	
	}
	

}
