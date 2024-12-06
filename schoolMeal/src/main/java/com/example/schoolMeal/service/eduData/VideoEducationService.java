package com.example.schoolMeal.service.eduData;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.example.schoolMeal.common.PathResolver;
import com.example.schoolMeal.domain.entity.FileUrl;
import com.example.schoolMeal.domain.entity.eduData.VideoEducation;
import com.example.schoolMeal.domain.repository.FileUrlRepository;
import com.example.schoolMeal.domain.repository.eduData.VideoEducationRepository;

import jakarta.annotation.PostConstruct;


@Service
public class VideoEducationService extends PathResolver{

    @Autowired
    private VideoEducationRepository videoEducationRepository;
    
    @Autowired
    private FileUrlRepository fileUrlRepository;
    
    /* 파일 업로드 경로 설정 */
    private String videoEduPath;
    
    @PostConstruct
    public void init() {
    	videoEduPath = buildPath("영상교육 자료실");
    	
    	// 저장 경로의 유효성 검사
        File saveDir = new File(videoEduPath);
        if (!saveDir.exists() && !saveDir.mkdirs()) {
            throw new RuntimeException("저장 폴더를 생성할 수 없습니다: " + videoEduPath);
        }
    }

    // 영상 교육자료 목록 반환
    public List<VideoEducation> videoEducationList() {
        try {
            return videoEducationRepository.findAll();
        } catch (Exception e) {
            throw new RuntimeException("게시글 목록 조회 중 오류가 발생했습니다. 다시 시도해 주세요.", e);
        }
    }

    // 특정 파일 정보 조회
    public FileUrl getFileUrlByVideoEduId(Long id) {
        // 해당 ID의 MealPolicyOperation 조회
    	VideoEducation videoEducation = videoEducationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 ID의 게시글이 존재하지 않습니다: " + id));

        // MealPolicyOperation에 연결된 FileUrl 조회
        return videoEducation.getFileUrl();  // 파일이 없으면 null 반환
    }

    // 영상 교육자료 저장
    public void write(VideoEducation videoEducation, MultipartFile file) {
        try {
            if (videoEducation == null) {
                throw new IllegalArgumentException("VideoEducation 객체가 null입니다.");
            }

            if (file != null && !file.isEmpty()) {
                System.out.println("write 메서드에서 파일 처리 시작");
                System.out.println("파일 이름: " + file.getOriginalFilename());
                System.out.println("파일 크기: " + file.getSize());

                // 파일 저장 및 FileUrl 생성
                FileUrl fileUrl = saveFile(file);
                videoEducation.setFileId(fileUrl.getId()); // fileId 설정
            }

            // 게시글 저장
            VideoEducation savedVideoEducation = videoEducationRepository.save(videoEducation);
            System.out.println("DB에 저장된 VideoEdu ID: " + savedVideoEducation.getId());
        } catch (IOException e) {
            throw new RuntimeException("파일 업로드 중 오류가 발생했습니다. 자세한 내용을 확인하세요.", e);
        } catch (Exception e) {
            throw new RuntimeException("게시글 저장 중 오류가 발생했습니다. 다시 시도해 주세요.", e);
        }
    }
    
    // 파일 정보를 DB에 저장하는 메서드
    public FileUrl saveFile(MultipartFile file) throws IOException {
        // 파일 디버깅 출력
        if (file == null || file.isEmpty()) {
            throw new IOException("파일이 비어 있거나 유효하지 않습니다.");
        }

        System.out.println("파일 저장 시작 - 이름: " + file.getOriginalFilename());
        System.out.println("파일 크기: " + file.getSize());

        String origFilename = file.getOriginalFilename();
        if (origFilename == null) {
            throw new IOException("파일 이름이 null입니다.");
        }

        String filename = System.currentTimeMillis() + "_" + origFilename;
        File saveDir = new File(videoEduPath);
        if (!saveDir.exists() && !saveDir.mkdirs()) {
            throw new IOException("저장 폴더를 생성할 수 없습니다.");
        }

        String filePath = videoEduPath + File.separator + filename;
        Long fileSize = file.getSize();

        // 파일 저장 로직
        try {
            file.transferTo(new File(filePath));
            System.out.println("파일이 성공적으로 저장되었습니다: " + filePath);
        } catch (IOException e) {
            throw new IOException("파일 저장 중 오류가 발생했습니다.", e);
        }

        // FileUrl 객체 생성 및 저장
        FileUrl fileUrl = FileUrl.builder()
                .origFileName(origFilename)
                .fileName(filename)
                .filePath(filePath)
                .fileSize(fileSize)
                .build();

        FileUrl savedFileUrl = fileUrlRepository.save(fileUrl);
        System.out.println("DB에 저장된 FileUrl ID: " + savedFileUrl.getId());
        return savedFileUrl;
    }

    // 특정 게시글을 조회하면서 첨부 파일 정보도 함께 반환
    public VideoEducation getPostWithFileDetails(Long id) {
        try {
        	VideoEducation videoEducation = videoEducationRepository.findById(id)
                    .orElseThrow(() -> new IllegalArgumentException("해당 ID의 게시글이 존재하지 않습니다: " + id));

            if (videoEducation.getFileUrl() != null) {
                FileUrl fileUrl = fileUrlRepository.findById(videoEducation.getFileUrl().getId()).orElse(null); // 파일이 없을 경우 null 처리
                videoEducation.setFileUrl(fileUrl); 
            }

            return videoEducation;
        } catch (Exception e) {
            throw new RuntimeException("게시글 조회 중 오류가 발생했습니다. 다시 시도해 주세요.", e);
        }
    }
    
    // 게시글 삭제
    @Transactional
    public ResponseEntity<Integer> videoEducationDelete(Long id) {
        try {
        	VideoEducation videoEducation = videoEducationRepository.findById(id)
                    .orElseThrow(() -> new IllegalArgumentException("해당 ID의 게시글이 존재하지 않습니다: " + id));

            if (videoEducation.getFileUrl() != null) {
                FileUrl fileUrl = videoEducation.getFileUrl();
                File fileToDelete = new File(fileUrl.getFilePath());
                if (fileToDelete.exists()) {
                    boolean deleted = fileToDelete.delete();
                    if (!deleted) {
                        System.err.println("파일 삭제 실패: " + fileUrl.getFilePath() + " (삭제되지 않았습니다)");
                    }
                }
                fileUrlRepository.delete(fileUrl);
            }

            videoEducationRepository.deleteById(id);
            return ResponseEntity.ok(1); // 삭제 성공 시 명시적으로 1 반환

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(0); // 오류 시 0 반환
        }
    }
    
    // 게시글 수정
    @Transactional
    public void videoEducationUpdate(VideoEducation videoEducation, MultipartFile file) throws IOException {
        try {
            if (file != null && !file.isEmpty()) {
                FileUrl existingFile = videoEducation.getFileUrl(); // 기존 파일 정보 가져오기

                if (existingFile != null) {
                    // 기존 파일 삭제
                    File fileToDelete = new File(existingFile.getFilePath());
                    if (fileToDelete.exists() && !fileToDelete.delete()) {
                        throw new IOException("기존 파일 삭제에 실패했습니다.");
                    }

                    // 기존 FileUrl 엔티티 업데이트
                    String newFilePath = saveFileToDisk(file);
                    existingFile.setFileName(file.getOriginalFilename());
                    existingFile.setFilePath(newFilePath);
                    existingFile.setFileSize(file.getSize());
                    fileUrlRepository.save(existingFile); // 업데이트된 파일 정보 저장
                } else {
                    // 기존 파일이 없으면 새 파일 생성
                    FileUrl newFileUrl = saveFile(file);
                    videoEducation.setFileUrl(newFileUrl);
                }

                // 파일 ID도 MealPolicy에 설정
                videoEducation.setFileId(videoEducation.getFileUrl().getId());
            }

            // 게시글 업데이트
            videoEducationRepository.save(videoEducation);

        } catch (IOException e) {
            throw new RuntimeException("파일 업로드 또는 게시글 수정 중 오류가 발생했습니다. 세부사항: " + e.getMessage(), e);
        } catch (Exception e) {
            throw new RuntimeException("게시글 수정 중 예기치 못한 오류가 발생했습니다.", e);
        }
    }
    
    // 파일을 디스크에 저장
    private String saveFileToDisk(MultipartFile file) throws IOException {
        // 파일 저장 경로 생성 (저장 디렉터리 유효성 검사 추가)
        String uploadDir = videoEduPath;
        File directory = new File(uploadDir);
        if (!directory.exists() && !directory.mkdirs()) {
            throw new IOException("파일 저장 디렉터리를 생성하지 못했습니다: " + uploadDir);
        }

        String filename = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        String filePath = uploadDir + File.separator + filename;
        File destination = new File(filePath);
        file.transferTo(destination); // 파일 저장
        return filePath;
    }
    
    // ID로 영상 데이터를 스트리밍할 수 있도록 URL을 반환
    public String getVideoAsBase64(Long id) throws IOException {
        VideoEducation videoEducation = getPostWithFileDetails(id);  // getPostWithFileDetails 사용

        if (videoEducation == null || videoEducation.getFileUrl() == null) {
            throw new IllegalArgumentException("해당 영상이 존재하지 않습니다.");
        }

        // FileUrl 객체에서 filePath를 가져옴
        String videoUrl = videoEducation.getFileUrl().getFilePath().replaceFirst("^videos/", "");
        Path filePath = Paths.get("C:/Video/", videoUrl).normalize();  // 경로 수정

        if (!Files.exists(filePath)) {
            throw new IOException("영상 파일이 존재하지 않습니다.");
        }

        byte[] videoBytes = Files.readAllBytes(filePath);
        String mimeType = Files.probeContentType(filePath);

        return "data:" + mimeType + ";base64," + java.util.Base64.getEncoder().encodeToString(videoBytes);
    }

}