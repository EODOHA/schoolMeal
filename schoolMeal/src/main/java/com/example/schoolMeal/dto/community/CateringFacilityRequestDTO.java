package com.example.schoolMeal.dto.community;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CateringFacilityRequestDTO {
    private String facilityName;
    private Double price;
    private String companyName;
    private String addressLink;
    private String imagePath;
    private String description;

    // 기본 생성자
    public CateringFacilityRequestDTO() {}

    // 파라미터를 받는 생성자
    public CateringFacilityRequestDTO(String facilityName, Double price, String companyName, String addressLink, String imagePath, String description) {
        this.facilityName = facilityName;
        this.price = price;
        this.companyName = companyName;
        this.addressLink = addressLink;
        this.imagePath = imagePath;
        this.description = description;
    }
}