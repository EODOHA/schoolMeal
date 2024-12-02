package com.example.schoolMeal.exception;

// 파일 다운로드 예외처리
public class FileDownloadException extends RuntimeException {
	public FileDownloadException(String message) {
		super(message);
	}

	public FileDownloadException(String message, Throwable cause) {
		super(message, cause);
	}
	
}
