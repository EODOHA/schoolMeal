package com.example.schoolMeal.controller.communityController;

import com.example.schoolMeal.dto.communityInfo.NoticeRequestDTO;
import com.example.schoolMeal.dto.communityInfo.NoticeResponseDTO;
import com.example.schoolMeal.service.communityService.NoticeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notices")
public class NoticeController {
    @Autowired
    private NoticeService noticeService;

    // 공지사항 생성 요청 처리 메서드
    @PostMapping
    public ResponseEntity<NoticeResponseDTO> createNotice(@RequestBody NoticeRequestDTO dto) {
        return ResponseEntity.ok(noticeService.createNotice(dto));
    }

    // 특정 공지사항 조회 요청 처리 메서드
    @GetMapping("/{id}")
    public ResponseEntity<NoticeResponseDTO> getNotice(@PathVariable Long id) {
        return ResponseEntity.ok(noticeService.getNotice(id));
    }

    // 모든 공지사항 조회 요청 처리 메서드
    @GetMapping
    public ResponseEntity<List<NoticeResponseDTO>> getAllNotices() {
        return ResponseEntity.ok(noticeService.getAllNotices());
    }

    // 공지사항 수정 요청 처리 메서드
    @PutMapping("/{id}")
    public ResponseEntity<Void> updateNotice(@PathVariable Long id, @RequestBody NoticeRequestDTO dto) {
        noticeService.updateNotice(id, dto);
        return ResponseEntity.ok().build();
    }

    // 공지사항 삭제 요청 처리 메서드
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNotice(@PathVariable Long id) {
        noticeService.deleteNotice(id);
        return ResponseEntity.ok().build();
    }
}