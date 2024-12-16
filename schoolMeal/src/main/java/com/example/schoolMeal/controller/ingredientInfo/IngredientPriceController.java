package com.example.schoolMeal.controller.ingredientInfo;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.schoolMeal.domain.entity.ingredientInfo.IngredientPrice;
import com.example.schoolMeal.domain.repository.ingredientInfo.IngredientPriceRepository;

@RestController
@RequestMapping("/ingredient-price")
public class IngredientPriceController {

	@Autowired
	private IngredientPriceRepository priceRepository;

	@GetMapping
	public Iterable<IngredientPrice> getIngredientPrice() {
		// 식재료 가격 정보를 검색하고 반환
		return priceRepository.findAll();
	}

	@PostMapping("/bulk-upload")
	public ResponseEntity<List<IngredientPrice>> uploadPriceData(@RequestBody List<IngredientPrice> priceList) {
		try {
			priceRepository.saveAll(priceList);
			return ResponseEntity.ok(priceList);
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
		}
	}
}
