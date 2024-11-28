package com.example.schoolMeal.dto.communityInfo;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class CateringFacilityResponseDTO {
    private Long id;
    private String facilityName;
    private Double price;
    private String companyName;
    private String addressLink;
    private String imagePath;
    private String description;
    private LocalDateTime createdDate;
    private LocalDateTime updatedDate;

    // 파라미터를 받는 생성자
    public CateringFacilityResponseDTO(Long id, String facilityName, Double price, String companyName, String addressLink, String imagePath, String description, LocalDateTime createdDate, LocalDateTime updatedDate) {
        this.id = id;
        this.facilityName = facilityName;
        this.price = price;
        this.companyName = companyName;
        this.addressLink = addressLink;
        this.imagePath = imagePath;
        this.description = description;
        this.createdDate = createdDate;
        this.updatedDate = updatedDate;
    }
}