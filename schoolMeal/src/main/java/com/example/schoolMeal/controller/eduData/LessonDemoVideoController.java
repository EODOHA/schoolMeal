package com.example.schoolMeal.controller.eduData;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.net.URLEncoder;
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
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.example.schoolMeal.domain.entity.FileUrl;
import com.example.schoolMeal.domain.entity.eduData.LessonDemoVideo;
import com.example.schoolMeal.domain.repository.eduData.LessonDemoVideoRepository;
import com.example.schoolMeal.service.eduData.LessonDemoVideoService;

@RestController
@RequestMapping("/lessonDemoVideo")
public class LessonDemoVideoController {

	@Autowired
    private LessonDemoVideoRepository lessonDemoVideoRepository;
	
    @Autowired
    private LessonDemoVideoService lessonDemoVideoService;

    // 목록을 반환
    @GetMapping("/list")
    public ResponseEntity<List<LessonDemoVideo>> lessonDemoVideoList() {
        List<LessonDemoVideo> lessonDemos = lessonDemoVideoService.lessonDemoVideoList();
        return ResponseEntity.ok(lessonDemos);
    }

    // 작성 처리
    @PostMapping("/writepro")
    public String lessonDemoVideoWritePro(@RequestParam("title") String title,
                                         @RequestParam("writer") String writer,
                                         @RequestParam("content") String content,
                                         @RequestParam(value = "file", required = false) MultipartFile file,
                                         RedirectAttributes redirectAttributes) throws IOException {
        LessonDemoVideo lessonDemoVideo = new LessonDemoVideo();
        lessonDemoVideo.setTitle(title);
        lessonDemoVideo.setWriter(writer);
        lessonDemoVideo.setContent(content);

        lessonDemoVideoService.write(lessonDemoVideo, file);

        redirectAttributes.addFlashAttribute("message", "게시글이 성공적으로 작성되었습니다.");
        return "redirect:/lessonDemoVideo/list";
    }

    // 특정 id 조회
    @GetMapping("/{id}")
    public ResponseEntity<LessonDemoVideo> getLessonDemoVideoById(@PathVariable Long id) {
        LessonDemoVideo lessonDemoVideo = lessonDemoVideoService.getPostWithFileDetails(id);
        return lessonDemoVideo != null ? ResponseEntity.ok(lessonDemoVideo) : ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
    }

    // 수정 처리하는 PUT 요청
    @PutMapping("/update/{id}")
    public ResponseEntity<String> updateLessonDemoVideo(@PathVariable Long id,
                                                       @RequestParam(value = "title", required = false) String title,
                                                       @RequestParam(value = "content", required = false) String content,
                                                       @RequestParam(value = "writer", required = false) String writer,
                                                       @RequestParam(value = "file", required = false) MultipartFile file) {
        try {
            LessonDemoVideo existingLessonDemoVideo = lessonDemoVideoService.getPostWithFileDetails(id);
            if (existingLessonDemoVideo == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("게시글이 존재하지 않습니다.");
            }

            if (title != null) existingLessonDemoVideo.setTitle(title);
            if (content != null) existingLessonDemoVideo.setContent(content);
            if (writer != null) existingLessonDemoVideo.setWriter(writer);

            lessonDemoVideoService.lessonDemoVideoUpdate(existingLessonDemoVideo, file);

            return ResponseEntity.ok("수정되었습니다.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("수정 실패: " + e.getMessage());
        }
    }

    // 게시글 삭제
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteLessonDemoVideo(@PathVariable Long id) {
        try {
            lessonDemoVideoService.lessonDemoVideoDelete(id);
            return ResponseEntity.ok("게시글이 삭제되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("삭제 실패: " + e.getMessage());
        }
    }
    
    // 파일 다운로드
    @GetMapping("/download/{id}")
    public ResponseEntity<InputStreamResource> downloadLessonDemoVideo(@PathVariable Long id) {
        // 해당 ID의 게시글 조회
    	LessonDemoVideo lessonDemoVideo = lessonDemoVideoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 ID의 게시글이 존재하지 않습니다: " + id));

        // 게시글에 첨부된 파일이 있는지 확인
        if (lessonDemoVideo.getFileUrl() == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        FileUrl fileUrl = lessonDemoVideo.getFileUrl();
        Path filePath = Paths.get(fileUrl.getFilePath()).normalize();  // 파일 경로 얻기

        // 파일 존재 여부 확인
        if (!Files.exists(filePath)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        try {
            InputStreamResource resource = new InputStreamResource(new FileInputStream(filePath.toFile()));

            // 파일의 MIME 타입을 설정. 기본적으로 파일 확장자에 맞는 컨텐츠 타입을 설정
            String contentType = Files.probeContentType(filePath);
            if (contentType == null) {
                contentType = "application/octet-stream"; // 기본 타입 설정
            }

            // 파일 이름 인코딩 (UTF-8로 인코딩 후 URL-safe 형식으로 변환)
            String encodedFileName = URLEncoder.encode(filePath.getFileName().toString(), "UTF-8").replaceAll("\\+", "%20");

            // 파일 다운로드 응답
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename*=utf-8''" + encodedFileName)
                    .body(resource);

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // 영상 데이터 Base64로 반환
    @GetMapping("/video/{id}")
    public ResponseEntity<Resource> getVideo(@PathVariable Long id) {
        try {
            LessonDemoVideo lessonDemoVideo = lessonDemoVideoService.getPostWithFileDetails(id);

            if (lessonDemoVideo == null || lessonDemoVideo.getFileUrl() == null) {
                throw new IllegalArgumentException("해당 영상이 존재하지 않습니다.");
            }

            String videoUrl = lessonDemoVideo.getFileUrl().getFilePath();
            Path path = Paths.get(videoUrl);  // 실제 경로로 변경

            if (!Files.exists(path)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }

            Resource resource = new InputStreamResource(Files.newInputStream(path)); // IOException 발생 가능
            String contentType = Files.probeContentType(path); // IOException 발생 가능

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + path.getFileName().toString() + "\"")
                    .body(resource);

        } catch (IOException e) {
            // IOException이 발생하면 500 Internal Server Error를 반환
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null); // 또는 적절한 오류 메시지를 반환할 수 있습니다.
        } catch (IllegalArgumentException e) {
            // 영상이 존재하지 않는 경우 404 Not Found 반환
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }
    
    // 영상 파일 스트리밍
    @GetMapping("/videos/{id}")
    public ResponseEntity<byte[]> streamVideo(@PathVariable Long id) {
        try {
            String videoPath = lessonDemoVideoService.getPostWithFileDetails(id).getFileUrl().getFilePath();

            // 파일이 저장된 디렉터리와 실제 파일 경로를 결합
            Path path = Paths.get(videoPath);
            File videoFile = path.toFile();

            if (!videoFile.exists()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(null);
            }

            // 파일의 MIME 타입을 자동으로 결정
            String mimeType = Files.probeContentType(path);
            byte[] videoBytes = Files.readAllBytes(path);

            // Content-Type 헤더 설정 (파일의 MIME 타입)
            HttpHeaders headers = new HttpHeaders();
            headers.add("Content-Type", mimeType);
            headers.add("Content-Length", String.valueOf(videoFile.length()));

            return new ResponseEntity<>(videoBytes, headers, HttpStatus.OK);

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }
    }

}