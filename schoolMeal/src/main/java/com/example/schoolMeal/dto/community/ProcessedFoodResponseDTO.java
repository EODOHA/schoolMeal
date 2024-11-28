package com.example.schoolMeal.dto.community;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class ProcessedFoodResponseDTO {
    private Long id;
    private String productName;
    private Double price;
    private Double consumerPrice;
    private String companyName;
    private String addressLink;
    private String imagePath;
    private String description;
    private LocalDateTime createdDate;
    private LocalDateTime updatedDate;

    // 파라미터를 받는 생성자
    public ProcessedFoodResponseDTO(Long id, String productName, Double price, Double consumerPrice, String companyName, String addressLink, String imagePath, String description, LocalDateTime createdDate, LocalDateTime updatedDate) {
        this.id = id;
        this.productName = productName;
        this.price = price;
        this.consumerPrice = consumerPrice;
        this.companyName = companyName;
        this.addressLink = addressLink;
        this.imagePath = imagePath;
        this.description = description;
        this.createdDate = createdDate;
        this.updatedDate = updatedDate;
    }
}