package com.example.schoolMeal.dto.communityInfo;

import com.example.schoolMeal.domain.entity.communityEntity.Community_Comment;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
@NoArgsConstructor
public class CommunityCommentDto {
    private Long id;
    private String content;
    private int likes;
    private int dislikes;
    private LocalDateTime createdAt;
    private Long parentCommentId;
    private List<CommunityCommentDto> replies = new ArrayList<>(); // 대댓글 리스트 필드 추가

    // 엔티티 객체 Community_Comment를 DTO 객체로 변환하는 생성자
    public CommunityCommentDto(Community_Comment comment) {
        this.id = comment.getId();
        this.content = comment.getContent();
        this.likes = comment.getLikes();
        this.dislikes = comment.getDislikes();
        this.createdAt = comment.getCreatedAt();
        this.parentCommentId = (comment.getParentComment() != null) ? comment.getParentComment().getId() : null;

        // 대댓글 리스트를 DTO로 변환하여 추가 (재귀적으로 변환)
        this.replies = comment.getChildComments().stream()
                .map(CommunityCommentDto::new)
                .collect(Collectors.toList());
    }
}
