package com.example.schoolMeal.dto.communityInfo;

import com.example.schoolMeal.domain.entity.Community;
import com.example.schoolMeal.domain.entity.Community_Comment;
import jakarta.validation.constraints.Size;
import lombok.*;

import jakarta.validation.constraints.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
@NoArgsConstructor
public class CommunityDto {

    private Long id;

    @NotBlank(message = "제목을 적어주세요")
    @Size(max = 100, message = "제목은 최대 100자까지 입력 가능합니다.")
    private String title;

    @Size(max = 2000, message = "내용은 최대 2000자까지 입력 가능합니다.")
    private String content;

    private int viewCount;
    private String author;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String categoryName;

    // 댓글 리스트 추가
    private List<com.example.schoolMeal.dto.communityInfo.CommunityCommentDto> comments;

    public CommunityDto(Community community) {
        this.id = community.getId();
        this.title = community.getTitle();
        this.content = community.getContent();
        this.viewCount = community.getViewCount();
        this.author = community.getAuthor();
        this.createdAt = community.getCreatedAt();
        this.updatedAt = community.getUpdatedAt();
        this.categoryName = community.getCategoryName();

        // Community_Comment 엔티티를 CommunityCommentDto로 변환하여 리스트에 추가
        if (community.getComments() != null) {
            this.comments = community.getComments().stream()
                    .map(CommunityCommentDto::new)
                    .collect(Collectors.toList());
        }
    }
    // CommunityDto를 Community 엔티티로 변환하는 메서드 ( 사용하면 코드가깔끔해지고 유지보수에 용이하다해서 추가)
    public Community toEntity() {
        return Community.builder()
                .id(this.id)
                .title(this.title)
                .content(this.content)
                .viewCount(this.viewCount)
                .author(this.author)
                .categoryName(this.categoryName)
                .build();
    }
}
