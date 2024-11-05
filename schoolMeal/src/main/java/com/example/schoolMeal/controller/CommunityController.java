package com.example.schoolMeal.controller;

import com.example.schoolMeal.dto.CommunityDto;
import com.example.schoolMeal.service.CommunityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/communities")     // 모든 메서드 매핑 경로 앞에 추가되는 거
public class CommunityController {

    @Autowired
    private CommunityService communityService;

    // 게시물 생성
    @PostMapping("/create")  // ResponseEntity<?> 에서 ?인 이유는 어떠한 타입도 반환이 가능하다, 동적 응답을 위해서
    public ResponseEntity<?> createCommunity(@RequestBody @Valid CommunityDto communityDto, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {    // bindingResult 를 통해 검사 , 에러가 있으면 badRequest로
            String errorMessage = bindingResult.getFieldError().getDefaultMessage();
            return ResponseEntity.badRequest().body(errorMessage);
        }

        //성공시
        CommunityDto createdCommunity = communityService.createCommunity(communityDto);
        return ResponseEntity.ok(createdCommunity);
    }

    // 특정 게시물 조회
    @GetMapping("/{id}")
    public ResponseEntity<CommunityDto> getCommunityById(@PathVariable Long id) {// PathVariable 로 URL경로이ㅡ id부분을 Long id 파라미터로
        CommunityDto communityDto = communityService.getCommunityById(id);
        return ResponseEntity.ok(communityDto);
    }

    // 조회수 증가
    @PostMapping("/{id}/increment-view")
    public ResponseEntity<Void> incrementViewCount(@PathVariable Long id) {
        communityService.incrementViewCount(id);
        return ResponseEntity.noContent().build();
    }

    // 게시물 수정
    @PutMapping("/{id}")                                                               //valid로 유효성검사
    public ResponseEntity<CommunityDto> updateCommunity(@PathVariable Long id, @RequestBody @Valid CommunityDto communityDto) {
        CommunityDto updatedCommunity = communityService.updateCommunity(id, communityDto);
        return ResponseEntity.ok(updatedCommunity);
    }

    // 게시물 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCommunity(@PathVariable Long id) {
        communityService.deleteCommunity(id);
        return ResponseEntity.noContent().build();
    }

    // 제목 검색
    @GetMapping("/search/title")
    public Page<CommunityDto> searchByTitle(@RequestParam String titleKeyword, Pageable pageable) {
        return communityService.searchByTitle(pageable, titleKeyword);
    }

    // 내용 검색
    @GetMapping("/search/content")
    public Page<CommunityDto> searchByContent(@RequestParam String contentKeyword, Pageable pageable) {
        return communityService.searchByContent(pageable, contentKeyword);
    }

    // 작성자 검색
    @GetMapping("/search/author")
    public Page<CommunityDto> searchByAuthor(@RequestParam String authorKeyword, Pageable pageable) {
        return communityService.searchByAuthor(pageable, authorKeyword);
    }
}