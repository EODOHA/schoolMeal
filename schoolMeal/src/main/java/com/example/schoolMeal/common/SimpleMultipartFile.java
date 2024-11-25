package com.example.schoolMeal.common;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.file.Files;

import org.springframework.web.multipart.MultipartFile;

/*
	MultipartFile을 구현한 임시 파일 클래스로,
	실제 웹 요청에서 사용되는 MultipartFile을 처리하는 방법을 시뮬레이션하기 위함
*/
public class SimpleMultipartFile implements MultipartFile {

    private final File file;

    public SimpleMultipartFile(File file) {
        this.file = file;
    }

    @Override
    public String getName() {
        return file.getName();
    }

    @Override
    public String getOriginalFilename() {
        return file.getName();
    }

    @Override
    public String getContentType() {
        try {
            return Files.probeContentType(file.toPath());
        } catch (IOException e) {
            return "application/octet-stream"; // 기본값
        }
    }

    @Override
    public boolean isEmpty() {
        return file.length() == 0;
    }

    @Override
    public long getSize() {
        return file.length();
    }

    @Override
    public byte[] getBytes() throws IOException {
        try (InputStream inputStream = new FileInputStream(file)) {
            return inputStream.readAllBytes();
        }
    }

    @Override
    public InputStream getInputStream() throws IOException {
        return new FileInputStream(file);
    }

    @Override
    public void transferTo(File dest) throws IOException, IllegalStateException {
        try (InputStream inputStream = new FileInputStream(file);
             OutputStream outputStream = new FileOutputStream(dest)) {
            inputStream.transferTo(outputStream);
        }
    }
}
