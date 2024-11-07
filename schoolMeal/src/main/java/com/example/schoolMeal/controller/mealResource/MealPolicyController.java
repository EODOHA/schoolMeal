package com.example.schoolMeal.controller.mealResource;

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
	public String mealPolicyWritePro(@ModelAttribute MealPolicy mealPolicy) {
		mealPolicyService.write(mealPolicy);  // 작성된 영양 교육자료 저장
		return "redirect:/mealPolicy/list";
	}
	
	// 정책자료 첨부파일 저장
	@PostMapping("/uploadImage")
	public String uploadImage(@RequestParam("Image") MultipartFile file) {
		try {
	        String imageUrl = mealPolicyService.saveImage(file);
	        return imageUrl;  // 성공 시 이미지 URL 반환
	    } catch (IOException e) {
	        return "파일 저장 실패";  // 실패 시 간단히 실패 메시지 반환
	    }
	}

	// 정책자료 목록을 반환
	@GetMapping("/list")
	@ResponseBody
	public List<MealPolicy> mealPolicyList() {
	    return mealPolicyService.mealPolicyList(); // 정잭자료 목록을 JSON 형식으로 반환
	}
	
	// 개별 정책자료를 조회 (ID로 조회) (+ ID로 조회는 임시)
	@GetMapping("/view") // localhost:8090/mealPolicy/view?id=1
	public String mealPolicyView(Model model, @RequestParam("id") Integer id) {
	    model.addAttribute("mealPolicy", mealPolicyService.mealPolicyView(id));
	    return "mealPolicyview";
	}
	
	// 정책자료 삭제
	@DeleteMapping("/delete")
	public String mealPolicyDelete(@RequestParam("id") Integer id) {
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


