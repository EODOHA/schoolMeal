package com.example.schoolMeal.dto.communityInfo;

import com.example.schoolMeal.domain.entity.communityEntity.CommunityCrawling;
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