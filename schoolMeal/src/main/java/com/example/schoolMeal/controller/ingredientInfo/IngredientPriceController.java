package com.example.schoolMeal.controller.ingredientInfo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.schoolMeal.domain.entity.ingredientInfo.IngredientPrice;
import com.example.schoolMeal.domain.repository.ingredientInfo.IngredientPriceRepository;

@RestController
public class IngredientPriceController {
	
	@Autowired
	private IngredientPriceRepository priceRepository;
	
	@RequestMapping("/ingredient-price")
	public Iterable<IngredientPrice> getIngredientPrice(){
		//식재료 가격 정보를 검색하고 반환
		return priceRepository.findAll();
	}
	
}
