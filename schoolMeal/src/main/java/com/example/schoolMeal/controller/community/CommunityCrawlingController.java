package com.example.schoolMeal.controller.community;

import com.example.schoolMeal.service.community.CommunityCrawlingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController  // JSON 데이터를 반환하도록 설정
@RequestMapping("/crawling")  // /community 기본 경로 설정
public class CommunityCrawlingController {

    @Autowired
    private CommunityCrawlingService communityCrawlingService;

    // 급식뉴스/소식지 엔드포인트
    @GetMapping("/school-news")
    public Map<String, Object> getSchoolNews() {
        // "급식" 키워드로 고정된 뉴스 데이터를 조회하여 JSON으로 반환
        return communityCrawlingService.getNewsWithFixedKeyword("급식");
    }

    // 학술/연구자료 엔드포인트
    @GetMapping("/materials")
    public Map<String, Object> getMaterials() {
        // "연구" 키워드로 고정된 뉴스 데이터를 조회하여 JSON으로 반환
        return communityCrawlingService.getNewsWithFixedKeyword("연구");
    }
}
