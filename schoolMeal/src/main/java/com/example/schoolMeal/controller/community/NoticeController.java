package com.example.schoolMeal.controller.community;

import com.example.schoolMeal.domain.entity.community.CommunityFile;
import com.example.schoolMeal.dto.community.NoticeRequestDTO;
import com.example.schoolMeal.dto.community.NoticeResponseDTO;
import com.example.schoolMeal.service.community.NoticeService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import com.example.schoolMeal.domain.repository.community.CommunityFileRepository;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.List;

@RestController
@RequestMapping("/notices")
public class NoticeController {

    @Autowired
    private NoticeService noticeService;

    @Autowired
    private CommunityFileRepository communityFileRepository;

    // 공지사항 생성 (파일 첨부 포함)
    @PostMapping
    public ResponseEntity<NoticeResponseDTO> createNotice(
            @RequestPart("data") NoticeRequestDTO dto,
            @RequestPart(value = "file", required = false) MultipartFile file) throws IOException {
        return ResponseEntity.ok(noticeService.createNotice(dto, file));
    }

    // 특정 공지사항 조회
    @GetMapping("/{id}")
    public ResponseEntity<NoticeResponseDTO> getNotice(@PathVariable Long id) {
        return ResponseEntity.ok(noticeService.getNotice(id));
    }

    // 모든 공지사항 조회
    @GetMapping
    public ResponseEntity<List<NoticeResponseDTO>> getAllNotices() {
        return ResponseEntity.ok(noticeService.getAllNotices());
    }

    // 공지사항 수정 (파일 첨부 포함)
    @PutMapping("/{id}")
    public ResponseEntity<Void> updateNotice(
            @PathVariable Long id,
            @RequestPart("data") NoticeRequestDTO dto,
            @RequestPart(value = "file", required = false) MultipartFile file) throws IOException {
        noticeService.updateNotice(id, dto, file);
        return ResponseEntity.ok().build();
    }

    // 공지사항 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNotice(@PathVariable Long id) {
        noticeService.deleteNotice(id);
        return ResponseEntity.ok().build();
    }

    // 파일 다운로드
    @GetMapping("/download/{id}")
    public ResponseEntity<byte[]> downloadFile(@PathVariable Long id) {
        NoticeResponseDTO notice = noticeService.getNotice(id);

        if (notice.getFileId() != null) {
            CommunityFile file = communityFileRepository.findById(notice.getFileId())
                    .orElseThrow(() -> new EntityNotFoundException("File not found"));

            String filePath = "C:/uploadTest/공지사항/" + file.getOrigFileName(); // 저장된 파일 경로
            File downloadFile = new File(filePath);

            // 파일 경로 출력
            System.out.println("다운로드 요청 파일 경로: " + filePath);

            if (!downloadFile.exists()) {
                // 파일이 존재하지 않는 경우 경로 확인을 위해 로그 출력
                System.out.println("파일이 존재하지 않습니다: " + filePath);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null); // 파일이 존재하지 않을 때 404 오류 반환
            }

            try {
                byte[] fileContent = Files.readAllBytes(downloadFile.toPath());

                // 파일의 MIME 타입을 설정
                String mimeType = file.getFileType();
                if (mimeType == null) {
                    mimeType = "application/octet-stream"; // 기본 MIME 타입 설정
                }

                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.parseMediaType(mimeType));
                headers.setContentDispositionFormData("attachment", file.getOrigFileName());
                headers.setContentLength(fileContent.length);

                return new ResponseEntity<>(fileContent, headers, HttpStatus.OK);
            } catch (IOException e) {
                System.out.println("파일을 읽는 중 오류가 발생했습니다: " + filePath);
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
            }
        }

        System.out.println("파일 ID를 찾을 수 없습니다. 공지사항 ID: " + id);
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
    }
}