package com.example.schoolMeal.domain.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter @Setter
@NoArgsConstructor  
public class ImageUrl {

    @Id
    @GeneratedValue
    private Long id;

    @Column(nullable = false)
    private String origImgName;  // 원본 이미지 이름

    @Column(nullable = false)
    private String imgName;  // 저장된 이미지 이름 (서버에서 고유하게 생성된 이미지 이름)

    @Column(nullable = false)
    private String imgPath;  // 이미지 경로

    @Column(nullable = false)
    private Long imgSize;  // 이미지 크기 (바이트 단위)

    @Builder
    public ImageUrl(Long id, String origImgName, String imgName, String imgPath, Long imgSize) {
        this.id = id;
        this.origImgName = origImgName;
        this.imgName = imgName;
        this.imgPath = imgPath;
        this.imgSize = imgSize;
    }
}
