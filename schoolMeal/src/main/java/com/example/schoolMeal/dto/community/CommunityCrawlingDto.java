package com.example.schoolMeal.dto.community;

import com.example.schoolMeal.domain.entity.community.CommunityCrawling;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommunityCrawlingDto {

    private String title;
    private String link;
    private String description;
    private String pubDate;

    public CommunityCrawlingDto(CommunityCrawling entity) {
        this.title = entity.getTitle();
        this.link = entity.getLink();
        this.description = entity.getDescription();
        this.pubDate = entity.getPubDate();
    }
}