package com.example.schoolMeal.controller.eduData;

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

import com.example.schoolMeal.domain.entity.eduData.NutritionDietEducation;
import com.example.schoolMeal.service.eduData.NutritionDietEducationService;

/*   교육 자료 - 영양 및 식생활 교육자료   */
@RestController
@RequestMapping(value = "/ntritionDietEducation")
public class NutritionDietEducationController {
	
	@Autowired
	private NutritionDietEducationService nutrEduService;
	
	// 교육자료 작성 폼
	@GetMapping("/write")
	public String nutrEduWriteForm() {
		return "nutrEduwrite";
	}
	
	// 교육자료 작성 처리
	@PostMapping("/writepro")
	public String nutrEduWritePro(@ModelAttribute NutritionDietEducation nutrEdu) {
		nutrEduService.write(nutrEdu);  // 작성된 영양 교육자료 저장
		return "redirect:/nutrEdu/list";
	}

	// 교육자료 목록을 반환
	@GetMapping("/list")
	public List<NutritionDietEducation> nutrEduList() {
	    return nutrEduService.nutrEduList(); // 영양 교육자료 목록을 JSON 형식으로 반환
	}
	
	// 개별 교육자료를 조회 (ID로 조회) (+ ID로 조회는 임시)
	@GetMapping("/view") // localhost:8090/nutrEdu/view?id=1
    public String nutrEduView(Model model, @RequestParam("id") Long id) {
        model.addAttribute("nutrEdu", nutrEduService.nutrEduView(id));
        return "nutrEduview";
    }
	
	// 교육자료 삭제
	@DeleteMapping("/delete")
	public String nutrEduDelete(@RequestParam("id") Long id) {
		nutrEduService.nutrEduDelete(id); 
		return "redirect:/nutrEdu/list";
	}
	
	// 교육자료 수정 처리하는 PUT 요청
    @PutMapping("/update")
    public String nutrEduUpdate(NutritionDietEducation nutrEdu) {
        nutrEduService.nutrEduUpdate(nutrEdu); // 교육자료 수정
        return "redirect:/nutrEdu/list"; 
    }

}
