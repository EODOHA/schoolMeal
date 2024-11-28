package com.example.schoolMeal.service.community;

import com.example.schoolMeal.domain.entity.community.Notice;
import com.example.schoolMeal.domain.repository.community.NoticeRepository;
import com.example.schoolMeal.dto.community.NoticeRequestDTO;
import com.example.schoolMeal.dto.community.NoticeResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.persistence.EntityNotFoundException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class NoticeService {
    @Autowired
    private NoticeRepository noticeRepository;

    // 공지사항 생성 메서드
    public NoticeResponseDTO createNotice(NoticeRequestDTO dto) {
        Notice notice = new Notice(dto.getTitle(), dto.getContent(), dto.getAuthor());
        Notice savedNotice = noticeRepository.save(notice);
        return new NoticeResponseDTO(savedNotice.getId(), savedNotice.getTitle(), savedNotice.getContent(), savedNotice.getAuthor(), savedNotice.getViewCount(), savedNotice.getCreatedDate(), savedNotice.getUpdatedDate());
    }

    // 공지사항 조회 메서드 (조회수 증가 포함)
    public NoticeResponseDTO getNotice(Long id) {
        Notice notice = noticeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Notice not found"));
        notice.setViewCount(notice.getViewCount() + 1); // 조회수 증가
        noticeRepository.save(notice);
        return new NoticeResponseDTO(notice.getId(), notice.getTitle(), notice.getContent(), notice.getAuthor(), notice.getViewCount(), notice.getCreatedDate(), notice.getUpdatedDate());
    }

    // 모든 공지사항 조회 메서드
    public List<NoticeResponseDTO> getAllNotices() {
        return noticeRepository.findAll().stream()
                .map(notice -> new NoticeResponseDTO(notice.getId(), notice.getTitle(), notice.getContent(), notice.getAuthor(), notice.getViewCount(), notice.getCreatedDate(), notice.getUpdatedDate()))
                .collect(Collectors.toList());
    }

    // 공지사항 수정 메서드
    public void updateNotice(Long id, NoticeRequestDTO dto) {
        Notice notice = noticeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Notice not found"));
        notice.setTitle(dto.getTitle());
        notice.setContent(dto.getContent());
        notice.setAuthor(dto.getAuthor());
        notice.setUpdatedDate(LocalDateTime.now());
        noticeRepository.save(notice);
    }

    // 공지사항 삭제 메서드
    public void deleteNotice(Long id) {
        noticeRepository.deleteById(id);
    }
}