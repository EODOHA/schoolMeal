package com.example.schoolMeal.dto.communityInfo;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegionalCommunityRequestDTO {
    private String title;
    private String content;
    private String author;

    // 기본 생성자
    public RegionalCommunityRequestDTO() {}

    // 파라미터를 받는 생성자
    public RegionalCommunityRequestDTO(String title, String content, String author) {
        this.title = title;
        this.content = content;
        this.author = author;
    }
}
