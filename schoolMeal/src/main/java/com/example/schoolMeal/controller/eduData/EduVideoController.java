package com.example.schoolMeal.controller.eduData;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.schoolMeal.domain.entity.edudata.EduVideo;
import com.example.schoolMeal.service.edudata.EduVideoService;

/*   교육 자료 - 영상 교육자료   */
@RestController
@RequestMapping(value = "/eduVideo")
public class EduVideoController {
	
	@Autowired
	private EduVideoService eduVideoService;
	
	// 영상 교육자료 작성 폼
	@GetMapping("/write")
	public String eduVideoWriteForm() {
		return "eduVideowrite";
	}
	
	// 영상자료 첨부파일 저장
		@PostMapping("/uploadVideo")
		public String uploadVideo(@RequestParam("Video") MultipartFile file) {
			try {
				// 파일 타입 확인
				String contentType = file.getContentType();
				if (contentType != null && contentType.startsWith("video/")) {
					// 영상 파일 저장
					String videoUrl = eduVideoService.saveVideo(file);
					return "영상 파일이 업로드되었습니다." + videoUrl;  // 성공 시 영상 URL 반환
				} else {
					return "지원하지 않는 파일 형식입니다. 영상 파일만 업로드 할 수 있습니다.";
				}
			} catch (IOException e) {
				return "파일 저장 실패" + e.getMessage();  // 실패 시
			}
		}
	
	// 영상 교육자료 작성 처리
	@PostMapping("/writepro")
	public String eduVideoWritePro(@ModelAttribute EduVideo eduVideo) {
		eduVideoService.write(eduVideo);  // 작성된 영상 교육자료 저장
		return "redirect:/eduVideo/list";
	}

	// 영상 교육자료 목록을 반환
	@GetMapping("/list")
	public List<EduVideo> eduVideoList() {
	    return eduVideoService.eduVideoList(); // 영상 교육자료 목록을 JSON 형식으로 반환
	}
	
	// 개별 영상 교육자료를 조회 (ID로 조회) (+ ID로 조회는 임시)
	@GetMapping("/view") // localhost:8090/eduVideo/view?id=1
    public String eduVideoView(Model model, @RequestParam("id") Integer id) {
        model.addAttribute("eduVideo", eduVideoService.eduVideoView(id));
        return "eduVideoview";
    }
	
	// 영상 교육자료 삭제
	@DeleteMapping("/delete")
	public String eduVideoDelete(@RequestParam("id") Integer id) {
		eduVideoService.eduVideoDelete(id); 
		return "redirect:/eduVideo/list";
	}
	
	// 영상 교육자료 수정 처리하는 PUT 요청
    @PutMapping("/update")
    public String eduVideoUpdate(EduVideo eduVideo) {
    	eduVideoService.eduVideoUpdate(eduVideo); // 교육자료 수정
        return "redirect:/eduVideo/list"; 
    }

}
