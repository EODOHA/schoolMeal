package com.example.schoolMeal.domain.entity.community;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "processed_food")
@Getter
@Setter
public class ProcessedFood {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 상품명
    private String productName;

    // 가격
    private Double price;

    // 소비자가
    private Double consumerPrice;

    // 회사명
    private String companyName;

    // 주소 링크 (회사의 상세 페이지 또는 제품 링크)
    private String addressLink;

    // 상세 소개 (긴 텍스트)
    @Column(columnDefinition = "TEXT")
    private String description;

    // 작성 날짜
    private LocalDateTime createdDate;

    // 수정 날짜
    private LocalDateTime updatedDate;

    // CommunityFile과의 일대일 관계 설정 (이미지 파일)
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "file_id", referencedColumnName = "id")
    private CommunityFile image;

    // 댓글과의 연관 관계 설정 (일대다 관계)
    @OneToMany(mappedBy = "processedFood", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Comment> comments = new ArrayList<>();

    // 기본 생성자
    public ProcessedFood() {
        this.createdDate = LocalDateTime.now();
    }

    // 파라미터를 받는 생성자
    public ProcessedFood(String productName, Double price, Double consumerPrice, String companyName, String addressLink, String description) {
        this.productName = productName;
        this.price = price;
        this.consumerPrice = consumerPrice;
        this.companyName = companyName;
        this.addressLink = addressLink;
        this.description = description;
        this.createdDate = LocalDateTime.now();
    }
}
