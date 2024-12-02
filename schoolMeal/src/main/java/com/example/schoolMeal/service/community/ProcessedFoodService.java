package com.example.schoolMeal.service.community;

import com.example.schoolMeal.domain.entity.community.CommunityFile;
import com.example.schoolMeal.domain.entity.community.ProcessedFood;
import com.example.schoolMeal.domain.repository.community.ProcessedFoodRepository;
import com.example.schoolMeal.dto.community.ProcessedFoodRequestDTO;
import com.example.schoolMeal.dto.community.ProcessedFoodResponseDTO;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProcessedFoodService {

    @Autowired
    private ProcessedFoodRepository processedFoodRepository;

    // 가공식품 정보 생성 메서드 (이미지 파일 포함)
    public ProcessedFoodResponseDTO createProcessedFood(ProcessedFoodRequestDTO dto, MultipartFile imageFile) throws IOException {
        ProcessedFood processedFood = new ProcessedFood(dto.getProductName(), dto.getPrice(), dto.getConsumerPrice(),
                dto.getCompanyName(), dto.getAddressLink(), dto.getDescription());

        if (imageFile != null && !imageFile.isEmpty()) {
            CommunityFile image = saveFile(imageFile);
            processedFood.setImage(image);
        }

        ProcessedFood savedProcessedFood = processedFoodRepository.save(processedFood);
        return mapToResponseDTO(savedProcessedFood);
    }

    // 모든 가공식품 정보 조회 메서드
    public List<ProcessedFoodResponseDTO> getAllProcessedFoods() {
        return processedFoodRepository.findAll().stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    // 특정 가공식품 정보 조회 메서드
    public ProcessedFoodResponseDTO getProcessedFood(Long id) {
        ProcessedFood processedFood = processedFoodRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Processed Food not found"));
        return mapToResponseDTO(processedFood);
    }

    // 가공식품 정보 수정 메서드
    public void updateProcessedFood(Long id, ProcessedFoodRequestDTO dto, MultipartFile imageFile) throws IOException {
        ProcessedFood processedFood = processedFoodRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Processed Food not found"));

        processedFood.setProductName(dto.getProductName());
        processedFood.setPrice(dto.getPrice());
        processedFood.setConsumerPrice(dto.getConsumerPrice());
        processedFood.setCompanyName(dto.getCompanyName());
        processedFood.setAddressLink(dto.getAddressLink());
        processedFood.setDescription(dto.getDescription());
        processedFood.setUpdatedDate(java.time.LocalDateTime.now());

        if (imageFile != null && !imageFile.isEmpty()) {
            CommunityFile newImage = saveFile(imageFile);
            processedFood.setImage(newImage);
        }

        processedFoodRepository.save(processedFood);
    }

    // 가공식품 정보 삭제 메서드
    public void deleteProcessedFood(Long id) {
        if (!processedFoodRepository.existsById(id)) {
            throw new EntityNotFoundException("Processed Food not found");
        }
        processedFoodRepository.deleteById(id);
    }

    // 파일 저장 메서드
    private CommunityFile saveFile(MultipartFile file) throws IOException {
        String origFilename = file.getOriginalFilename();
        String fileType = file.getContentType();
        byte[] fileBytes = file.getBytes();
        String base64Data = Base64.getEncoder().encodeToString(fileBytes);

        return CommunityFile.builder()
                .origFileName(origFilename)
                .base64Data(base64Data)
                .fileType(fileType)
                .build();
    }

    // ResponseDTO로 매핑하는 헬퍼 메서드
    private ProcessedFoodResponseDTO mapToResponseDTO(ProcessedFood processedFood) {
        String imageBase64 = null;
        if (processedFood.getImage() != null) {
            imageBase64 = processedFood.getImage().getBase64Data();
        }

        return new ProcessedFoodResponseDTO(
                processedFood.getId(),
                processedFood.getProductName(),
                processedFood.getPrice(),
                processedFood.getConsumerPrice(),
                processedFood.getCompanyName(),
                processedFood.getAddressLink(),
                imageBase64,
                processedFood.getDescription(),
                processedFood.getCreatedDate(),
                processedFood.getUpdatedDate()
        );
    }
}
