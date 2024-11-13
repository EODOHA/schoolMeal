package com.example.schoolMeal.controller;

import com.example.schoolMeal.dto.communityInfo.CommunityCommentDto;
import com.example.schoolMeal.dto.communityInfo.CommunityDto;
import com.example.schoolMeal.dto.communityInfo.CreateCommentRequest;
import com.example.schoolMeal.service.CommunityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import jakarta.validation.Valid;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.util.List;

@RestController
@RequestMapping("/communities")
public class CommunityController {

    @Autowired
    private CommunityService communityService;

    // 게시물 목록 조회 (동적 카테고리)   getCommunityList 사용
    // 카테고리에 속한 게시물 목록을 페이징 처리하여 조회
    @GetMapping("/{category}/list")
    public ResponseEntity<Page<CommunityDto>> getCommunityList(
            @PathVariable String category, Pageable pageable) {
        Page<CommunityDto> communities = communityService.getCommunityList(category, pageable);
        // 카테고리 경로 변수로 카테고리를 받아 커뮤서비스의 getCommunityList 메서드를 호출
        return ResponseEntity.ok(communities); // 조회 결과는 dto로 반환
    }


    // 게시물 생성 (동적 카테고리, 파일 업로드)   createCommunity
    // POST , 특정 카테고리에 새 게시물생성 + 첨부파일기능
    // @RequestBody로 dto를 받고 @RequestParam으로 파일을 받는다
    @PostMapping("/{category}/create")
    public ResponseEntity<?> createCommunity(
            @PathVariable String category,
            @RequestPart("communityDto") @Valid CommunityDto communityDto,
            BindingResult bindingResult,
            @RequestPart(value = "file", required = false) MultipartFile file) {
        if (bindingResult.hasErrors()) {    // 유효성검사
            String errorMessage = bindingResult.getFieldError() != null
                    ? bindingResult.getFieldError().getDefaultMessage()
                    : "유효성 검사 오류가 발생했습니다.";
            return ResponseEntity.badRequest().body(errorMessage);
        }

        communityDto.setCategoryName(category);

        // 커뮤서비스의 createCommunityWithFile 메서드를 호출하여 파일과 함께 게시물을 생성
        try {
            CommunityDto createdCommunity = communityService.createCommunityWithFile(communityDto, file);
            return ResponseEntity.ok(createdCommunity);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("파일 업로드에 실패했습니다.");
        }
    }

    // 특정 게시물 조회 (동적 카테고리)
    @GetMapping("/{category}/{id}")
    public ResponseEntity<CommunityDto> getCommunityById(
            @PathVariable String category, @PathVariable Long id) {
        CommunityDto communityDto = communityService.getCommunityById(id);
        return ResponseEntity.ok(communityDto);
    }

    // 게시물 조회수 증가 (동적 카테고리)
    @PostMapping("/{category}/{id}/increment-view")
    public ResponseEntity<Void> incrementViewCount(
            @PathVariable String category, @PathVariable Long id) {
        communityService.incrementViewCount(id);
        return ResponseEntity.noContent().build();
    }

    // 게시물 수정 (동적 카테고리)
    @PutMapping("/{category}/{id}")
    public ResponseEntity<CommunityDto> updateCommunity(
            @PathVariable String category,
            @PathVariable Long id,
            @RequestBody @Valid CommunityDto communityDto) {
        communityDto.setCategoryName(category);
        CommunityDto updatedCommunity = communityService.updateCommunity(id, communityDto);
        return ResponseEntity.ok(updatedCommunity);
    }

    // 게시물 삭제 (동적 카테고리)
    @DeleteMapping("/{category}/{id}")
    public ResponseEntity<Void> deleteCommunity(
            @PathVariable String category, @PathVariable Long id) {
        communityService.deleteCommunity(id);
        return ResponseEntity.noContent().build();
    }

    // 검색 메서드 (동적 카테고리와 필드)
    @GetMapping("/{category}/search/{field}")
    public Page<CommunityDto> searchCommunity(
            @PathVariable String category,
            @PathVariable String field,
            @RequestParam String keyword,
            Pageable pageable) {
        switch (field) {
            case "title":
                return communityService.searchByTitle(pageable, keyword, category);
            case "content":
                return communityService.searchByContent(pageable, keyword, category);
            case "author":
                return communityService.searchByAuthor(pageable, keyword, category);
            default:
                throw new IllegalArgumentException("잘못된 검색 필드: " + field);
        }
    }

    // 파일 다운로드
    @GetMapping("/download/{filename:.+}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String filename) {
        try {
            Resource file = communityService.getFile(filename);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                    .body(file);
        } catch (MalformedURLException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    // 댓글 조회
    @GetMapping("/{category}/{id}/comments")
    public ResponseEntity<List<CommunityCommentDto>> getCommentsByPostId(
            @PathVariable String category,
            @PathVariable Long id) {
        List<CommunityCommentDto> comments = communityService.getCommentsByPostId(id);
        return ResponseEntity.ok(comments);
    }

    // 댓글 작성
    @PostMapping("/{category}/{id}/comments")
    public ResponseEntity<CommunityCommentDto> createComment(
            @PathVariable String category,
            @PathVariable Long id,
            @RequestBody CreateCommentRequest request) {
        CommunityCommentDto newComment = communityService.createComment(id, request.getParentCommentId(), request.getContent());
        return ResponseEntity.ok(newComment);
    }

    // 댓글 좋아요 증가
    @PostMapping("/{category}/comments/{commentId}/like")
    public ResponseEntity<Void> likeComment(@PathVariable String category, @PathVariable Long commentId) {
        communityService.likeComment(commentId);
        return ResponseEntity.noContent().build();
    }

    // 댓글 싫어요 증가
    @PostMapping("/{category}/comments/{commentId}/dislike")
    public ResponseEntity<Void> dislikeComment(@PathVariable String category, @PathVariable Long commentId) {
        communityService.dislikeComment(commentId);
        return ResponseEntity.noContent().build();
    }

    // 댓글 삭제
    @DeleteMapping("/comments/{commentId}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long commentId) {
        communityService.deleteComment(commentId);
        return ResponseEntity.noContent().build();
    }
}
