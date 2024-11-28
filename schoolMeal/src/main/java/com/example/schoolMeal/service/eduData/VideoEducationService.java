package com.example.schoolMeal.service.eduData;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.schoolMeal.domain.entity.eduData.VideoEducation;
import com.example.schoolMeal.domain.repository.eduData.VideoEducationRepository;

import jakarta.persistence.EntityNotFoundException;

@Service
public class VideoEducationService {

    @Autowired
    private VideoEducationRepository eduVideoRepository;

    // 영상 교육자료 목록 반환
    public List<VideoEducation> eduVideoList() {
        return eduVideoRepository.findAll();
    }

    // 개별 영상 교육자료 조회
    public VideoEducation getEduVideoById(Long id) {
        return eduVideoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 ID의 EduVideo가 존재하지 않습니다."));
    }

    // 영상 교육자료 저장
    public void write(VideoEducation eduVideo) {
        eduVideoRepository.save(eduVideo);
    }

  	// 영상 교육자료 수정
    public void updateEduVideo(Long id, String writer, String content, MultipartFile thumbnail, MultipartFile videoFile) throws IOException {
        Optional<VideoEducation> existingVideo = eduVideoRepository.findById(id);

        if (existingVideo.isPresent()) {
            VideoEducation video = existingVideo.get();

            // 수정할 데이터 업데이트
            video.setWriter(writer);
            video.setContent(content);

            // 썸네일 이미지 처리 (이미지 덮어쓰기)
            if (thumbnail != null && !thumbnail.isEmpty()) {
                // 기존 썸네일 이미지 파일 삭제
                deleteFile(video.getImageUrl());  // 기존 이미지 삭제
                String imageUrl = uploadImage(thumbnail);  // 썸네일 이미지 업로드
                video.setImageUrl(imageUrl);
            }

            // 영상 파일 처리 (영상 덮어쓰기)
            if (videoFile != null && !videoFile.isEmpty()) {
                // 기존 영상 파일 삭제
                deleteFile(video.getVideoUrl());  // 기존 영상 삭제
                String videoUrl = uploadVideo(videoFile);  // 새로운 영상 업로드
                video.setVideoUrl(videoUrl);  // 영상 URL 업데이트
            }

            // 수정된 엔티티 저장
            eduVideoRepository.save(video);
        } else {
            throw new EntityNotFoundException("영상이 존재하지 않습니다.");
        }
    }

    // 파일 삭제 메서드
    private void deleteFile(String filePath) {
        // 절대 경로로 변환
        String absolutePath = "C:/Video" + filePath;
        File file = new File(absolutePath);
        
        // 파일 존재 여부 확인 후 삭제
        if (file.exists()) {
            if (file.delete()) {
                System.out.println("파일 삭제 성공: " + filePath);
            } else {
                System.out.println("파일 삭제 실패: " + filePath);
            }
        } else {
            System.out.println("파일이 존재하지 않습니다: " + filePath);
        }
    }


    // 영상 교육자료 삭제
    public void eduVideoDelete(Long id) {
        eduVideoRepository.deleteById(id);
    }

    // 영상 업로드 처리 (파일 업로드 후 URL 반환)
    public String uploadVideo(MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new IOException("파일이 비어 있습니다.");
        }

        // 파일 이름 설정
        String fileName = file.getOriginalFilename();
        Path filePath = Paths.get("C:/Video/videos/eduVideo/").resolve(fileName);

        // 업로드할 디렉터리가 없으면 생성
        Files.createDirectories(filePath.getParent());

        // 파일 저장
        file.transferTo(filePath.toFile());

        // 저장된 파일의 URL 반환
        return "/videos/eduVideo/" + fileName;
    }
    
    // 이미지 업로드 메서드
    public String uploadImage(MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new IOException("파일이 비어 있습니다.");
        }
        
        // 파일 이름 설정
        String fileName = file.getOriginalFilename();
        Path filePath = Paths.get("C:/Video/videos/eduImg/").resolve(fileName);

        // 업로드할 디렉터리가 없으면 생성
        Files.createDirectories(filePath.getParent());

        // 파일 저장
        file.transferTo(filePath.toFile());

        // 저장된 파일의 URL 반환
        return "/videos/eduImg/" + fileName;
    }

    // 모든 영상 교육자료 조회
    public List<VideoEducation> getAllEduVideos() {
        return eduVideoRepository.findAll();
    }
}