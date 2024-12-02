package com.example.schoolMeal.service.community;

import com.example.schoolMeal.domain.entity.community.ProcessedFood;
import com.example.schoolMeal.domain.repository.community.ProcessedFoodRepository;
import com.example.schoolMeal.dto.community.ProcessedFoodRequestDTO;
import com.example.schoolMeal.dto.community.ProcessedFoodResponseDTO;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;


@Service
public class ProcessedFoodService {

    @Autowired
    private ProcessedFoodRepository processedFoodRepository;

    // 가공식품 정보 생성 메서드
    public ProcessedFoodResponseDTO createProcessedFood(ProcessedFoodRequestDTO dto) {
        ProcessedFood processedFood = new ProcessedFood(dto.getProductName(), dto.getPrice(), dto.getConsumerPrice(),
                dto.getCompanyName(), dto.getAddressLink(), dto.getImagePath(), dto.getDescription());
        ProcessedFood savedProcessedFood = processedFoodRepository.save(processedFood);
        return mapToResponseDTO(savedProcessedFood);
    }

    // 특정 가공식품 정보 조회 메서드
    public ProcessedFoodResponseDTO getProcessedFood(Long id) {
        ProcessedFood processedFood = processedFoodRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Processed Food not found"));
        return mapToResponseDTO(processedFood);
    }

    // 모든 가공식품 정보 조회 메서드
    public List<ProcessedFoodResponseDTO> getAllProcessedFoods() {
        return processedFoodRepository.findAll().stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    // 가공식품 정보 수정 메서드
    public void updateProcessedFood(Long id, ProcessedFoodRequestDTO dto) {
        ProcessedFood processedFood = processedFoodRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Processed Food not found"));
        processedFood.setProductName(dto.getProductName());
        processedFood.setPrice(dto.getPrice());
        processedFood.setConsumerPrice(dto.getConsumerPrice());
        processedFood.setCompanyName(dto.getCompanyName());
        processedFood.setAddressLink(dto.getAddressLink());
        processedFood.setImagePath(dto.getImagePath());
        processedFood.setDescription(dto.getDescription());
        processedFood.setUpdatedDate(LocalDateTime.now());
        processedFoodRepository.save(processedFood);
    }

    // 가공식품 정보 삭제 메서드
    public void deleteProcessedFood(Long id) {
        if (!processedFoodRepository.existsById(id)) {
            throw new EntityNotFoundException("Processed Food not found");
        }
        processedFoodRepository.deleteById(id);
    }

    // ResponseDTO로 매핑하는 헬퍼 메서드
    private ProcessedFoodResponseDTO mapToResponseDTO(ProcessedFood processedFood) {
        return new ProcessedFoodResponseDTO(
                processedFood.getId(),
                processedFood.getProductName(),
                processedFood.getPrice(),
                processedFood.getConsumerPrice(),
                processedFood.getCompanyName(),
                processedFood.getAddressLink(),
                processedFood.getImagePath(),
                processedFood.getDescription(),
                processedFood.getCreatedDate(),
                processedFood.getUpdatedDate()
        );
    }
    
}