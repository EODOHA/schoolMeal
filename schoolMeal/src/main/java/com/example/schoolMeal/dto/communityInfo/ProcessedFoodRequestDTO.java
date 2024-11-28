package com.example.schoolMeal.dto.communityInfo;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter

public class ProcessedFoodRequestDTO {
    private String productName;
    private Double price;
    private Double consumerPrice;
    private String companyName;
    private String addressLink;
    private String imagePath;
    private String description;

    // 기본 생성자
    public ProcessedFoodRequestDTO() {}

    // 파라미터를 받는 생성자
    public ProcessedFoodRequestDTO(String productName, Double price, Double consumerPrice, String companyName, String addressLink, String imagePath, String description) {
        this.productName = productName;
        this.price = price;
        this.consumerPrice = consumerPrice;
        this.companyName = companyName;
        this.addressLink = addressLink;
        this.imagePath = imagePath;
        this.description = description;
    }

}