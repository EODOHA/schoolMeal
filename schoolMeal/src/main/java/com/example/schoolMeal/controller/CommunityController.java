package com.example.schoolMeal.controller;

import com.example.schoolMeal.dto.communityInfo.CommunityCommentDto;
import com.example.schoolMeal.dto.communityInfo.CommunityDto;
import com.example.schoolMeal.dto.communityInfo.CreateCommentRequest;
import com.example.schoolMeal.service.CommunityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/communities")
public class CommunityController {

    @Autowired
    private CommunityService communityService;

    // ------------------------------------ 공지사항 ------------------------------------------------------//

    // 공지사항 목록 조회
    @GetMapping("/notice/list")
    public ResponseEntity<Page<CommunityDto>> getNoticeList(Pageable pageable) {
        Page<CommunityDto> notices = communityService.getCommunityList("notice", pageable);
        return ResponseEntity.ok(notices);
    }

    // 공지사항  notice/create로 매핑, 리퀘스트바디로 DTO 데이터전달 후 DTO객체로변환 , @Valid로 유효성검사
    @PostMapping("/notice/create")
    public ResponseEntity<?> createNotice(@RequestBody @Valid CommunityDto communityDto, BindingResult bindingResult) {
        return createCommunity("notice", communityDto, bindingResult);
    }

    // 특정 게시물 조회
    @GetMapping("/notice/{id}")
    public ResponseEntity<CommunityDto> getNoticeById(@PathVariable Long id) {
        CommunityDto communityDto = communityService.getCommunityById(id);
        return ResponseEntity.ok(communityDto);
    }

    // 조회수 증가
    @PostMapping("/notice/{id}/increment-view")
    public ResponseEntity<Void> incrementNoticeViewCount(@PathVariable Long id) {
        communityService.incrementViewCount(id);
        return ResponseEntity.noContent().build();
    }

    // 게시물 수정
    @PutMapping("/notice/{id}")
    public ResponseEntity<CommunityDto> updateNotice(@PathVariable Long id, @RequestBody @Valid CommunityDto communityDto) {
        communityDto.setCategoryName("notice");
        CommunityDto updatedCommunity = communityService.updateCommunity(id, communityDto);
        return ResponseEntity.ok(updatedCommunity);
    }

    // 게시물 삭제
    @DeleteMapping("/notice/{id}")
    public ResponseEntity<Void> deleteNotice(@PathVariable Long id) {
        communityService.deleteCommunity(id);
        return ResponseEntity.noContent().build();
    }

    // 공지사항에서 제목으로 검색
    @GetMapping("/notice/search/title")
    public Page<CommunityDto> searchNoticeByTitle(@RequestParam String titleKeyword, Pageable pageable) {
        return searchByTitle("notice", titleKeyword, pageable);
    }

    // 공지사항에서 내용으로 검색
    @GetMapping("/notice/search/content")
    public Page<CommunityDto> searchNoticeByContent(@RequestParam String contentKeyword, Pageable pageable) {
        return searchByContent("notice", contentKeyword, pageable);
    }

    // 공지사항에서 작성자ID로 검색
    @GetMapping("/notice/search/author")
    public Page<CommunityDto> searchNoticeByAuthor(@RequestParam String authorKeyword, Pageable pageable) {
        return searchByAuthor("notice", authorKeyword, pageable);
    }

    // ------------------------------------ 급식 뉴스/소식지 ------------------------------------------------------//


    // 급식 뉴스/소식지 목록 조회
    @GetMapping("/school-news/list")
    public ResponseEntity<Page<CommunityDto>> getSchoolNewsList(Pageable pageable) {
        Page<CommunityDto> notices = communityService.getCommunityList("school-news", pageable);
        return ResponseEntity.ok(notices);
    }

    @PostMapping("/school-news/create")
    public ResponseEntity<?> createSchoolNews(@RequestBody @Valid CommunityDto communityDto, BindingResult bindingResult) {
        return createCommunity("school-news", communityDto, bindingResult);
    }

    // 특정 게시물 조회
    @GetMapping("/school-news/{id}")
    public ResponseEntity<CommunityDto> getSchoolNewsId(@PathVariable Long id) {
        CommunityDto communityDto = communityService.getCommunityById(id);
        return ResponseEntity.ok(communityDto);
    }

    // 조회수 증가
    @PostMapping("/school-news/{id}/increment-view")
    public ResponseEntity<Void> incrementSchoolNewsViewCount(@PathVariable Long id) {
        communityService.incrementViewCount(id);
        return ResponseEntity.noContent().build();
    }

    // 게시물 수정
    @PutMapping("/school-news/{id}")
    public ResponseEntity<CommunityDto> updateSchoolNews(@PathVariable Long id, @RequestBody @Valid CommunityDto communityDto) {
        communityDto.setCategoryName("school-news");
        CommunityDto updatedCommunity = communityService.updateCommunity(id, communityDto);
        return ResponseEntity.ok(updatedCommunity);
    }

    // 게시물 삭제
    @DeleteMapping("/school-news/{id}")
    public ResponseEntity<Void> deleteSchoolNews(@PathVariable Long id) {
        communityService.deleteCommunity(id);
        return ResponseEntity.noContent().build();
    }

    // 공지사항에서 제목으로 검색
    @GetMapping("/school-news/search/title")
    public Page<CommunityDto> searchSchoolNewsByTitle(@RequestParam String titleKeyword, Pageable pageable) {
        return searchByTitle("school-news", titleKeyword, pageable);
    }

    // 공지사항에서 내용으로 검색
    @GetMapping("/school-news/search/content")
    public Page<CommunityDto> searchSchoolNewsContent(@RequestParam String contentKeyword, Pageable pageable) {
        return searchByContent("school-news", contentKeyword, pageable);
    }

    // 공지사항에서 작성자ID로 검색
    @GetMapping("/school-news/search/author")
    public Page<CommunityDto> searchSchoolNewsAuthor(@RequestParam String authorKeyword, Pageable pageable) {
        return searchByAuthor("school-news", authorKeyword, pageable);
    }


    // ------------------------------------ 학술/연구자료 ------------------------------------------------------//

    // 학술/연구자료 목록 조회
    @GetMapping("/materials/list")
    public ResponseEntity<Page<CommunityDto>> getMaterialsList(Pageable pageable) {
        Page<CommunityDto> notices = communityService.getCommunityList("materials", pageable);
        return ResponseEntity.ok(notices);
    }

    @PostMapping("/materials/create")
    public ResponseEntity<?> createMaterials(@RequestBody @Valid CommunityDto communityDto, BindingResult bindingResult) {
        return createCommunity("materials", communityDto, bindingResult);
    }

    // 특정 게시물 조회
    @GetMapping("/materials/{id}")
    public ResponseEntity<CommunityDto> getMaterialsId(@PathVariable Long id) {
        CommunityDto communityDto = communityService.getCommunityById(id);
        return ResponseEntity.ok(communityDto);
    }

    // 조회수 증가
    @PostMapping("/materials/{id}/increment-view")
    public ResponseEntity<Void> incrementMaterialsViewCount(@PathVariable Long id) {
        communityService.incrementViewCount(id);
        return ResponseEntity.noContent().build();
    }

    // 게시물 수정
    @PutMapping("/materials/{id}")
    public ResponseEntity<CommunityDto> updateMaterials(@PathVariable Long id, @RequestBody @Valid CommunityDto communityDto) {
        communityDto.setCategoryName("materials");
        CommunityDto updatedCommunity = communityService.updateCommunity(id, communityDto);
        return ResponseEntity.ok(updatedCommunity);
    }

    // 게시물 삭제
    @DeleteMapping("/materials/{id}")
    public ResponseEntity<Void> deleteMaterials(@PathVariable Long id) {
        communityService.deleteCommunity(id);
        return ResponseEntity.noContent().build();
    }

    // 공지사항에서 제목으로 검색
    @GetMapping("/materials/search/title")
    public Page<CommunityDto> searchMaterialsByTitle(@RequestParam String titleKeyword, Pageable pageable) {
        return searchByTitle("materials", titleKeyword, pageable);
    }

    // 공지사항에서 내용으로 검색
    @GetMapping("/materials/search/content")
    public Page<CommunityDto> searchMaterialsContent(@RequestParam String contentKeyword, Pageable pageable) {
        return searchByContent("materials", contentKeyword, pageable);
    }

    // 공지사항에서 작성자ID로 검색
    @GetMapping("/materials/search/author")
    public Page<CommunityDto> searchMaterialsAuthor(@RequestParam String authorKeyword, Pageable pageable) {
        return searchByAuthor("materials", authorKeyword, pageable);
    }


    // ------------------------------------ 가공식품 정보 ------------------------------------------------------//

    // 가공식품 목록 조회
    @GetMapping("/gagongfoods/list")
    public ResponseEntity<Page<CommunityDto>> getGagongFoodsList(Pageable pageable) {
        Page<CommunityDto> notices = communityService.getCommunityList("gagongfoods", pageable);
        return ResponseEntity.ok(notices);
    }

    @PostMapping("/gagongfoods/create")
    public ResponseEntity<?> createGagongFoods(@RequestBody @Valid CommunityDto communityDto, BindingResult bindingResult) {
        return createCommunity("gagongfoods", communityDto, bindingResult);
    }

    // 특정 게시물 조회
    @GetMapping("/gagongfoods/{id}")
    public ResponseEntity<CommunityDto> getGagongFoodsId(@PathVariable Long id) {
        CommunityDto communityDto = communityService.getCommunityById(id);
        return ResponseEntity.ok(communityDto);
    }

    // 조회수 증가
    @PostMapping("/gagongfoods/{id}/increment-view")
    public ResponseEntity<Void> incrementGagongFoodsViewCount(@PathVariable Long id) {
        communityService.incrementViewCount(id);
        return ResponseEntity.noContent().build();
    }

    // 게시물 수정
    @PutMapping("/gagongfoods/{id}")
    public ResponseEntity<CommunityDto> updateGagongFoods(@PathVariable Long id, @RequestBody @Valid CommunityDto communityDto) {
        communityDto.setCategoryName("gagongfoods");
        CommunityDto updatedCommunity = communityService.updateCommunity(id, communityDto);
        return ResponseEntity.ok(updatedCommunity);
    }

    // 게시물 삭제
    @DeleteMapping("/gagongfoods/{id}")
    public ResponseEntity<Void> deleteGagongFoods(@PathVariable Long id) {
        communityService.deleteCommunity(id);
        return ResponseEntity.noContent().build();
    }

    // 가공식품 정보 에서 제목으로 검색
    @GetMapping("/gagongfoods/search/title")
    public Page<CommunityDto> searchGagongFoodsByTitle(@RequestParam String titleKeyword, Pageable pageable) {
        return searchByTitle("gagongfoods", titleKeyword, pageable);
    }

    // 가공식품 정보 에서 내용으로 검색
    @GetMapping("/gagongfoods/search/content")
    public Page<CommunityDto> searchGagongFoodsContent(@RequestParam String contentKeyword, Pageable pageable) {
        return searchByContent("gagongfoods", contentKeyword, pageable);
    }

    // 가공식품 정보 에서 작성자ID로 검색
    @GetMapping("/gagongfoods/search/author")
    public Page<CommunityDto> searchGagongFoodsAuthor(@RequestParam String authorKeyword, Pageable pageable) {
        return searchByAuthor("gagongfoods", authorKeyword, pageable);
    }

    // ------------------------------------ 급식시설·기구 정보 ------------------------------------------------------//

    // 급식시설·기구 목록 조회
    @GetMapping("/food-equipment/list")
    public ResponseEntity<Page<CommunityDto>> getFoodEquipmentList(Pageable pageable) {
        Page<CommunityDto> notices = communityService.getCommunityList("food-equipment", pageable);
        return ResponseEntity.ok(notices);
    }

    @PostMapping("/food-equipment/create")
    public ResponseEntity<?> createFoodEquipment(@RequestBody @Valid CommunityDto communityDto, BindingResult bindingResult) {
        return createCommunity("food-equipment", communityDto, bindingResult);
    }

    // 특정 게시물 조회
    @GetMapping("/food-equipment/{id}")
    public ResponseEntity<CommunityDto> getFoodEquipmentId(@PathVariable Long id) {
        CommunityDto communityDto = communityService.getCommunityById(id);
        return ResponseEntity.ok(communityDto);
    }

    // 조회수 증가
    @PostMapping("/food-equipment/{id}/increment-view")
    public ResponseEntity<Void> incrementFoodEquipmentViewCount(@PathVariable Long id) {
        communityService.incrementViewCount(id);
        return ResponseEntity.noContent().build();
    }

    // 게시물 수정
    @PutMapping("/food-equipment/{id}")
    public ResponseEntity<CommunityDto> updateFoodEquipment(@PathVariable Long id, @RequestBody @Valid CommunityDto communityDto) {
        communityDto.setCategoryName("food-equipment");
        CommunityDto updatedCommunity = communityService.updateCommunity(id, communityDto);
        return ResponseEntity.ok(updatedCommunity);
    }

    // 게시물 삭제
    @DeleteMapping("/food-equipment/{id}")
    public ResponseEntity<Void> deleteFoodEquipment(@PathVariable Long id) {
        communityService.deleteCommunity(id);
        return ResponseEntity.noContent().build();
    }

    // 가공식품 정보 에서 제목으로 검색
    @GetMapping("/food-equipment/search/title")
    public Page<CommunityDto> searchFoodEquipmentByTitle(@RequestParam String titleKeyword, Pageable pageable) {
        return searchByTitle("food-equipment", titleKeyword, pageable);
    }

    // 가공식품 정보 에서 내용으로 검색
    @GetMapping("/food-equipment/search/content")
    public Page<CommunityDto> searchFoodEquipmentContent(@RequestParam String contentKeyword, Pageable pageable) {
        return searchByContent("food-equipment", contentKeyword, pageable);
    }

    // 가공식품 정보 에서 작성자ID로 검색
    @GetMapping("/food-equipment/search/author")
    public Page<CommunityDto> searchFoodEquipmentAuthor(@RequestParam String authorKeyword, Pageable pageable) {
        return searchByAuthor("food-equipment", authorKeyword, pageable);
    }



    // ------------------------------------ 지역별 커뮤니티 ------------------------------------------------------//

    // 지역별 커뮤니티 목록 조회
    @GetMapping("/region-community/list")
    public ResponseEntity<Page<CommunityDto>> getRegionCommunityList(Pageable pageable) {
        Page<CommunityDto> notices = communityService.getCommunityList("region-community", pageable);
        return ResponseEntity.ok(notices);
    }

    @PostMapping("/region-community/create")
    public ResponseEntity<?> createRegionCommunity(@RequestBody @Valid CommunityDto communityDto, BindingResult bindingResult) {
        return createCommunity("region-community" , communityDto, bindingResult);
    }

    // 특정 게시물 조회
    @GetMapping("/region-community/{id}")
    public ResponseEntity<CommunityDto> getRegionCommunity(@PathVariable Long id) {
        CommunityDto communityDto = communityService.getCommunityById(id);
        return ResponseEntity.ok(communityDto);
    }

    // 조회수 증가
    @PostMapping("/region-community/{id}/increment-view")
    public ResponseEntity<Void> incrementRegionCommunityViewCount(@PathVariable Long id) {
        communityService.incrementViewCount(id);
        return ResponseEntity.noContent().build();
    }

    // 지역별 커뮤니티 게시물 수정
    @PutMapping("/region-community/{id}")
    public ResponseEntity<CommunityDto> updateRegionCommunity(@PathVariable Long id, @RequestBody @Valid CommunityDto communityDto) {
        communityDto.setCategoryName("region-community");
        CommunityDto updatedCommunity = communityService.updateCommunity(id, communityDto);
        return ResponseEntity.ok(updatedCommunity);
    }

    // 게시물 삭제
    @DeleteMapping("/region-community/{id}")
    public ResponseEntity<Void> deleteRegionCommunity(@PathVariable Long id) {
        communityService.deleteCommunity(id);
        return ResponseEntity.noContent().build();
    }

    // 가공식품 정보 에서 제목으로 검색
    @GetMapping("/region-community/search/title")
    public Page<CommunityDto> searchRegionCommunityByTitle(@RequestParam String titleKeyword, Pageable pageable) {
        return searchByTitle("region-community", titleKeyword, pageable);
    }

    // 가공식품 정보 에서 내용으로 검색
    @GetMapping("/region-community/search/content")
    public Page<CommunityDto> searchRegionCommunityContent(@RequestParam String contentKeyword, Pageable pageable) {
        return searchByContent("region-community", contentKeyword, pageable);
    }

    // 가공식품 정보 에서 작성자ID로 검색
    @GetMapping("/region-community/search/author")
    public Page<CommunityDto> searchRegionCommunityAuthor(@RequestParam String authorKeyword, Pageable pageable) {
        return searchByAuthor("region-community", authorKeyword, pageable);
    }

    // ------------------------------------ 댓글 기능 추가 ------------------------------------------------------//

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


    // 공통 메서드 (게시글작성 , 제목검사 , 내용검사 , id검사 )

    // 게시글 작성 ( 카테고리이름, 커뮤니티생성에 필요한DTO , BindingResult 객체를 이용한 유효성검사
    private ResponseEntity<?> createCommunity(String categoryName, CommunityDto communityDto, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {        // 이걸로 클라이언트로부터 받은 데이터가 DTO의 유효성 검사를 만족하는지
            String errorMessage = bindingResult.getFieldError() != null
                    ? bindingResult.getFieldError().getDefaultMessage()     //실패하면  에러메시지랑 400코드
                    : "유효성 검사 오류가 발생했습니다.";
            return ResponseEntity.badRequest().body(errorMessage);
        }
        communityDto.setCategoryName(categoryName);         // 성공하면 커뮤니티서비스를 통해 커뮨티를 생성
        CommunityDto createdCommunity = communityService.createCommunity(communityDto);
        return ResponseEntity.ok(createdCommunity);
    }


    // 제목 검사 메서드
    private Page<CommunityDto> searchByTitle(String categoryName, String titleKeyword, Pageable pageable) {
        return communityService.searchByTitle(pageable, titleKeyword, categoryName);
    }

    // 내용 검사 메서드
    private Page<CommunityDto> searchByContent(String categoryName, String contentKeyword, Pageable pageable) {
        return communityService.searchByContent(pageable, contentKeyword, categoryName);
    }

    // 작성자ID 검사 메서드
    private Page<CommunityDto> searchByAuthor(String categoryName, String authorKeyword, Pageable pageable) {
        return communityService.searchByAuthor(pageable, authorKeyword, categoryName);
    }
}
