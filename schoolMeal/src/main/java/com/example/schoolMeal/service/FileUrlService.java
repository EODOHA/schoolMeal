package com.example.schoolMeal.service;

import java.io.File;
import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.schoolMeal.domain.entity.FileUrl;
import com.example.schoolMeal.domain.repository.FileUrlRepository;

import jakarta.transaction.Transactional;

@Service
public class FileUrlService {

    @Autowired
    private FileUrlRepository fileUrlRepository;

    @Value("${file.upload.path.service1}")
    private String service1SavePath;

    @Value("${file.upload.path.service2}")
    private String service2SavePath;

    @Transactional
    public FileUrl saveFile(MultipartFile file, Long existingFileId, String serviceType) throws IOException {
        if (file == null || file.isEmpty()) {
            // 파일이 없으면 null 반환 (혹은 fileUrl을 null로 설정하는 방식도 가능)
            return null;
        }

        // 기존 파일이 있으면 삭제
        if (existingFileId != null) {
            deleteFile(existingFileId); // 기존 파일 삭제
        }

        // 새 파일 저장
        String origFilename = file.getOriginalFilename();
        String filename = System.currentTimeMillis() + "_" + origFilename;

        // 서비스별 저장 경로 선택
        String savePath = selectSavePath(serviceType);
        
        java.io.File saveDir = new java.io.File(savePath);
        if (!saveDir.exists()) {
            boolean dirsCreated = saveDir.mkdirs();
            if (!dirsCreated) {
                throw new IOException("파일 저장 경로를 생성할 수 없습니다: " + savePath);
            }
        }

        // 파일을 저장할 경로와 이름 설정
        String filePath = savePath + File.separator + filename;
        java.io.File destFile = new java.io.File(filePath);

        // 파일 저장
        try {
            file.transferTo(destFile); // 파일을 해당 경로에 저장
        } catch (IOException e) {
            throw new IOException("파일 저장 중 오류가 발생했습니다: " + e.getMessage(), e);
        }

        // 파일 정보를 DB에 저장
        FileUrl newFileUrl = FileUrl.builder()
                .origFileName(origFilename)
                .fileName(filename)
                .filePath(filePath)
                .fileSize(file.getSize()) // 추가로 파일 크기를 저장할 경우
                .build();

        return fileUrlRepository.save(newFileUrl); // DB에 파일 정보 저장 후 반환
    }

    private String selectSavePath(String serviceType) {
        if ("service1".equals(serviceType)) {
            return service1SavePath;
        } else if ("service2".equals(serviceType)) {
            return service2SavePath;
        }
        throw new IllegalArgumentException("지원하지 않는 서비스 유형: " + serviceType);
    }

    // 파일 삭제 메서드
    @Transactional
    public void deleteFile(Long fileId) throws IOException {
        // 파일 정보 가져오기
        FileUrl fileUrl = fileUrlRepository.findById(fileId)
                .orElseThrow(() -> new IllegalArgumentException("파일을 찾을 수 없습니다: " + fileId));

        // 파일 삭제 전에 경로를 확인
        String filePath = fileUrl.getFilePath();
        File fileToDelete = new File(filePath);

        // 파일이 존재하는지 확인
        if (!fileToDelete.exists()) {
            throw new IOException("파일이 존재하지 않습니다: " + filePath);
        }

        // 파일 삭제 시도
        boolean deleted = fileToDelete.delete();
        if (!deleted) {
            // 삭제 실패 시 예외 처리
            throw new IOException("파일 삭제 실패: " + filePath);
        } else {
            // 삭제 성공 시 로그 추가
            System.out.println("파일 삭제 성공: " + filePath);
        }

        // DB에서 파일 정보 삭제
        fileUrlRepository.delete(fileUrl);
    }

    // 파일 정보를 DB에서 가져오는 메서드
    @Transactional
    public FileUrl getFile(Long fileId) {
        return fileUrlRepository.findById(fileId)
                .orElseThrow(() -> new IllegalArgumentException("파일을 찾을 수 없습니다: " + fileId));
    }
}

