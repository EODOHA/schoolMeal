package com.example.schoolMeal.controller.community;

import com.example.schoolMeal.dto.community.ProcessedFoodRequestDTO;
import com.example.schoolMeal.dto.community.ProcessedFoodResponseDTO;
import com.example.schoolMeal.service.community.ProcessedFoodService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/processed-foods")
public class ProcessedFoodController {

    @Autowired
    private ProcessedFoodService processedFoodService;

    // 가공식품 정보 생성 (이미지 파일 포함)
    @PostMapping("/create")
    public ResponseEntity<ProcessedFoodResponseDTO> createProcessedFood(
            @RequestPart("data") ProcessedFoodRequestDTO dto,
            @RequestPart(value = "image", required = false) MultipartFile imageFile) throws IOException {
        return ResponseEntity.ok(processedFoodService.createProcessedFood(dto, imageFile));
    }

    // 모든 가공식품 정보 조회
    @GetMapping("/list")
    public ResponseEntity<List<ProcessedFoodResponseDTO>> getAllProcessedFoods() {
        return ResponseEntity.ok(processedFoodService.getAllProcessedFoods());
    }

    // 특정 가공식품 정보 조회
    @GetMapping("/list/{id}")
    public ResponseEntity<ProcessedFoodResponseDTO> getProcessedFood(@PathVariable Long id) {
        return ResponseEntity.ok(processedFoodService.getProcessedFood(id));
    }

    // 가공식품 정보 수정 (이미지 파일 포함)
    @PutMapping("/update/{id}")
    public ResponseEntity<Void> updateProcessedFood(
            @PathVariable Long id,
            @RequestPart("data") ProcessedFoodRequestDTO dto,
            @RequestPart(value = "image", required = false) MultipartFile imageFile) throws IOException {
        processedFoodService.updateProcessedFood(id, dto, imageFile);
        return ResponseEntity.ok().build();
    }

    // 가공식품 정보 삭제
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteProcessedFood(@PathVariable Long id) {
        processedFoodService.deleteProcessedFood(id);
        return ResponseEntity.ok().build();
    }
}
