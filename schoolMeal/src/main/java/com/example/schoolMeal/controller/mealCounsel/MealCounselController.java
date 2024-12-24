package com.example.schoolMeal.controller.mealCounsel;

// 영양상담 자료실 게시판 Controller
import com.example.schoolMeal.domain.entity.mealCounsel.MealCounsel;
import com.example.schoolMeal.dto.mealCounsel.MealCounselRequestDTO;
import com.example.schoolMeal.dto.mealCounsel.MealCounselResponseDTO;
import com.example.schoolMeal.service.mealCounsel.MealCounselService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/mealcounsel")
public class MealCounselController {

    private final MealCounselService mealCounselService;

    @Autowired
    public MealCounselController(MealCounselService mealCounselService) {
        this.mealCounselService = mealCounselService;
    }

    //모든 게시글을 조회합니다. 인증 없이 접근 가능합니다.
    @GetMapping("/list")
    public ResponseEntity<List<MealCounselResponseDTO>> getAllMealCounsel() {
        List<MealCounselResponseDTO> mealCounsel = mealCounselService.getAllCounselPosts();
        return ResponseEntity.ok(mealCounsel);
    }

    //단일 게시글 조회
    @GetMapping("/{id}")
    public ResponseEntity<?> getMealCounselById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails)
    {

        try {
            MealCounselResponseDTO mealCounselDTO = mealCounselService.getCounselPostById(id);
            return ResponseEntity.ok(mealCounselDTO);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("게시글을 찾을 수 없습니다.");
        }
    }

    //새로운 게시글을 추가합니다. 인증이 필요하며, 최대 5개의 파일을 첨부할 수 있습니다.

    @PostMapping(value = "/writepost", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> addMealCounsel(
            @ModelAttribute @Valid MealCounselRequestDTO requestDTO,
            @AuthenticationPrincipal UserDetails userDetails) throws IOException {

        // 인증되지 않은 사용자인 경우 401 반환
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
        }

        String author = userDetails.getUsername(); // 인증된 사용자의 ID 가져오기

        // MealCounsel 객체 생성 및 설정 (빌더 패턴 사용)
        MealCounsel mealCounsel = MealCounsel.builder()
                .title(requestDTO.getTitle())
                .author(author)
                .content(requestDTO.getContent())
                .youtubeHtml(requestDTO.getYoutubeHtml()) // 필요 시 추가 필드 설정
                .build();

        // 파일 처리 및 게시글 저장
        MealCounselResponseDTO responseDTO = mealCounselService.saveMealCounsel(mealCounsel, requestDTO.getFiles());

        // 생성 성공 시 201 반환
        return ResponseEntity.status(HttpStatus.CREATED).body(responseDTO);
    }

    /**
     * 특정 게시글을 수정합니다. 인증이 필요하며, 작성자만 수정할 수 있습니다.
     */
    @PutMapping(value = "/edit/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateMealCounsel(
            @PathVariable Long id,
            @ModelAttribute @Valid MealCounselRequestDTO requestDTO,
            @AuthenticationPrincipal UserDetails userDetails) {

        // 인증되지 않은 사용자인 경우 401 반환
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
        }

        String author = userDetails.getUsername(); // 인증된 사용자의 ID 가져오기

        try {
            // 게시글 수정 시도
            MealCounselResponseDTO updatedMealCounsel = mealCounselService.updateCounselPost(id, requestDTO, author);
            return ResponseEntity.ok(updatedMealCounsel);
        } catch (IllegalArgumentException e) {
            // 게시글을 찾을 수 없을 경우 404 반환
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("게시글을 찾을 수 없습니다.");
        } catch (AccessDeniedException e) {
            // 작성자가 아닐 경우 403 반환
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("작성자만 수정할 수 있습니다.");
        }
    }

    /**
     * 특정 게시글을 삭제합니다. 인증이 필요하며, 작성자만 삭제할 수 있습니다.
     */
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteMealCounsel(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {

        // 인증되지 않은 사용자인 경우 401 반환
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
        }

        String author = userDetails.getUsername(); // 인증된 사용자의 ID 가져오기

        try {
            // 게시글 삭제 시도
            mealCounselService.deleteCounselPost(id, author);
            return ResponseEntity.noContent().build(); // 성공 시 204 반환
        } catch (IllegalArgumentException e) {
            // 게시글을 찾을 수 없을 경우 404 반환
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("게시글을 찾을 수 없습니다.");
        } catch (AccessDeniedException e) {
            // 작성자가 아닐 경우 403 반환
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("작성자만 삭제할 수 있습니다.");
        }
    }

    /**
     * 특정 파일을 다운로드합니다. 인증이 필요합니다.
     */
    @GetMapping("/files/{fileId}")
    public ResponseEntity<?> downloadFile(
            @PathVariable Long fileId,
            @AuthenticationPrincipal UserDetails userDetails) {
        // 인증되지 않은 사용자인 경우 401 반환
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
        }

        try {
            // 파일 다운로드 서비스 호출
            return mealCounselService.downloadMealCounselFile(fileId);
        } catch (IllegalArgumentException e) {
            // 파일을 찾을 수 없을 경우 404 반환
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("파일을 찾을 수 없습니다.");
        } catch (IOException e) {
            // 파일 다운로드 중 오류 발생 시 500 반환
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("파일을 다운로드하는 중 오류가 발생했습니다.");
        }
    }
}