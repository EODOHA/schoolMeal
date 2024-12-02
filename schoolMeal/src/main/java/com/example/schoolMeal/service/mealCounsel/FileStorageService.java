package com.example.schoolMeal.service.mealCounsel;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.Files;
import java.io.IOException;
import java.util.UUID;

@Service
public class FileStorageService {

    // 파일 저장 루트 디렉토리 그 안에 mealcounsel 디렉토리 추가
    private final Path fileStorageLocation = Paths.get("uploads", "mealcounsel").toAbsolutePath().normalize();

    //생성자에서 파일 저장 디렉토리 생성
    @Autowired
    public FileStorageService() {
        try {
            //'uploads/mealcounsel'디렉토리가 존재하지 않으면 추가
            Files.createDirectories(fileStorageLocation);
        } catch (IOException ex) {
            throw new RuntimeException("파일 저장 디렉토리를 생성할 수 없습니다.", ex);
        }
    }

    public String storeFile(MultipartFile file) {
        try {
            //원본 파일 이름 가져오기 및 유효성 검사
            String originalFileName = file.getOriginalFilename();
            if (originalFileName == null || originalFileName.contains("..")) {
                throw new RuntimeException("파일 이름에 부적절한 경로가 포함되어 있습니다: " + originalFileName);
            }
            
            //파일 확장자 추출
            String fileExtension = "";
            if (originalFileName.contains(".")) {
                fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
            }

            //고유한 파일 이름 생성(UUID)
            String storedFileName = UUID.randomUUID().toString() + fileExtension;
            //파일 저장 위치 설정
            Path targetLocation = fileStorageLocation.resolve(storedFileName);
            //파일 저장(기존파일덮어쓰기 가능)
            Files.copy(file.getInputStream(), targetLocation);
            
            //저장된 파일의 경로 반환
            return targetLocation.toString();
        } catch (IOException ex) {
            throw new RuntimeException("파일 저장에 실패했습니다. 파일명: " + file.getOriginalFilename(), ex);
        }
    }

    public Resource loadFileAsResource(String filePath) {
        try {
            //파일 경로 설정 및 정규화
            Path file = Paths.get(filePath).normalize();
            //파일 리소스 생성
            Resource resource = new org.springframework.core.io.UrlResource(file.toUri());
            if (resource.exists()) {
                //파일이 존재하면 리소스 반환
                return resource;
            } else {
                throw new RuntimeException("파일을 찾을 수 없습니다. 파일 경로: " + filePath);
            }
        } catch (IOException ex) {
            throw new RuntimeException("파일을 찾을 수 없습니다. 파일 경로: " + filePath, ex);
        }
    }
    
}