package com.example.schoolMeal.controller.communityController;

import com.example.schoolMeal.domain.entity.communityEntity.Community_Comment;
import com.example.schoolMeal.dto.communityInfo.CommunityCommentDto;
import com.example.schoolMeal.dto.communityInfo.CommunityDto;
import com.example.schoolMeal.dto.communityInfo.CreateCommentRequest;
import com.example.schoolMeal.service.communityService.CommunityService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import jakarta.validation.Valid;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/community")
public class CommunityController {

    @Autowired
    private CommunityService communityService;

    // ---------------------------- 공지사항 ------------------------------- //

    // 공지사항 목록 조회 (페이징 처리)
    @GetMapping("/notice/list")
    public ResponseEntity<Page<CommunityDto>> getNoticeList(Pageable pageable) {
        Page<CommunityDto> notices = communityService.getCommunityList("notice", pageable);
        return ResponseEntity.ok(notices);
    }

    // 수정한 create
    @PostMapping("/notice/create")
    public ResponseEntity<?> createNotice(
            @RequestParam("title") String title,
            @RequestParam("content") String content,
            @RequestParam("author") String author,
            @RequestParam(value = "file", required = false) MultipartFile file) {

            // CommunityDto 객체를 생성하고 필드 설정
            CommunityDto communityDto = new CommunityDto();
            communityDto.setTitle(title);
            communityDto.setContent(content);
            communityDto.setAuthor(author);
            communityDto.setCategoryName("notice"); // 카테고리 설정

    try {
        CommunityDto createdNotice = communityService.createCommunityWithFile(communityDto, file);
        return ResponseEntity.ok(createdNotice);
    } catch (IOException e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("파일 업로드에 실패했습니다.");
    }
}

    // 특정 공지사항 조회
    @GetMapping("/notice/{id}")
    public ResponseEntity<CommunityDto> getNoticeById(@PathVariable Long id) {
        CommunityDto notice = communityService.getCommunityById(id);
        return ResponseEntity.ok(notice);
    }

    // 공지사항 조회수 증가
    @PostMapping("/notice/{id}/increment-view")
    public ResponseEntity<Void> incrementNoticeViewCount(@PathVariable Long id) {
        communityService.incrementViewCount(id);
        return ResponseEntity.noContent().build();
    }

    // 공지사항 수정
    @PutMapping("/notice/{id}")
    public ResponseEntity<CommunityDto> updateNotice(
            @PathVariable Long id,
            @RequestBody @Valid CommunityDto communityDto) {

        communityDto.setCategoryName("notice"); // 카테고리를 notice로 설정
        CommunityDto updatedNotice = communityService.updateCommunity(id, communityDto);
        return ResponseEntity.ok(updatedNotice);
    }

    // 공지사항 삭제
    @DeleteMapping("/notice/{id}")
    public ResponseEntity<Void> deleteNotice(@PathVariable Long id) {
        communityService.deleteCommunity(id);
        return ResponseEntity.noContent().build();
    }

    // 공지사항 검색 기능 (제목, 내용, 작성자 검색)
    @GetMapping("/notice/search/{field}")
    public Page<CommunityDto> searchNotice(
            @PathVariable String field,
            @RequestParam String keyword,
            Pageable pageable) {

        switch (field) {
            case "title":
                return communityService.searchByTitle(pageable, keyword, "notice");
            case "content":
                return communityService.searchByContent(pageable, keyword, "notice");
            case "author":
                return communityService.searchByAuthor(pageable, keyword, "notice");
            default:
                throw new IllegalArgumentException("잘못된 검색 필드: " + field);
        }
    }

//    @GetMapping("/notice/download/{filename:.+}")
//    public ResponseEntity<Resource> downloadNoticeFile(@PathVariable String filename) {
//        try {
//            Resource file = communityService.getFile(filename);
//            return ResponseEntity.ok()
//                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
//                    .body(file);
//        } catch (MalformedURLException e) {
//            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
//        }
//    }

    @GetMapping("/notice/download/{filename:.+}")
    public ResponseEntity<Resource> downloadNoticeFile(@PathVariable String filename) {
        try {
            Resource file = communityService.getFile(filename);

            // MIME 타입 추정
            String contentType = "application/octet-stream"; // 기본값
            try {
                contentType = Files.probeContentType(Paths.get("src/main/resources/static/communityFile/" + filename));
            } catch (IOException e) {
                System.out.println("Could not determine file type.");
            }

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                    .body(file);

        } catch (IOException e) {
            // IOException을 처리하고 404 상태로 응답
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }





    // ------------------ 가공식품 정보 ---------------------------//

    // 가공식품 정보 목록 조회 (페이징 처리)
    @GetMapping("/gagongfoods/list")
    public ResponseEntity<Page<CommunityDto>> getGagongfoodsList(Pageable pageable) {
        Page<CommunityDto> gagongfoods = communityService.getCommunityList("gagongfoods", pageable);
        return ResponseEntity.ok(gagongfoods);
    }

    @PostMapping("/gagongfoods/create")
    public ResponseEntity<?> createGagongfoods(
            @RequestParam("title") String title,
            @RequestParam("productName") String productName,
            @RequestParam("originalPrice") Integer originalPrice,
            @RequestParam("consumerPrice") Integer consumerPrice,
            @RequestParam("brandName") String brandName,
            @RequestParam("detailedDescription") String detailedDescription,
            @RequestParam("content") String content, // content 추가
            @RequestParam(value = "file", required = false) MultipartFile file) {
        try {
            CommunityDto communityDto = new CommunityDto();
            communityDto.setTitle(title);
            communityDto.setProductName(productName);
            communityDto.setOriginalPrice(originalPrice);
            communityDto.setConsumerPrice(consumerPrice);
            communityDto.setBrandName(brandName);
            communityDto.setDetailedDescription(detailedDescription);
            communityDto.setContent(content); // content 설정
            communityDto.setCategoryName("gagongfoods");

            CommunityDto created = communityService.createCommunityWithFile(communityDto, file);
            return ResponseEntity.ok(created);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }



    @GetMapping("/gagongfoods/{id}")
    public ResponseEntity<CommunityDto> getGagongfoodsById(@PathVariable Long id) {
        try {
            CommunityDto gagongfoodsDto = communityService.getCommunityById(id);
            return ResponseEntity.ok(gagongfoodsDto);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null); // 잘못된 요청 처리
        }
    }

    @PutMapping("/gagongfoods/{id}")
    public ResponseEntity<CommunityDto> updateGagongfoods(
            @PathVariable Long id,
            @RequestBody @Valid CommunityDto communityDto) {

        try {
            communityDto.setCategoryName("gagongfoods");
            CommunityDto updatedGagongfoods = communityService.updateCommunity(id, communityDto);
            return ResponseEntity.ok(updatedGagongfoods);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null); // 잘못된 요청 처리
        }
    }

    @DeleteMapping("/gagongfoods/{id}")
    public ResponseEntity<Void> deleteGagongfoods(@PathVariable Long id) {
        try {
            communityService.deleteCommunity(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build(); // 잘못된 요청 처리
        }
    }




    // 가공식품 정보 검색 기능 (제목, 내용, 작성자 검색)
    @GetMapping("/gagongfoods/search/{field}")
    public Page<CommunityDto> searchGagongfoods(
            @PathVariable String field,
            @RequestParam String keyword,
            Pageable pageable) {

        switch (field) {
            case "title":
                return communityService.searchByTitle(pageable, keyword, "gagongfoods");
            case "content":
                return communityService.searchByContent(pageable, keyword, "gagongfoods");
            case "author":
                return communityService.searchByAuthor(pageable, keyword, "gagongfoods");
            default:
                throw new IllegalArgumentException("잘못된 검색 필드: " + field);
        }
    }

    // 파일 다운로드
    @GetMapping("/gagongfoods/download/{filename:.+}")
    public ResponseEntity<Resource> downloadGagongfoodsFile(@PathVariable String filename) {
        try {
            Resource file = communityService.getFile(filename);

            // MIME 타입 추정
            String contentType = "application/octet-stream";
            try {
                contentType = Files.probeContentType(Paths.get("src/main/resources/static/communityFile/" + filename));
            } catch (IOException e) {
                System.out.println("Could not determine file type.");
            }

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                    .body(file);

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    // ---------------- 가공식품 정보 댓글 기능 ---------------- //

    // 댓글 조회 (특정 게시물의 최상위 댓글만 조회)
    @GetMapping("/gagongfoods/{id}/comments")
    public ResponseEntity<List<CommunityCommentDto>> getGagongfoodsComments(@PathVariable Long id) {
        List<Community_Comment> comments = communityService.getComments(id);
        List<CommunityCommentDto> commentDtos = comments.stream()
                .map(CommunityCommentDto::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(commentDtos);
    }

    // 댓글 작성
    @PostMapping("/gagongfoods/{id}/comments")
    public ResponseEntity<CommunityCommentDto> addGagongfoodsComment(
            @PathVariable Long id,
            @RequestBody CreateCommentRequest request) {
        CommunityCommentDto newComment = communityService.addComment(id, request.getParentCommentId(), request.getContent());
        return ResponseEntity.ok(newComment);
    }

    // 댓글 수정
    @PutMapping("/gagongfoods/comments/{commentId}")
    public ResponseEntity<CommunityCommentDto> updateGagongfoodsComment(
            @PathVariable Long commentId,
            @RequestBody String newContent) {
        CommunityCommentDto updatedComment = communityService.updateComment(commentId, newContent);
        return ResponseEntity.ok(updatedComment);
    }

    // 댓글 삭제
    @DeleteMapping("/gagongfoods/comments/{commentId}")
    public ResponseEntity<Void> deleteGagongfoodsComment(@PathVariable Long commentId) {
        communityService.deleteComment(commentId);
        return ResponseEntity.noContent().build();
    }

    // 댓글 좋아요 증가
    @PostMapping("/gagongfoods/comments/{commentId}/like")
    public ResponseEntity<Void> likeGagongfoodsComment(@PathVariable Long commentId) {
        communityService.likeComment(commentId);
        return ResponseEntity.noContent().build();
    }

    // 댓글 싫어요 증가
    @PostMapping("/gagongfoods/comments/{commentId}/dislike")
    public ResponseEntity<Void> dislikeGagongfoodsComment(@PathVariable Long commentId) {
        communityService.dislikeComment(commentId);
        return ResponseEntity.noContent().build();
    }





    // ---------------- 지역별 커뮤니티 ---------------- //

    @GetMapping("/region-community/list")
    public ResponseEntity<Page<CommunityDto>> getRegionCommunityList(Pageable pageable) {
        Page<CommunityDto> regionCommunities = communityService.getCommunityList("region-community", pageable);
        return ResponseEntity.ok(regionCommunities);
    }

    // 지역별 커뮤니티 게시물 생성 (사진 업로드 가능)
    @PostMapping("/region-community/create")
    public ResponseEntity<?> createRegionCommunity(
            @RequestPart("communityDto") @Valid CommunityDto communityDto,
            BindingResult bindingResult,
            @RequestPart(value = "file", required = false) MultipartFile file) {

        if (bindingResult.hasErrors()) {
            String errorMessage = bindingResult.getFieldError() != null
                    ? bindingResult.getFieldError().getDefaultMessage()
                    : "유효성 검사 오류가 발생했습니다.";
            return ResponseEntity.badRequest().body(errorMessage);
        }

        communityDto.setCategoryName("region-community");

        try {
            // 파일이 사진인지 확인
            if (file != null && !file.isEmpty()) {
                String contentType = file.getContentType();
                if (contentType == null || !contentType.startsWith("image/")) {
                    return ResponseEntity.badRequest().body("이미지 파일만 업로드할 수 있습니다.");
                }
            }
            CommunityDto createdRegionCommunity = communityService.createCommunityWithFile(communityDto, file);
            return ResponseEntity.ok(createdRegionCommunity);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("파일 업로드에 실패했습니다.");
        }
    }

    // 특정 지역별 커뮤니티 게시물 조회
    @GetMapping("/region-community/{id}")
    public ResponseEntity<CommunityDto> getRegionCommunityById(@PathVariable Long id) {
        CommunityDto regionCommunityDto = communityService.getCommunityById(id);
        return ResponseEntity.ok(regionCommunityDto);
    }

    // 지역별 커뮤니티 게시물 수정
    @PutMapping("/region-community/{id}")
    public ResponseEntity<CommunityDto> updateRegionCommunity(
            @PathVariable Long id,
            @RequestBody @Valid CommunityDto communityDto) {

        communityDto.setCategoryName("region-community");
        CommunityDto updatedRegionCommunity = communityService.updateCommunity(id, communityDto);
        return ResponseEntity.ok(updatedRegionCommunity);
    }

    // 지역별 커뮤니티 게시물 삭제
    @DeleteMapping("/region-community/{id}")
    public ResponseEntity<Void> deleteRegionCommunity(@PathVariable Long id) {
        communityService.deleteCommunity(id);
        return ResponseEntity.noContent().build();
    }

// ---------------- 지역별 커뮤니티 댓글 기능 ---------------- //

    // 댓글 조회 (특정 게시물의 최상위 댓글만 조회)
    @GetMapping("/region-community/{id}/comments")
    public ResponseEntity<List<CommunityCommentDto>> getRegionCommunityComments(@PathVariable Long id) {
        List<Community_Comment> comments = communityService.getComments(id);
        List<CommunityCommentDto> commentDtos = comments.stream()
                .map(CommunityCommentDto::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(commentDtos);
    }

    // 댓글 작성
    @PostMapping("/region-community/{id}/comments")
    public ResponseEntity<CommunityCommentDto> addRegionCommunityComment(
            @PathVariable Long id,
            @RequestBody CreateCommentRequest request) {
        CommunityCommentDto newComment = communityService.addComment(id, request.getParentCommentId(), request.getContent());
        return ResponseEntity.ok(newComment);
    }

    // 댓글 수정
    @PutMapping("/region-community/comments/{commentId}")
    public ResponseEntity<CommunityCommentDto> updateRegionCommunityComment(
            @PathVariable Long commentId,
            @RequestBody String newContent) {
        CommunityCommentDto updatedComment = communityService.updateComment(commentId, newContent);
        return ResponseEntity.ok(updatedComment);
    }

    // 댓글 삭제
    @DeleteMapping("/region-community/comments/{commentId}")
    public ResponseEntity<Void> deleteRegionCommunityComment(@PathVariable Long commentId) {
        communityService.deleteComment(commentId);
        return ResponseEntity.noContent().build();
    }

    // 댓글 좋아요 증가
    @PostMapping("/region-community/comments/{commentId}/like")
    public ResponseEntity<Void> likeRegionCommunityComment(@PathVariable Long commentId) {
        communityService.likeComment(commentId);
        return ResponseEntity.noContent().build();
    }

    // 댓글 싫어요 증가
    @PostMapping("/region-community/comments/{commentId}/dislike")
    public ResponseEntity<Void> dislikeRegionCommunityComment(@PathVariable Long commentId) {
        communityService.dislikeComment(commentId);
        return ResponseEntity.noContent().build();
    }




}
