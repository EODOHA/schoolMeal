package com.example.schoolMeal.controller.mealResource;

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
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.schoolMeal.domain.entity.mealResource.MealPolicy;
import com.example.schoolMeal.service.mealResource.MealPolicyService;

/*   급식 자료실 - 급식 정책 및 운영   */
@RestController
@RequestMapping(value = "/mealPolicy")
public class MealPolicyController {
	
	@Autowired
	private MealPolicyService mealPolicyService;

	
	// 정책자료 작성 폼
	@GetMapping("/write")
	public String mealPolicyWriteForm() {
		return "mealPolicywrite";
	}
	
	// 정책자료 작성 처리
	@PostMapping("/writepro")
	public String mealPolicyWritePro(@ModelAttribute MealPolicy mealPolicy, @RequestParam("file") MultipartFile file) {
	    // MealPolicyService의 write() 메서드 호출 (file도 함께 전달)
	    mealPolicyService.write(mealPolicy, file);  // service 메서드에서 MealPolicy와 FileUrl 연결 처리
	    return "redirect:/mealPolicy/list";  // 저장 후 게시판 리스트로 리디렉션
	}

	// 정책자료 목록을 반환
	@GetMapping("/list")
	@ResponseBody
	public List<MealPolicy> mealPolicyList() {
	    return mealPolicyService.mealPolicyList(); // 정잭자료 목록을 JSON 형식으로 반환
	}
	
	// 개별 정책자료를 조회 (ID로 조회)
	@GetMapping("/view") // localhost:8090/mealPolicy/view?id=1
	public String mealPolicyView(Model model, @RequestParam("id") Long id) {
	    // 특정 게시글을 조회하면서 첨부 파일 정보도 함께 가져옴
	    MealPolicy mealPolicy = mealPolicyService.getPostWithFileDetails(id);
	    model.addAttribute("mealPolicy", mealPolicy);
	    return "mealPolicyview";
	}
	
	// 파일 업로드
	@PostMapping("/post")
	public String write(@RequestParam("file") MultipartFile files, MealPolicy mealPolicy) {
	    // MealPolicyService의 write() 메서드 호출
		mealPolicyService.write(mealPolicy, files);  // 여기서 파일 업로드와 게시글 저장을 처리

	    return "redirect:/mealPolicy/list";
	}

	
	// 정책자료 삭제
	@DeleteMapping("/delete")
	public String mealPolicyDelete(@RequestParam("id") Long id) {
		mealPolicyService.mealPolicyDelete(id);
		return "redirect:/mealPolicy/list";
	}
	
	// 정책자료 수정 처리하는 PUT 요청
    @PutMapping("/update")
    public String mealPolicyUpdate(MealPolicy mealPolicy) {
        mealPolicyService.mealPolicyUpdate(mealPolicy); // 정책자료 수정
        return "redirect:/mealPolicy/list"; 
    }
    
    
}


