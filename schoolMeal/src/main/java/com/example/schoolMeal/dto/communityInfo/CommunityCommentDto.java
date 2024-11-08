package com.example.schoolMeal.dto.communityInfo;

import com.example.schoolMeal.domain.entity.Community_Comment;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class CommunityCommentDto {  //댓글 필드명들
    private Long id;
    private String content;
    private int likes;
    private int dislikes;
    private LocalDateTime createdAt;
    private Long parentCommentId;
    private List<CommunityCommentDto> replies = new ArrayList<>(); // 대댓글 리스트 필드 추가

    // 앤타타 갹채 Community_Comment 를 dto객체로 변환하는
    public CommunityCommentDto(Community_Comment comment) {
        this.id = comment.getId();
        this.content = comment.getContent();
        this.likes = comment.getLikes();
        this.dislikes = comment.getDislikes();
        this.createdAt = comment.getCreatedAt();
        this.parentCommentId = (comment.getParentComment() != null) ? comment.getParentComment().getId() : null;
    }
}