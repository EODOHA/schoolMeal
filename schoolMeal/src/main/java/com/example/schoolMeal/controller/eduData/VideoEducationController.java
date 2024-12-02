package com.example.schoolMeal.controller.eduData;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.schoolMeal.domain.entity.eduData.VideoEducation;
import com.example.schoolMeal.service.eduData.VideoEducationService;

@RestController
@RequestMapping("/videoEducation")
public class VideoEducationController {

    @Autowired
    private VideoEducationService videoEducationService;

    // 모든 영상 교육자료 조회
    @GetMapping("/list")
    public ResponseEntity<List<VideoEducation>> getAllVideoEducations() {
        return ResponseEntity.ok(videoEducationService.getAllVideoEducations());
    }

    // 영상 교육자료 작성 (영상 및 이미지 업로드)
    @PostMapping("/writepro")
    public ResponseEntity<String> videoEducationWritePro(
            @RequestParam("video") MultipartFile videoFile,
            @RequestParam("thumbnail") MultipartFile imageFile,
            @ModelAttribute VideoEducation videoEducation) {
        try {
            // 영상 업로드 처리 및 URL 설정
            String videoUrl = videoEducationService.uploadVideo(videoFile);
            videoEducation.setVideoUrl(videoUrl);

            // 이미지 업로드 처리 및 URL 설정
            String imageUrl = videoEducationService.uploadImage(imageFile);
            videoEducation.setImageUrl(imageUrl);

            // 데이터베이스에 저장
            videoEducationService.write(videoEducation);

            return ResponseEntity.ok("영상 및 이미지가 업로드되었습니다. 영상 URL: " + videoUrl + ", 이미지 URL: " + imageUrl);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("파일 업로드 실패: " + e.getMessage());
        }
    }

    // 개별 영상 교육자료 조회
    @GetMapping("/{id}")
    public ResponseEntity<VideoEducation> getVideoEducationById(@PathVariable Long id) {
        VideoEducation videoEducation = videoEducationService.getVideoEducationById(id);

        String imageUrl = videoEducation.getImageUrl();
        if (imageUrl != null && !imageUrl.startsWith("/videoEducation/images/")) {
            imageUrl = "/videoEducation/images/" + imageUrl;
        }

        imageUrl = imageUrl.replaceAll("/+/","/");
        videoEducation.setImageUrl(imageUrl);

        return ResponseEntity.ok(videoEducation);
    }

    // 영상 교육자료 삭제
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> videoEducationDelete(@PathVariable("id") Long id) {
        try {
            videoEducationService.videoEducationDelete(id); // 삭제 서비스 호출
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("삭제 중 오류 발생");
        }
    }

    // 영상 교육자료 수정
    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateVideoEducation(
            @PathVariable Long id,
            @RequestParam("title") String title,
            @RequestParam("writer") String writer,
            @RequestParam("content") String content,
            @RequestParam(value = "thumbnail", required = false) MultipartFile thumbnail,
            @RequestParam(value = "videoFile", required = false) MultipartFile videoFile) {
        try {
            videoEducationService.updateVideoEducation(id, title, writer, content, thumbnail, videoFile);
            return ResponseEntity.ok("수정 완료");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("수정 중 오류: " + e.getMessage());
        }
    }

    // 영상 다운로드
    @GetMapping("/download/{id}")
    public ResponseEntity<Resource> downloadVideo(@PathVariable Long id) {
        VideoEducation videoEducation = videoEducationService.getVideoEducationById(id);
        if (videoEducation == null || videoEducation.getVideoUrl() == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        // videoUrl에서 경로 수정
        String videoUrl = videoEducation.getVideoUrl().replaceFirst("^/videos/videoEducation/", "");
        Path filePath = Paths.get("C:/Video/videos/videoEducation/", videoUrl).normalize();  // 경로 수정

        if (!Files.exists(filePath)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        try {
            InputStreamResource resource = new InputStreamResource(new FileInputStream(filePath.toFile()));
            String contentType = "video/mp4"; // 기본 컨텐츠 타입 설정 (필요 시 추가 처리)
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filePath.getFileName().toString() + "\"")
                    .body(resource);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // 이미지 반환
    @GetMapping("/images/videos/eduImg/{filename:.+}")
    public ResponseEntity<byte[]> getImage(@PathVariable String filename) {
        try {
            // 경로를 C:/Video/videos/eduImg/로 수정
            Path filePath = Paths.get("C:/Video/videos/eduImg/").resolve(filename).normalize();
            File file = filePath.toFile();
            if (!file.exists()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }

            byte[] imageBytes = Files.readAllBytes(filePath);
            String contentType = Files.probeContentType(filePath);
            if (contentType == null) {
                contentType = "application/octet-stream";
            }

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + filename + "\"")
                    .body(imageBytes);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // 비디오 반환 (스트리밍 방식으로 처리)
    @GetMapping("/videos/{filename:.+}")
    public ResponseEntity<Resource> getVideo(@PathVariable String filename) {
        try {
            // 비디오 파일 경로 설정
            Path filePath = Paths.get("C:/Video/videos/videoEducation/").resolve(filename).normalize();
            
            // 파일이 존재하는지 확인
            File file = filePath.toFile();
            if (!file.exists()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }

            // 비디오 스트리밍을 위한 InputStreamResource 생성
            InputStreamResource resource = new InputStreamResource(new FileInputStream(file));
            String contentType = Files.probeContentType(filePath);
            if (contentType == null) {
                contentType = "video/mp4"; // 기본 비디오 형식 설정
            }

            // ResponseEntity로 비디오 파일 반환
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + filename + "\"")
                    .body(resource);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}