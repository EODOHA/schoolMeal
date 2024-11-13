package com.example.schoolMeal.service;

import com.example.schoolMeal.domain.entity.CommunityCrawling;
import com.example.schoolMeal.domain.repository.CommunityCrawlingRepository;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.time.LocalDateTime;

@Service
public class CommunityCrawlingService {

    @Autowired
    private CommunityCrawlingRepository communityCrawlingRepository;

    // 카테고리에 따른 콘텐츠 조회
    public Page<CommunityCrawling> getContentByCategory(String category, Pageable pageable) {
        return communityCrawlingRepository.findByCategory(category, pageable);
    }

    // ID로 특정 콘텐츠 조회
    public CommunityCrawling getContentById(Long id) {
        return communityCrawlingRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("콘텐츠가 존재하지 않습니다."));
    }

    /**
     * 특정 ID의 콘텐츠 삭제 메서드 추가
     */
    @Transactional
    public void deleteContent(Long id) {
        communityCrawlingRepository.deleteById(id);
    }

    /**
     * 네이버 뉴스에서 "급식" 키워드로 뉴스 크롤링하여 저장하는 메서드
     */
    @Transactional
    public void fetchAndSaveNewsByKeyword() throws IOException {
        String url = "https://search.naver.com/search.naver?where=news&query=급식";
        Document doc = Jsoup.connect(url).get();
        Elements newsElements = doc.select(".news_wrap");

        for (Element element : newsElements) {
            String title = element.select(".news_tit").text(); // 뉴스 제목
            String content = element.select(".news_dsc").text(); // 뉴스 요약
            String source = element.select(".info_group .press").text(); // 출처
            LocalDateTime date = LocalDateTime.now();

            // 중복된 뉴스인지 확인하여 중복 방지
            boolean exists = communityCrawlingRepository.existsByTitleAndCategory(title, "급식뉴스/소식지");
            if (!exists) {
                CommunityCrawling news = new CommunityCrawling();
                news.setTitle(title);
                news.setContent(content);
                news.setSource(source);
                news.setDate(date);
                news.setCategory("급식뉴스/소식지");

                communityCrawlingRepository.save(news);
            }
        }
    }
}
