package com.example.schoolMeal.controller.community;

import com.example.schoolMeal.dto.community.CateringFacilityRequestDTO;
import com.example.schoolMeal.dto.community.CateringFacilityResponseDTO;
import com.example.schoolMeal.service.community.CateringFacilityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/catering-facilities")
public class CateringFacilityController {

    @Autowired
    private CateringFacilityService cateringFacilityService;

    // 급식시설·가구 정보 생성
    @PostMapping
    public ResponseEntity<CateringFacilityResponseDTO> createCateringFacility(@RequestBody CateringFacilityRequestDTO dto) {
        return ResponseEntity.ok(cateringFacilityService.createCateringFacility(dto));
    }

    // 특정 급식시설·가구 정보 조회
    @GetMapping("/{id}")
    public ResponseEntity<CateringFacilityResponseDTO> getCateringFacility(@PathVariable Long id) {
        return ResponseEntity.ok(cateringFacilityService.getCateringFacility(id));
    }

    // 모든 급식시설·가구 정보 조회
    @GetMapping
    public ResponseEntity<List<CateringFacilityResponseDTO>> getAllCateringFacilities() {
        return ResponseEntity.ok(cateringFacilityService.getAllCateringFacilities());
    }

    // 급식시설·가구 정보 수정
    @PutMapping("/{id}")
    public ResponseEntity<Void> updateCateringFacility(@PathVariable Long id, @RequestBody CateringFacilityRequestDTO dto) {
        cateringFacilityService.updateCateringFacility(id, dto);
        return ResponseEntity.ok().build();
    }

    // 급식시설·가구 정보 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCateringFacility(@PathVariable Long id) {
        cateringFacilityService.deleteCateringFacility(id);
        return ResponseEntity.ok().build();
    }
}