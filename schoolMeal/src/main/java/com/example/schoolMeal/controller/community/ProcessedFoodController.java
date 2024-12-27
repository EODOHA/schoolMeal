package com.example.schoolMeal.controller.community;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.schoolMeal.domain.entity.community.ProcessedFood;
import com.example.schoolMeal.domain.repository.community.ProcessedFoodRepository;

@RestController
@RequestMapping("/processed-foods")
public class ProcessedFoodController {

    @Autowired
    private ProcessedFoodRepository processedFoodRepository;
    
    @GetMapping
    public Iterable<ProcessedFood> getProcessedFood() {
    	// 가공식품정보를 검색하고 반환.
    	return processedFoodRepository.findAll();
    }

    @PostMapping("/processed-foods-bulk-upload")
    public ResponseEntity<List<ProcessedFood>> uploadProcessedFoodData(@RequestBody List<ProcessedFood> proFoodList) {
    	try {
    		processedFoodRepository.saveAll(proFoodList);
    		return ResponseEntity.ok(proFoodList);
    	} catch (Exception e) {
    		return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
    	}
    }
    
}
