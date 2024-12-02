package com.example.schoolMeal.controller.community;

import com.example.schoolMeal.dto.community.ProcessedFoodRequestDTO;
import com.example.schoolMeal.dto.community.ProcessedFoodResponseDTO;
import com.example.schoolMeal.service.community.ProcessedFoodService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/processed-foods")
public class ProcessedFoodController {

    @Autowired
    private ProcessedFoodService processedFoodService;

    // 가공식품 정보 생성
    @PostMapping
    public ResponseEntity<ProcessedFoodResponseDTO> createProcessedFood(@RequestBody ProcessedFoodRequestDTO dto) {
        return ResponseEntity.ok(processedFoodService.createProcessedFood(dto));
    }

    // 특정 가공식품 정보 조회
    @GetMapping("/{id}")
    public ResponseEntity<ProcessedFoodResponseDTO> getProcessedFood(@PathVariable Long id) {
        return ResponseEntity.ok(processedFoodService.getProcessedFood(id));
    }

    // 모든 가공식품 정보 조회
    @GetMapping
    public ResponseEntity<List<ProcessedFoodResponseDTO>> getAllProcessedFoods() {
        return ResponseEntity.ok(processedFoodService.getAllProcessedFoods());
    }

    // 가공식품 정보 수정
    @PutMapping("/{id}")
    public ResponseEntity<Void> updateProcessedFood(@PathVariable Long id, @RequestBody ProcessedFoodRequestDTO dto) {
        processedFoodService.updateProcessedFood(id, dto);
        return ResponseEntity.ok().build();
    }

    // 가공식품 정보 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProcessedFood(@PathVariable Long id) {
        processedFoodService.deleteProcessedFood(id);
        return ResponseEntity.ok().build();
    }
}