package com.example.schoolMeal.domain.entity.community;

import com.example.schoolMeal.common.entity.BaseEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "processed_food")
@Getter
@Setter
public class ProcessedFood extends BaseEntity {

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
}
