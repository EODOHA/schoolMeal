package com.example.schoolMeal.dto.community;

import lombok.Getter;
import lombok.Setter;
import com.example.schoolMeal.domain.entity.community.RegionCategory;  // 새로 추가

@Getter
@Setter
public class RegionalCommunityRequestDTO {
    private String title;  // 게시글 제목
    private String content;  // 게시글 내용
    private String author;  // 작성자 이름
    private RegionCategory region;  // 지역 카테고리 (추가된 필드)

    // 기본 생성자
    public RegionalCommunityRequestDTO() {}

    // 파라미터를 받는 생성자
    public RegionalCommunityRequestDTO(String title, String content, String author, RegionCategory region) {
        this.title = title;
        this.content = content;
        this.author = author;
        this.region = region;
    }
}
