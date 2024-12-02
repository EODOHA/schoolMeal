package com.example.schoolMeal.service.imageManage;

import java.nio.file.Files;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.schoolMeal.domain.entity.imageManage.ImageManage;
import com.example.schoolMeal.domain.repository.imageManage.ImageManageRepository;
import com.example.schoolMeal.dto.imageManage.ImageManageDto;

@Service
public class ImageManageService {
	
	@Autowired
	private ImageManageRepository imageManageRepository;
	
	// 이미지 및 영상 업로드 (카테고리 포함)
	public ImageManageDto uploadImage(MultipartFile file, String category) throws Exception {
		// 업로드 된 파일의 이름, 데이터, MIME타입 가져오기.
		String fileName = file.getOriginalFilename();
		String mimeType = file.getContentType();
		
		ImageManage imageManage = new ImageManage();
		imageManage.setName(fileName);
		imageManage.setCategory(category);
		imageManage.setMimeType(mimeType);
		imageManage.setData(file.getBytes());
		
		imageManageRepository.save(imageManage);
		
		return new ImageManageDto(
				imageManage.getId(),
				null, // Base64 데이터는 조회할 때 반환.
				imageManage.getName(),
				category,
				mimeType
			);
	}
	
	// 카테고리별 이미지 및 영상 조회 (Base64 반환)
	public List<ImageManageDto> getImagesByCategory(String category) {
		return imageManageRepository.findAll().stream()
				.filter(imageManage -> imageManage.getCategory().equals(category))
				.map(imageManage -> {
					String base64Data = 
							java.util.Base64.getEncoder()
								.encodeToString(imageManage.getData());
					
					// MIME 타입에 따라 Base64 URL 접두어 설정.
					String dataUrl = 
							"data:" + imageManage.getMimeType() + ";base64," + base64Data;
					
					return new ImageManageDto(
							imageManage.getId(),
							// Base64로 인코딩된 데이터 반환.
							dataUrl,
							imageManage.getName(),
							imageManage.getCategory(),
							imageManage.getMimeType()
						);
				})
				.collect(Collectors.toList());
	}
	
	// 카테고리별 이미지 및 영상 수정
	public ImageManageDto updateImage(Long id, MultipartFile file, String category) throws Exception {
		// ID로 기존 이미지 조회.
		ImageManage existingImage = imageManageRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("이미지를 찾을 수 없습니다."));
		
		// 새로운 파일의 이름과 데이터 가져오기.
		String fileName = file.getOriginalFilename();
		String mimeType = file.getContentType();
		
		// 이미지 정보 수정.
		existingImage.setName(fileName);
		existingImage.setCategory(category);
		existingImage.setMimeType(mimeType);
		existingImage.setData(file.getBytes());
		
		// DB에 수정된 이미지 저장.
		imageManageRepository.save(existingImage);
		
		// 수정된 이미지 정보 반환.
		return new ImageManageDto(
				existingImage.getId(),
				null,
				existingImage.getName(),
				category,
				mimeType
		);
	}
	
	// 이미지 삭제
	public void deleteImageManage(Long id) {
		imageManageRepository.deleteById(id);
	}
	

}
