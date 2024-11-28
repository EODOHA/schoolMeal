package com.example.schoolMeal.dto.communityInfo;

import com.example.schoolMeal.domain.entity.communityEntity.Community;
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
    private String content; // 내용 필드 추가

    private int viewCount;
    private String author;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String categoryName;

    private String imageUrl;   // 이미지 URL 필드 추가
    private String fileUrl;    // 파일 URL 필드 추가
    private String fileName;   // 파일 이름 필드 추가

    // 가공식품 정보 전용 필드
    private String productName;      // 제품명
    private Integer originalPrice;   // 원가
    private Integer consumerPrice;   // 소비자가
    private String brandName;        // 브랜드명
    private String detailedDescription; // 상세 소개

    // 댓글 리스트 추가
    private List<CommunityCommentDto> comments;

    // 기존 생성자 (Community 엔티티를 기반으로 초기화)
    public CommunityDto(Community community) {
        this.id = community.getId();
        this.title = community.getTitle();
        this.content = community.getContent(); // 내용 초기화
        this.viewCount = community.getViewCount();
        this.author = community.getAuthor();
        this.createdAt = community.getCreatedAt();
        this.updatedAt = community.getUpdatedAt();
        this.categoryName = community.getCategoryName();
        this.imageUrl = community.getImageUrl();
        this.fileUrl = community.getFileUrl();
        this.fileName = community.getFileName();
        this.productName = community.getProductName();
        this.originalPrice = community.getOriginalPrice();
        this.consumerPrice = community.getConsumerPrice();
        this.brandName = community.getBrandName();
        this.detailedDescription = community.getDetailedDescription();

        if (community.getComments() != null) {
            this.comments = community.getComments().stream()
                    .map(CommunityCommentDto::new)
                    .collect(Collectors.toList());
        }
    }

    // CommunityDto를 Community 엔티티로 변환하는 메서드
    public Community toEntity() {
        return Community.builder()
                .id(this.id)
                .title(this.title)
                .content(this.content)
                .viewCount(this.viewCount)
                .author(this.author)
                .categoryName(this.categoryName)
                .fileUrl(this.fileUrl)
                .productName(this.productName)
                .originalPrice(this.originalPrice)
                .consumerPrice(this.consumerPrice)
                .brandName(this.brandName)
                .detailedDescription(this.detailedDescription)
                .build();
    }
}
