package com.example.schoolMeal.controller.ingredientInfo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.schoolMeal.domain.entity.ingredientInfo.ProductSafety;
import com.example.schoolMeal.domain.repository.ingredientInfo.ProductSafetyRepository;

@RestController
public class ProductSafetyController {

	@Autowired
	private ProductSafetyRepository safetyRepository;
	
	@RequestMapping("/product-safety")
	public Iterable<ProductSafety> getProductSafety(){
		// 식재료 안정성 검사 결과 정보를 검색하고 반환
		return safetyRepository.findAll();
		
	}
}
