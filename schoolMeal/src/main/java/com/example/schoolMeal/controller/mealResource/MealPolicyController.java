package com.example.schoolMeal.controller.mealResource;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import com.example.schoolMeal.domain.entity.mealResource.MealPolicy;
import com.example.schoolMeal.service.mealResource.MealPolicyService;

/*   급식 자료실 - 급식 정책 및 운영   */
@Controller
@RequestMapping(value = "/mealPolicy", produces = "application/json")
//매핑할 때 /MealPolicy 자동변환이 가끔 되어서 대소문자 구분 없애주는 것. (임시임)
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
	public String mealPolicyWritePro(MealPolicy mealPolicy) {
		mealPolicyService.write(mealPolicy);  // 작성된 영양 교육자료 저장
		return "redirect:/mealPolicy/list";
	}

	// 정책자료 목록을 반환
	@GetMapping("/list")
	public List<MealPolicy> mealPolicyList() {
	    return mealPolicyService.mealPolicyList(); // 정잭자료 목록을 JSON 형식으로 반환
	}
	
	// 개별 정책자료를 조회 (ID로 조회) (+ ID로 조회는 임시)
	@GetMapping("/view") // localhost:8090/mealPolicy/view?id=1
    public String mealPolicyView(Model model, Integer id) {
        model.addAttribute("mealPolicy", mealPolicyService.mealPolicyView(id));
        return "mealPolicyview";
    }
	
	/*     미구현 
	@DeleteMapping("/delete")
	public String mealPolicyDelete(Integer id) {
		mealPolicyService.mealPolicyDelete(id);
		return "redirect:/mealPolicy/list";
	}
	
	// 교육자료 수정 처리하는 PUT 요청
    @PutMapping("/update")
    public String mealPolicyUpdate(MealPolicy mealPolicy) {
        mealPolicyService.update(mealPolicy); // 정책자료 수정
        return "redirect:/mealPolicy/list"; 
    }
    
    */
}


