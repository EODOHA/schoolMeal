package com.example.schoolMeal.common;

import java.io.File;

import org.springframework.beans.factory.annotation.Value;

/* 파일 업로드 경로 */
public abstract class PathResolver {

    @Value("${file.upload.path}")
    private String fileUploadPath;

    protected String buildPath(String directoryName) {
        return fileUploadPath + directoryName + File.separator;
    }
    
    @Value("${image.upload.path}")
    private String imageUploadPath;

    protected String buildPath2(String directoryName) {
        return imageUploadPath + directoryName + File.separator;
    }
}
