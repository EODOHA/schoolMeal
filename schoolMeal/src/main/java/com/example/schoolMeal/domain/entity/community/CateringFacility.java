package com.example.schoolMeal.domain.entity.community;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "catering_facility")
@Getter
@Setter
public class CateringFacility {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 시설/가구명
    private String facilityName;

    // 가격
    private Double price;

    // 회사명
    private String companyName;

    // 주소 링크 (제조사나 판매처 링크)
    private String addressLink;

    // 사진 업로드를 위한 경로 또는 파일 이름
    private String imagePath;

    // 상세 소개 (긴 텍스트)
    @Column(columnDefinition = "TEXT")
    private String description;

    // 작성 날짜
    private LocalDateTime createdDate;

    // 수정 날짜
    private LocalDateTime updatedDate;

    // 댓글과의 연관 관계 설정 (일대다 관계)
    @OneToMany(mappedBy = "cateringFacility", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Comment> comments = new ArrayList<>();

    // 기본 생성자
    public CateringFacility() {
        this.createdDate = LocalDateTime.now();
    }

    // 파라미터를 받는 생성자
    public CateringFacility(String facilityName, Double price, String companyName, String addressLink, String imagePath, String description) {
        this.facilityName = facilityName;
        this.price = price;
        this.companyName = companyName;
        this.addressLink = addressLink;
        this.imagePath = imagePath;
        this.description = description;
        this.createdDate = LocalDateTime.now();
    }
}