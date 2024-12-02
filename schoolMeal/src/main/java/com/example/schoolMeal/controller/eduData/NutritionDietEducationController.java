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
	private NutritionDietEducationService ntritionDietEducationService;
	
	// 교육자료 작성 폼
	@GetMapping("/write")
	public String ntritionDietEducationWriteForm() {
		return "ntritionDietEducationwrite";
	}
	
	// 교육자료 작성 처리
	@PostMapping("/writepro")
	public String ntritionDietEducationWritePro(@ModelAttribute NutritionDietEducation ntritionDietEducation) {
		ntritionDietEducationService.write(ntritionDietEducation);  // 작성된 영양 교육자료 저장
		return "redirect:/ntritionDietEducation/list";
	}

	// 교육자료 목록을 반환
	@GetMapping("/list")
	public List<NutritionDietEducation> ntritionDietEducationList() {
	    return ntritionDietEducationService.ntritionDietEducationList(); // 영양 교육자료 목록을 JSON 형식으로 반환
	}
	
	// 개별 교육자료를 조회 (ID로 조회) (+ ID로 조회는 임시)
	@GetMapping("/view") // localhost:8090/ntritionDietEducation/view?id=1
    public String ntritionDietEducationView(Model model, @RequestParam("id") Long id) {
        model.addAttribute("ntritionDietEducation", ntritionDietEducationService.ntritionDietEducationView(id));
        return "ntritionDietEducationview";
    }
	
	// 교육자료 삭제
	@DeleteMapping("/delete")
	public String ntritionDietEducationDelete(@RequestParam("id") Long id) {
		ntritionDietEducationService.ntritionDietEducationDelete(id); 
		return "redirect:/ntritionDietEducation/list";
	}
	
	// 교육자료 수정 처리하는 PUT 요청
    @PutMapping("/update")
    public String ntritionDietEducationUpdate(NutritionDietEducation ntritionDietEducation) {
        ntritionDietEducationService.ntritionDietEducationUpdate(ntritionDietEducation); // 교육자료 수정
        return "redirect:/ntritionDietEducation/list"; 
    }
}
