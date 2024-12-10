package com.example.schoolMeal.service.mealInfo;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.example.schoolMeal.domain.entity.mealInfo.MealArchive;
import com.example.schoolMeal.domain.entity.mealInfo.MealArchiveFile;
import com.example.schoolMeal.domain.repository.mealInfo.MealArchiveRepository;
import com.example.schoolMeal.dto.mealInfo.MealArchiveDto;
import com.example.schoolMeal.dto.mealInfo.MealArchiveFileDto;

@Service
public class MealArchiveService {

	@Autowired
	private MealArchiveRepository archiveRepository;

	@Autowired
	private MealArchiveFileService fileService;

	// 게시글 전체 조회
	public List<MealArchiveDto> getAllArchives() {
		List<MealArchive> archives = archiveRepository.findAll();

		return archives.stream().map(this::convertToDto).collect(Collectors.toList());
	}

	// 게시글 생성
	@Transactional
	public MealArchiveDto createArchive(MealArchiveDto archiveDto, MultipartFile file) {

		// 게시글 생성
		MealArchive mealArchive = MealArchive.builder().arc_title(archiveDto.getArc_title()) // 빌더로 필드 설정
				.arc_content(archiveDto.getArc_content()).build(); // 객체 생성

		// 게시글 저장
		MealArchive savedMealArchive = archiveRepository.save(mealArchive);

		// 파일이 있을 경우 파일 업로드
		if (file != null && !file.isEmpty()) {

			// 파일 업로드 - DB 저장
			MealArchiveFileDto uploadedFileDto = fileService.uploadFile(savedMealArchive, file);

			// 파일을 게시글에 추가
			MealArchiveFile fileEntity = new MealArchiveFile(uploadedFileDto.getArc_originalFilename(),
					uploadedFileDto.getArc_storedFilename(), uploadedFileDto.getArc_file_url(),
					uploadedFileDto.getArc_file_type(), uploadedFileDto.getArc_file_size(), savedMealArchive);

			// 게시글에 파일 추가
			savedMealArchive.getArc_files().add(fileEntity); // 파일을 게시글에 추가
			// 영속성 컨텍스트 플러시
			archiveRepository.flush(); // 세션 동기화
		}
		// DTO로 변환하여 반환
		return convertToDto(savedMealArchive);

	}

	// 게시글 상세조회
	public MealArchiveDto getArchiveById(Long arc_id) {
		MealArchive mealArchive = archiveRepository.findById(arc_id)
				.orElseThrow(() -> new RuntimeException("Archive not found"));
		return convertToDto(mealArchive);
	}

	// 게시글 수정
	@Transactional
	public MealArchiveDto updateArchive(Long arc_id, MealArchiveDto updatedArchive, MultipartFile newFile) {

		// 기존 게시글 조회
		MealArchive existingArchive = archiveRepository.findById(arc_id)
				.orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));

		// 게시글 수정
		existingArchive.setArc_title(updatedArchive.getArc_title());
		existingArchive.setArc_content(updatedArchive.getArc_content());
		
		// 기존 파일 삭제 및 새로운 파일 업로드
		if (newFile != null && !newFile.isEmpty()) { // 새 파일이 있을 경우
			// 기존 파일이 있을 경우
			if (!existingArchive.getArc_files().isEmpty()) {
				MealArchiveFile existingFile = existingArchive.getArc_files().get(0);

				// 기존 파일을 삭제한 후 새로운 파일 저장, 업데이트
				MealArchiveFileDto updatedFileDto = fileService.updateFile(existingFile.getArc_file_id(), newFile);

				// 새로운 파일 정보를 게시글에 반영 (파일 리스트를 업데이트)
				List<MealArchiveFileDto> fileDtos = new ArrayList<>();
				fileDtos.add(updatedFileDto);

				// 게시글 DTO에 파일 정보도 업데이트
				updatedArchive.setArc_files(fileDtos);
			} else {	//기존 파일이 없을 경우
				//새 파일을 저장, 업데이트
				MealArchiveFileDto newFileDto = fileService.uploadFile(existingArchive, newFile);
				MealArchiveFile fileEntity = new MealArchiveFile(
					        newFileDto.getArc_originalFilename(),
					        newFileDto.getArc_storedFilename(),
					        newFileDto.getArc_file_url(),
					        newFileDto.getArc_file_type(),
					        newFileDto.getArc_file_size(),
					        existingArchive);
				existingArchive.getArc_files().add(fileEntity);
				
			}
		}
	
	// 게시글 저장
	MealArchive updatedMealArchive = archiveRepository.save(existingArchive);
	
	archiveRepository.flush(); // 세션 동기화
	// Dto로 변환하여 반환
	return convertToDto(updatedMealArchive);

	}

	// 게시글 삭제
	@Transactional
	public void deleteArchive(Long arc_id) {
		// 게시글 조회
		MealArchive mealArchive = archiveRepository.findById(arc_id)
				.orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));

		// 게시글과 관련된 파일 삭제
		if (mealArchive.getArc_files() != null) {
			for (MealArchiveFile file : mealArchive.getArc_files()) {
				fileService.deleteFile(file.getArc_file_id());
			}
		}

		// 게시글 삭제
		archiveRepository.delete(mealArchive);
	}

	// 엔터티 -> dto 변환 메서드
	private MealArchiveDto convertToDto(MealArchive mealArchive) {

		MealArchiveDto dto = new MealArchiveDto();
		dto.setArc_id(mealArchive.getArc_id());
		dto.setArc_title(mealArchive.getArc_title());
		dto.setArc_content(mealArchive.getArc_content());
		dto.setCreatedDate(mealArchive.getCreatedDate());
		dto.setLastModifiedDate(mealArchive.getLastModifiedDate());

		List<MealArchiveFileDto> fileDtos = mealArchive.getArc_files().stream()
				.map(file -> new MealArchiveFileDto(
						file.getArc_file_id(),
						file.getArc_originalFilename(),
						file.getArc_storedFilename(),
						file.getArc_file_url(),
						file.getArc_file_type(),
						file.getArc_file_size()))
				.collect(Collectors.toList());

		dto.setArc_files(fileDtos);

		return dto;
	}
}
