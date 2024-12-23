package com.example.schoolMeal.service.eduData;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.schoolMeal.common.PathResolver;
import com.example.schoolMeal.domain.entity.FileUrl;
import com.example.schoolMeal.domain.entity.ImageUrl;
import com.example.schoolMeal.domain.entity.eduData.EduMaterialSharing;
import com.example.schoolMeal.domain.repository.FileUrlRepository;
import com.example.schoolMeal.domain.repository.ImageUrlRepository;
import com.example.schoolMeal.domain.repository.eduData.EduMaterialSharingRepository;

import jakarta.annotation.PostConstruct;
import jakarta.transaction.Transactional;

@Service
public class EduMaterialSharingService extends PathResolver {

	@Autowired
	private EduMaterialSharingRepository eduMaterialSharingRepository;

	@Autowired
	private FileUrlRepository fileUrlRepository;

	@Autowired
	private ImageUrlRepository imageUrlRepository;

	/* 파일 업로드 경로 설정 */
	private String eduMaterialSharingPath;
	private String eduMaterialImagePath;

	@PostConstruct
	public void init() {
		eduMaterialSharingPath = buildPath("교육자료 나눔 자료실");
		eduMaterialImagePath = buildPath2("교육자료 나눔 이미지");

		// 저장 경로의 유효성 검사
		File saveDir = new File(eduMaterialSharingPath);
		if (!saveDir.exists() && !saveDir.mkdirs()) {
			throw new RuntimeException("저장 폴더를 생성할 수 없습니다: " + eduMaterialSharingPath);
		}

		File eduMaterialImageSaveDir = new File(eduMaterialImagePath);
		if (!eduMaterialImageSaveDir.exists() && !eduMaterialImageSaveDir.mkdirs()) {
			throw new RuntimeException("저장 폴더를 생성할 수 없습니다: " + eduMaterialImagePath);
		}
	}

	// 게시글 저장
	public String write(EduMaterialSharing eduMaterialSharing, MultipartFile file, MultipartFile imageFile) {
		try {
			if (eduMaterialSharing == null) {
				throw new IllegalArgumentException("EduMaterialSharing 객체가 null입니다.");
			}

			// 파일 처리 (기존 코드 유지)
			String fileUrl = null;
			if (file != null && !file.isEmpty()) {
				FileUrl fileUrlEntity = saveFile(file);
				eduMaterialSharing.setFileUrl(fileUrlEntity);
				fileUrl = fileUrlEntity.getFilePath(); // 파일 URL 반환
			}

			// 이미지 처리 추가
			String imageUrl = null;
			if (imageFile != null && !imageFile.isEmpty()) {
				ImageUrl imageUrlEntity = saveImage(imageFile); // 이미지 저장 메서드 호출
				eduMaterialSharing.setImageUrl(imageUrlEntity); // 이미지 URL 설정
				imageUrl = imageUrlEntity.getImgPath(); // 이미지 URL 반환
			}

			// 게시글 저장
			EduMaterialSharing savedEduMaterialSharing = eduMaterialSharingRepository.save(eduMaterialSharing);
			System.out.println("DB에 저장된 EduMaterialSharing ID: " + savedEduMaterialSharing.getId());

			// 파일과 이미지 URL을 반환
			return fileUrl + "," + imageUrl; // 둘을 연결하여 반환
		} catch (IOException e) {
			throw new RuntimeException("파일 업로드 중 오류가 발생했습니다. 자세한 내용을 확인하세요.", e);
		} catch (Exception e) {
			throw new RuntimeException("게시글 저장 중 오류가 발생했습니다. 다시 시도해 주세요.", e);
		}
	}

	// 파일 정보를 DB에 저장하는 메서드
	public FileUrl saveFile(MultipartFile file) throws IOException {
		String filePath = saveToDisk(file, eduMaterialSharingPath);
		Long fileSize = file.getSize();
		FileUrl fileUrl = FileUrl.builder().origFileName(file.getOriginalFilename())
				.fileName(file.getOriginalFilename()).filePath(filePath).fileSize(fileSize).build();
		return fileUrlRepository.save(fileUrl);
	}

	// 이미지 정보 저장 후, 이미지 URL 반환
	public ImageUrl saveImage(MultipartFile imageFile) throws IOException {
		String imagePath = saveToDisk(imageFile, eduMaterialImagePath); // 이미지 저장 경로
		String imgName = generateUniqueFileName(imageFile); // 고유한 이미지 이름 생성

		ImageUrl imageUrl = ImageUrl.builder().origImgName(imageFile.getOriginalFilename()).imgName(imgName)
				.imgPath(imagePath).imgSize(imageFile.getSize()).build();

		ImageUrl savedImageUrl = imageUrlRepository.save(imageUrl); // DB에 이미지 URL 저장

		// 이미지 URL을 반환
		return savedImageUrl;
	}

	private String generateUniqueFileName(MultipartFile file) {
		return UUID.randomUUID().toString() + "-" + file.getOriginalFilename();
	}

	// 게시글 리스트 반환 메서드
	public List<EduMaterialSharing> eduMaterialSharingList() {
		return eduMaterialSharingRepository.findAll();
	}

	// 특정 파일 정보 조회
	public FileUrl getFileUrlByEduMaterialSharingId(Long id) {
		// 해당 ID의 EduMaterialSharing 조회
		EduMaterialSharing nutrition = eduMaterialSharingRepository.findById(id)
				.orElseThrow(() -> new IllegalArgumentException("해당 ID의 게시글이 존재하지 않습니다: " + id));

		// EduMaterialSharing에 연결된 FileUrl 조회
		return nutrition.getFileUrl(); // 파일이 없으면 null 반환
	}

	// 특정 게시글을 조회하면서 첨부 파일 정보도 함께 반환
	// 게시글 조회
	public EduMaterialSharing getPostWithFileDetails(Long id) {
		try {
			// 해당 ID의 EduMaterialSharing 조회
			EduMaterialSharing eduMaterialSharing = eduMaterialSharingRepository.findById(id)
					.orElseThrow(() -> new IllegalArgumentException("해당 ID의 게시글이 존재하지 않습니다: " + id));

			// 연결된 FileUrl이 있으면 처리
			if (eduMaterialSharing.getFileUrl() != null) {
				FileUrl fileUrl = fileUrlRepository.findById(eduMaterialSharing.getFileUrl().getId()).orElse(null);
				eduMaterialSharing.setFileUrl(fileUrl); // EduMaterialSharing에 FileUrl 설정
			}

			// 게시글 반환
			return eduMaterialSharing;
		} catch (IllegalArgumentException e) {
			// 예외 발생 시 상세 메시지와 함께 로그 출력
			System.err.println("게시글 조회 실패: " + e.getMessage());
			throw e; // 다시 예외를 던짐
		} catch (Exception e) {
			// 기타 예외 발생 시 처리
			System.err.println("게시글 조회 중 오류 발생: " + e.getMessage());
			throw new RuntimeException("게시글 조회 중 오류가 발생했습니다. 다시 시도해 주세요.", e);
		}
	}

	// 게시글 삭제
	@Transactional
	public ResponseEntity<Integer> eduMaterialSharingDelete(Long id) {
		try {
			// 1. 삭제할 EduMaterialSharing 조회
			EduMaterialSharing eduMaterialSharing = eduMaterialSharingRepository.findById(id)
					.orElseThrow(() -> new IllegalArgumentException("해당 ID의 게시글이 존재하지 않습니다: " + id));

			// 2. EduMaterialSharing에서 파일 참조 해제 (FILE_ID를 null로 설정)
			if (eduMaterialSharing.getFileUrl() != null) {
				FileUrl fileUrl = eduMaterialSharing.getFileUrl();
				eduMaterialSharing.setFileUrl(null); // fileUrl 설정
				eduMaterialSharingRepository.save(eduMaterialSharing); // DB에 반영

				// 3. 파일 삭제
				File fileToDelete = new File(fileUrl.getFilePath());
				if (fileToDelete.exists()) {
					boolean deleted = fileToDelete.delete();
					if (!deleted) {
						System.err.println("파일 삭제 실패: " + fileUrl.getFilePath() + " (삭제되지 않았습니다)");
						throw new IOException("파일 삭제 실패");
					}
				}

				// 4. FileUrl 삭제
				fileUrlRepository.delete(fileUrl);
				System.out.println("파일 URL 삭제 완료: " + fileUrl.getId());
			}

			// 5. 게시글 삭제
			eduMaterialSharingRepository.deleteById(id);
			System.out.println("게시글 삭제 완료: " + id);

			return ResponseEntity.ok(1); // 삭제 성공 시 명시적으로 1 반환

		} catch (Exception e) {
			// 예외 로그 출력
			System.err.println("게시글 삭제 중 오류 발생: " + e.getMessage());
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(0); // 오류 시 0 반환
		}
	}

	// 게시글 수정 (이미지 업데이트)
	@Transactional
	public void eduMaterialSharingUpdate(EduMaterialSharing eduMaterialSharing, MultipartFile file,
			MultipartFile imageFile) throws IOException {
		try {
			// 파일 처리 (기존 코드 유지)
			if (file != null && !file.isEmpty()) {
				// 기존 파일이 있을 경우 삭제
				FileUrl existingFile = eduMaterialSharing.getFileUrl();
				if (existingFile != null) {
					File fileToDelete = new File(existingFile.getFilePath());
					if (fileToDelete.exists() && !fileToDelete.delete()) {
						throw new IOException("기존 파일 삭제에 실패했습니다.");
					}
				}
				// 새 파일 저장
				FileUrl newFileUrl = saveFile(file);
				eduMaterialSharing.setFileUrl(newFileUrl);
			} else {
				// 파일이 없으면 기존 파일을 유지하거나 처리하지 않음
				if (eduMaterialSharing.getFileUrl() == null) {
					// 파일이 없을 경우 예외를 던지지 않고 그냥 처리
				}
			}

			// 이미지 처리
			if (imageFile != null && !imageFile.isEmpty()) {
				// 기존 이미지가 있을 경우 삭제
				ImageUrl existingImage = eduMaterialSharing.getImageUrl();
				if (existingImage != null) {
					// 디스크에서 기존 이미지 삭제
					File imageToDelete = new File(existingImage.getImgPath());
					if (imageToDelete.exists() && !imageToDelete.delete()) {
						throw new IOException("기존 이미지 삭제에 실패했습니다.");
					}

					// 기존 이미지 엔티티 삭제
					imageUrlRepository.delete(existingImage);
					System.out.println("기존 이미지 삭제 완료: " + existingImage.getId());
				}

				// 새 이미지 저장
				ImageUrl newImageUrl = saveImage(imageFile);
				eduMaterialSharing.setImageUrl(newImageUrl);
			} else {
				// 이미지가 없으면 기존 이미지를 유지하거나 처리하지 않음
				if (eduMaterialSharing.getImageUrl() == null) {
					// 이미지가 없을 경우 예외를 던지지 않고 그냥 처리
				}
			}

			// 게시글 업데이트
			eduMaterialSharingRepository.save(eduMaterialSharing);

		} catch (IOException e) {
			throw new RuntimeException("파일 업로드 또는 게시글 수정 중 오류가 발생했습니다. 세부사항: " + e.getMessage(), e);
		} catch (Exception e) {
			throw new RuntimeException("게시글 수정 중 예기치 못한 오류가 발생했습니다.", e);
		}
	}

	// 파일을 디스크에 저장하는 메서드
	private String saveToDisk(MultipartFile file, String path) throws IOException {
		File saveDir = new File(path);
		if (!saveDir.exists() && !saveDir.mkdirs()) {
			throw new IOException("저장 폴더를 생성할 수 없습니다: " + path);
		}

		String filename = System.currentTimeMillis() + "_" + file.getOriginalFilename();
		String filePath = path + File.separator + filename;
		file.transferTo(new File(filePath));
		return filePath;
	}

	public String getEduMaterialSharingPath() {
		return eduMaterialImagePath;
	}

	public ImageUrl getImageUrlById(Long imageId) {
		return imageUrlRepository.findById(imageId).orElse(null);
	}

}
