package com.example.schoolMeal.controller.mealCounsel;

// 영양상담기록 controller
import com.example.schoolMeal.domain.entity.mealCounsel.CounselHistory;
import com.example.schoolMeal.dto.mealCounsel.CounselHistoryDTO;
import com.example.schoolMeal.service.mealCounsel.CounselHistoryService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/counselHistory")
public class CounselHistoryController {

    private final CounselHistoryService service;

    @Autowired
    public CounselHistoryController(CounselHistoryService service) {
        this.service = service;
    }

    // 상담 기록 조회 (전체 조회 및 검색 기능 통합)
    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('LINKAGE')")
    public ResponseEntity<List<CounselHistoryDTO>> getAllCounselHistory(
            @RequestParam(required = false) String author,
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String counselContent,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {

        List<CounselHistory> histories;

        if (author != null || title != null || counselContent != null || date != null) {
            histories = service.searchByCriteria(author, title, counselContent, date);
        } else {
            histories = service.getAllCounselHistory();
        }

        List<CounselHistoryDTO> dtos = histories.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    // 새로운 상담 기록 추가 (ADMIN, LINKAGE만 가능)
    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('LINKAGE')")
    public ResponseEntity<CounselHistoryDTO> addCounselHistory(@Valid @RequestBody CounselHistoryDTO counselHistoryDTO) {
        CounselHistory counselHistory = convertToEntity(counselHistoryDTO);
        CounselHistory created = service.addCounselHistory(counselHistory);
        CounselHistoryDTO responseDTO = convertToDTO(created);
        return ResponseEntity.status(HttpStatus.CREATED).body(responseDTO);
    }

    // 상담이력 ID로 상담 기록 조회 (ADMIN, LINKAGE만 가능)
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('LINKAGE')")
    public ResponseEntity<CounselHistoryDTO> getCounselHistoryById(@PathVariable Long id) {
        CounselHistory history = service.getCounselHistoryById(id);
        CounselHistoryDTO dto = convertToDTO(history);
        return ResponseEntity.ok(dto);
    }

    // 상담이력 ID로 상담 기록 삭제 (ADMIN, LINKAGE만 가능)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('LINKAGE')")
    public ResponseEntity<Void> deleteCounselHistory(@PathVariable Long id) {
        service.deleteCounselHistoryById(id);
        return ResponseEntity.noContent().build();
    }

    // 상담이력 ID로 상담 기록 수정 (ADMIN, LINKAGE만 가능)
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('LINKAGE')")
    public ResponseEntity<CounselHistoryDTO> updateCounselHistory(@PathVariable Long id,
                                                                  @Valid @RequestBody CounselHistoryDTO counselHistoryDTO) {
        CounselHistory counselHistory = convertToEntity(counselHistoryDTO);
        CounselHistory updated = service.updateCounselHistory(id, counselHistory);
        CounselHistoryDTO responseDTO = convertToDTO(updated);
        return ResponseEntity.ok(responseDTO);
    }

    // DTO -> Entity 변환 메서드
    private CounselHistory convertToEntity(CounselHistoryDTO dto) {
        CounselHistory counselHistory = new CounselHistory();
        counselHistory.setTitle(dto.getTitle());
        counselHistory.setAuthor(dto.getAuthor());
        counselHistory.setCounselContent(dto.getCounselContent());
        counselHistory.setCounselResult(dto.getCounselResult());
        counselHistory.setSpecialNotes(dto.getSpecialNotes());
        counselHistory.setStudentHistory(dto.getStudentHistory());
        counselHistory.setCounselDate(dto.getCounselDate());
        return counselHistory;
    }

    // Entity -> DTO 변환 메서드
    private CounselHistoryDTO convertToDTO(CounselHistory counselHistory) {
        CounselHistoryDTO dto = new CounselHistoryDTO();
        dto.setTitle(counselHistory.getTitle());
        dto.setAuthor(counselHistory.getAuthor());
        dto.setCounselContent(counselHistory.getCounselContent());
        dto.setCounselResult(counselHistory.getCounselResult());
        dto.setSpecialNotes(counselHistory.getSpecialNotes());
        dto.setStudentHistory(counselHistory.getStudentHistory());
        dto.setCounselDate(counselHistory.getCounselDate());
        return dto;
    }
}
