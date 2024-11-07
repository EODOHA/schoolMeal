package com.example.schoolMeal.dto.communityInfo;

import lombok.Data;

@Data
public class CreateCommentRequest {
    private Long parentCommentId;
    private String content;
}
