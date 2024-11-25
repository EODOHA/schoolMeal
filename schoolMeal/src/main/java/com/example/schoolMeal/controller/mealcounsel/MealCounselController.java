package com.example.schoolMeal.controller.mealcounsel;

// 영양상담 자료실 게시판 Controller
import com.example.schoolMeal.dto.mealcounsel.MealCounselRequestDTO;
import com.example.schoolMeal.dto.mealcounsel.MealCounselResponseDTO;
import com.example.schoolMeal.service.mealcounsel.FileStorageService;
import com.example.schoolMeal.service.mealcounsel.MealCounselService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.List;

//파일 다운로드 엔드포인트를 위한 import
import org.springframework.http.MediaType;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/mealcounsel")
public class MealCounselController {

    private final MealCounselService mealCounselService;
    private final FileStorageService fileStorageService;

    @Autowired
    public MealCounselController(MealCounselService mealCounselService,  FileStorageService fileStorageService) {
        this.mealCounselService = mealCounselService;
        this.fileStorageService = fileStorageService;
    }

    // 모든 게시글 조회
    @GetMapping
    public ResponseEntity<List<MealCounselResponseDTO>> getAllMealCounsel() {
        List<MealCounselResponseDTO> mealCounsels = mealCounselService.getAllCounselPosts();
        return ResponseEntity.ok(mealCounsels);
    }

    // 게시글 ID로 조회
    @GetMapping("/{id}")
    public ResponseEntity<MealCounselResponseDTO> getMealCounselById(@PathVariable Long id) {
        MealCounselResponseDTO mealCounsel = mealCounselService.getCounselPostById(id);
        return ResponseEntity.ok(mealCounsel);
    }

    //제목, 내용, 작성자, 생성일자로 검색
    @GetMapping("/search")
    public ResponseEntity<List<MealCounselResponseDTO>> searchMealCounsels(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String content,
            @RequestParam(required = false) String author,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate createdAt) {

        List<MealCounselResponseDTO> results = mealCounselService.searchMealCounsels(title, content, author, createdAt);
        return ResponseEntity.ok(results);
    }

    // 새로운 게시글 추가 (ADMIN 권한만 가능)
    @Secured("ROLE_ADMIN")
    @PostMapping
    public ResponseEntity<MealCounselResponseDTO> addMealCounsel(
            @ModelAttribute @Valid MealCounselRequestDTO requestDTO,
            @AuthenticationPrincipal UserDetails userDetails) {
        String username = userDetails.getUsername();
        MealCounselResponseDTO createdMealCounsel = mealCounselService.saveCounselPost(requestDTO, username);
        return ResponseEntity.status(201).body(createdMealCounsel);
    }

    // 게시글 수정 (ADMIN 권한만 가능)
    @Secured("ROLE_ADMIN")
    @PutMapping("/{id}")
    public ResponseEntity<MealCounselResponseDTO> updateMealCounsel(
            @PathVariable Long id,
            @ModelAttribute @Valid MealCounselRequestDTO requestDTO,
            @AuthenticationPrincipal UserDetails userDetails) {
        String username = userDetails.getUsername();
        MealCounselResponseDTO updatedMealCounsel = mealCounselService.updateCounselPost(id, requestDTO, username);
        return ResponseEntity.ok(updatedMealCounsel);
    }

    // 게시글 삭제 (ADMIN 권한만 가능)
    @Secured("ROLE_ADMIN")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMealCounsel(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        String username = userDetails.getUsername();
        mealCounselService.deleteCounselPost(id, username);
        return ResponseEntity.noContent().build();
    }

    // 파일 업로드 엔드포인트 (관리자만 가능)
    @Secured("ROLE_ADMIN")
    @PostMapping("/upload")
    public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file) {
        String filePath = fileStorageService.storeFile(file);
        return ResponseEntity.ok("파일이 저장되었습니다: " + filePath);
    }

    // 파일 다운로드 엔드포인트
    @GetMapping("/files/{fileName}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String fileName) {
        String filePath = "uploads/" + fileName;
        Resource resource = fileStorageService.loadFileAsResource(filePath);

        String contentType;
        try {
            contentType = Files.probeContentType(Paths.get(filePath));
            if (contentType == null) {
                contentType = "application/octet-stream";
            }
        } catch (IOException ex) {
            contentType = "application/octet-stream";
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"")
                .body(resource);
    }
}