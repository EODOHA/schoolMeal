package com.example.schoolMeal.service;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.schoolMeal.common.PathResolver;
import com.example.schoolMeal.domain.entity.ImageUrl;
import com.example.schoolMeal.domain.repository.ImageUrlRepository;

import jakarta.annotation.PostConstruct;
import jakarta.transaction.Transactional;

@Service
public class ImageUrlService extends PathResolver {

	@Autowired
	private ImageUrlRepository imageUrlRepository;

	private String schoolImagePath;
	private String eduMaterialSharingPathPath;

	// 서비스별 경로 맵핑
	private Map<String, String> servicePathMap;

	@PostConstruct
	public void init() {
		schoolImagePath = buildPath2("학교급식 우수사례 이미지");
		eduMaterialSharingPathPath = buildPath2("교육자료 나눔 이미지");

		// HashMap을 사용하여 서비스별 경로 맵핑
		servicePathMap = new HashMap<>();
		servicePathMap.put("service1", schoolImagePath);
		servicePathMap.put("service2", eduMaterialSharingPathPath);
	}

	@Transactional
	public ImageUrl saveImage(MultipartFile file, Long existingImageId, String serviceType) throws IOException {
		if (file == null || file.isEmpty()) {
			// 파일이 없으면 null 반환 (혹은 imageUrl을 null로 설정하는 방식도 가능)
			return null;
		}

		// 기존 이미지가 있으면 삭제
		if (existingImageId != null) {
			deleteImage(existingImageId); // 기존 이미지 삭제
		}

		// 새 이미지 저장
		String origImgName = file.getOriginalFilename(); // 원본 이미지 이름
		String imgName = System.currentTimeMillis() + "_" + origImgName; // 저장된 이미지 이름

		// 서비스별 저장 경로 선택
		String savePath = selectSavePath(serviceType);

		java.io.File saveDir = new java.io.File(savePath);
		if (!saveDir.exists()) {
			boolean dirsCreated = saveDir.mkdirs();
			if (!dirsCreated) {
				throw new IOException("파일 저장 경로를 생성할 수 없습니다: " + savePath);
			}
		}

		// 이미지 저장 경로와 이름 설정
		String imgPath = savePath + File.separator + imgName;
		java.io.File destFile = new java.io.File(imgPath);

		// 이미지 저장
		try {
			file.transferTo(destFile); // 이미지 파일을 해당 경로에 저장
		} catch (IOException e) {
			throw new IOException("이미지 저장 중 오류가 발생했습니다: " + e.getMessage(), e);
		}

		// 이미지 정보를 DB에 저장
		ImageUrl newImageUrl = ImageUrl.builder().origImgName(origImgName) // 원본 이미지 이름
				.imgName(imgName) // 저장된 이미지 이름
				.imgPath(imgPath) // 이미지 경로
				.imgSize(file.getSize()) // 이미지 크기 (바이트 단위)
				.build();

		return imageUrlRepository.save(newImageUrl); // DB에 이미지 정보 저장 후 반환
	}

	private String selectSavePath(String serviceType) {
		// 서비스 타입에 해당하는 경로 반환, 없으면 예외 발생
		String path = servicePathMap.get(serviceType);
		if (path == null) {
			throw new IllegalArgumentException("지원하지 않는 서비스 유형: " + serviceType);
		}
		return path;
	}

	// 이미지 삭제 메서드
	@Transactional
	public void deleteImage(Long imageId) throws IOException {
		// 이미지 정보 가져오기
		ImageUrl imageUrl = imageUrlRepository.findById(imageId)
				.orElseThrow(() -> new IllegalArgumentException("이미지를 찾을 수 없습니다: " + imageId));

		// 이미지 삭제 전에 경로를 확인
		String imgPath = imageUrl.getImgPath();
		File fileToDelete = new File(imgPath);

		// 이미지가 존재하는지 확인
		if (!fileToDelete.exists()) {
			throw new IOException("이미지가 존재하지 않습니다: " + imgPath);
		}

		// 이미지 삭제 시도
		boolean deleted = fileToDelete.delete();
		if (!deleted) {
			// 삭제 실패 시 예외 처리
			throw new IOException("이미지 삭제 실패: " + imgPath);
		} else {
			// 삭제 성공 시 로그 추가
			System.out.println("이미지 삭제 성공: " + imgPath);
		}

		// DB에서 이미지 정보 삭제
		imageUrlRepository.delete(imageUrl);
	}

	// 이미지 정보를 DB에서 가져오는 메서드
	@Transactional
	public ImageUrl getImage(Long imageId) {
		return imageUrlRepository.findById(imageId)
				.orElseThrow(() -> new IllegalArgumentException("이미지를 찾을 수 없습니다: " + imageId));
	}
}
