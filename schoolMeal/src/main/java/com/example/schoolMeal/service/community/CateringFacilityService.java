package com.example.schoolMeal.service.community;

import com.example.schoolMeal.domain.entity.community.CateringFacility;
import com.example.schoolMeal.domain.repository.community.CateringFacilityRepository;
import com.example.schoolMeal.dto.community.CateringFacilityRequestDTO;
import com.example.schoolMeal.dto.community.CateringFacilityResponseDTO;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CateringFacilityService {

    @Autowired
    private CateringFacilityRepository cateringFacilityRepository;

    // 급식시설·가구 정보 생성 메서드 (ADMIN , LINKAGE , MEMBER 사용가능)
    public CateringFacilityResponseDTO createCateringFacility(CateringFacilityRequestDTO dto) {
        CateringFacility cateringFacility = new CateringFacility(dto.getFacilityName(), dto.getPrice(),
                dto.getCompanyName(), dto.getAddressLink(), dto.getImagePath(), dto.getDescription());
        CateringFacility savedFacility = cateringFacilityRepository.save(cateringFacility);
        return mapToResponseDTO(savedFacility);
    }

    // 특정 급식시설·가구 정보 조회 메서드 (ADMIN , LINKAGE , MEMBER , GUEST 사용가능)
    public CateringFacilityResponseDTO getCateringFacility(Long id) {
        CateringFacility cateringFacility = cateringFacilityRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Catering Facility not found"));
        return mapToResponseDTO(cateringFacility);
    }

    // 모든 급식시설·가구 정보 조회 메서드 (ADMIN , LINKAGE , MEMBER , GUEST 사용가능)
    public List<CateringFacilityResponseDTO> getAllCateringFacilities() {
        return cateringFacilityRepository.findAll().stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    // 급식시설·가구 정보 수정 메서드 (ADMIN , MEMBER(작성한사람) 사용가능)
    public void updateCateringFacility(Long id, CateringFacilityRequestDTO dto) {
        CateringFacility cateringFacility = cateringFacilityRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Catering Facility not found"));
        cateringFacility.setFacilityName(dto.getFacilityName());
        cateringFacility.setPrice(dto.getPrice());
        cateringFacility.setCompanyName(dto.getCompanyName());
        cateringFacility.setAddressLink(dto.getAddressLink());
        cateringFacility.setImagePath(dto.getImagePath());
        cateringFacility.setDescription(dto.getDescription());
        cateringFacility.setUpdatedDate(LocalDateTime.now());
        cateringFacilityRepository.save(cateringFacility);
    }

    // 급식시설·가구 정보 삭제 메서드 (ADMIN , MEMBER(작성한사람) 사용가능)
    public void deleteCateringFacility(Long id) {
        if (!cateringFacilityRepository.existsById(id)) {
            throw new EntityNotFoundException("Catering Facility not found");
        }
        cateringFacilityRepository.deleteById(id);
    }

    // ResponseDTO로 매핑하는 헬퍼 메서드
    private CateringFacilityResponseDTO mapToResponseDTO(CateringFacility cateringFacility) {
        return new CateringFacilityResponseDTO(
                cateringFacility.getId(),
                cateringFacility.getFacilityName(),
                cateringFacility.getPrice(),
                cateringFacility.getCompanyName(),
                cateringFacility.getAddressLink(),
                cateringFacility.getImagePath(),
                cateringFacility.getDescription(),
                cateringFacility.getCreatedDate(),
                cateringFacility.getUpdatedDate()
        );
    }
    
}