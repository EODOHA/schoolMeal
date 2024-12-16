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

import com.example.schoolMeal.domain.entity.ingredientInfo.ProductSafety;
import com.example.schoolMeal.domain.repository.ingredientInfo.ProductSafetyRepository;

@RestController
@RequestMapping("/product-safety")
public class ProductSafetyController {

	@Autowired
	private ProductSafetyRepository safetyRepository;

	@GetMapping
	public Iterable<ProductSafety> getProductSafety() {
		// 식재료 안정성 검사 결과 정보를 검색하고 반환
		return safetyRepository.findAll();
	}

	@PostMapping("/bulk-upload")
	public ResponseEntity<List<ProductSafety>> uploadSafety(@RequestBody List<ProductSafety> safetyList) {
		try {
			safetyRepository.saveAll(safetyList);
			return ResponseEntity.ok(safetyList);
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
		}
	}
}
