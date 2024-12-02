package com.example.schoolMeal.service.mealCounsel;

//영양상담기록 service
import com.example.schoolMeal.domain.entity.mealCounsel.CounselHistorySpecifications;
import com.example.schoolMeal.domain.repository.mealCounsel.CounselHistoryRepository;
import com.example.schoolMeal.domain.entity.mealCounsel.CounselHistory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.rest.webmvc.ResourceNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class CounselHistoryService {

    private final CounselHistoryRepository counselHistoryRepository;

    @Autowired
    public CounselHistoryService(CounselHistoryRepository counselHistoryRepository) {
        this.counselHistoryRepository = counselHistoryRepository;
    }

    // 모든 상담 기록 검색
    public List<CounselHistory> getAllCounselHistory() {
        return counselHistoryRepository.findAll();
    }

    // 새로운 상담 기록 저장
    public CounselHistory addCounselHistory(CounselHistory counselHistory) {
        return counselHistoryRepository.save(counselHistory);
    }

    // 상담기록 ID의 상담 기록 검색
    public CounselHistory getCounselHistoryById(Long id) {
        return counselHistoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("CounselHistory not found with id " + id));
    }

    // 상담기록 ID의 상담 기록 삭제
    public void deleteCounselHistoryById(Long id) {
        CounselHistory counselHistory = counselHistoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("CounselHistory not found with id " + id));
        counselHistoryRepository.delete(counselHistory);
    }

    // 상담기록 ID의 상담 기록 수정
    public CounselHistory updateCounselHistory(Long id, CounselHistory updatedCounselHistory) {
        CounselHistory existing = counselHistoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("CounselHistory not found with id " + id));

        existing.setTitle(updatedCounselHistory.getTitle());
        existing.setAuthor(updatedCounselHistory.getAuthor());
        existing.setCounselContent(updatedCounselHistory.getCounselContent());
        existing.setCounselResult(updatedCounselHistory.getCounselResult());
        existing.setSpecialNotes(updatedCounselHistory.getSpecialNotes());
        existing.setStudentHistory(updatedCounselHistory.getStudentHistory());
        existing.setCounselDate(updatedCounselHistory.getCounselDate());

        return counselHistoryRepository.save(existing);
    }

    // 검색 조건에 따른 상담 기록 검색
    public List<CounselHistory> searchByCriteria(String author, String title, String counselContent, LocalDate date) {
        Specification<CounselHistory> spec = Specification.where(null);

        if (author != null && !author.isEmpty()) {
            spec = spec.and(CounselHistorySpecifications.authorContains(author));
        }
        if (title != null && !title.isEmpty()) {
            spec = spec.and(CounselHistorySpecifications.titleContains(title));
        }
        if (counselContent != null && !counselContent.isEmpty()) {
            spec = spec.and(CounselHistorySpecifications.counselContentContains(counselContent));
        }
        if (date != null) {
            spec = spec.and(CounselHistorySpecifications.dateEquals(date));
        }

        return counselHistoryRepository.findAll(spec);
    }
    
}