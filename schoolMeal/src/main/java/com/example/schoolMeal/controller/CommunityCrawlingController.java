package com.example.schoolMeal.controller;

import com.example.schoolMeal.domain.entity.CommunityCrawling;
import com.example.schoolMeal.service.CommunityCrawlingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/api/community-crawling")
public class CommunityCrawlingController {

    @Autowired
    private CommunityCrawlingService communityCrawlingService;

    // 카테고리별 콘텐츠 목록 조회
    @GetMapping("/{category}")
    public ResponseEntity<Page<CommunityCrawling>> getContentByCategory(
            @PathVariable String category, Pageable pageable) {
        Page<CommunityCrawling> contentList = communityCrawlingService.getContentByCategory(category, pageable);
        return ResponseEntity.ok(contentList);
    }

    // 특정 콘텐츠 조회
    @GetMapping("/{category}/{id}")
    public ResponseEntity<CommunityCrawling> getContentById(
            @PathVariable String category, @PathVariable Long id) {
        CommunityCrawling content = communityCrawlingService.getContentById(id);
        return ResponseEntity.ok(content);
    }

    // 급식 뉴스 크롤링 및 저장
    @PostMapping("/fetch-news")
    public ResponseEntity<String> fetchNews() {
        try {
            communityCrawlingService.fetchAndSaveNewsByKeyword();
            return ResponseEntity.ok("급식 뉴스 크롤링 및 저장 완료.");
        } catch (IOException e) {
            return ResponseEntity.status(500).body("크롤링 중 오류 발생: " + e.getMessage());
        }
    }

    // 콘텐츠 삭제
    @DeleteMapping("/{category}/{id}")
    public ResponseEntity<Void> deleteContent(@PathVariable String category, @PathVariable Long id) {
        communityCrawlingService.deleteContent(id);
        return ResponseEntity.noContent().build();
    }
}
