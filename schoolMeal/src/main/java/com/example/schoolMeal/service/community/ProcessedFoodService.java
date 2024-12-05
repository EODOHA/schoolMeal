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

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProcessedFoodService {

    @Autowired
    private ProcessedFoodRepository processedFoodRepository;

    private final String uploadDir = "C:/uploadTest/가공식품"; // 이미지 저장 경로

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

    // 파일 저장 메서드 - 이미지 파일을 디스크에 저장하고, Base64 인코딩한 데이터를 데이터베이스에 저장
    private CommunityFile saveFile(MultipartFile file) throws IOException {
        String origFilename = file.getOriginalFilename();
        if (origFilename == null || origFilename.isEmpty()) {
            throw new IOException("파일 이름이 유효하지 않습니다.");
        }

        // 디스크에 저장할 파일 이름 생성
        String filename = System.currentTimeMillis() + "_" + origFilename;
        String filePath = uploadDir + File.separator + filename;

        // 저장 디렉터리 확인 및 생성
        File saveDir = new File(uploadDir);
        if (!saveDir.exists() && !saveDir.mkdirs()) {
            throw new IOException("파일 저장 디렉터리를 생성하지 못했습니다: " + uploadDir);
        }

        // 파일을 디스크에 저장
        Path savePath = Paths.get(filePath);
        Files.copy(file.getInputStream(), savePath);

        // 파일을 InputStream으로 읽고 Base64로 인코딩
        byte[] bytes = Files.readAllBytes(savePath);
        String base64Data = Base64.getEncoder().encodeToString(bytes);
        String mimeType = file.getContentType();

        // 파일 엔티티 생성 및 데이터베이스에 저장
        return CommunityFile.builder()
                .origFileName(filename)
                .base64Data(base64Data)
                .fileType(mimeType)
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
