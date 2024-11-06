package com.example.schoolMeal.controller.eduData;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.schoolMeal.domain.entity.edudata.NutrEdu;
import com.example.schoolMeal.service.edudata.NutrEduService;


/*   교육 자료 - 영양 및 식생활 교육자료   */
@RestController
@RequestMapping(value = "/nutrEdu", produces = "application/json")
//매핑할 때 /NutrEdu로 자동변환이 가끔 되어서 대소문자 구분 없애주는 것. (임시임)
public class NutrEduController {
	
	@Autowired
	private NutrEduService nutrEduService;
	
	// 교육자료 작성 폼
	@GetMapping("/write")
	public String nutrEduWriteForm() {
		return "nutrEduwrite";
	}
	
	// 교육자료 작성 처리
	@PostMapping("/writepro")
	public String nutrEduWritePro(NutrEdu nutrEdu) {
		nutrEduService.write(nutrEdu);  // 작성된 영양 교육자료 저장
		return "redirect:/nutrEdu/list";
	}

	// 교육자료 목록을 반환
	@GetMapping("/list")
	public List<NutrEdu> nutrEduList() {
	    return nutrEduService.nutrEduList(); // 영양 교육자료 목록을 JSON 형식으로 반환
	}
	
	// 개별 교육자료를 조회 (ID로 조회) (+ ID로 조회는 임시)
	@GetMapping("/view") // localhost:8090/nutrEdu/view?id=1
    public String nutrEduView(Model model, Integer id) {
        model.addAttribute("nutrEdu", nutrEduService.nutrEduView(id));
        return "nutrEduview";
    }
	
	/*     미구현 
	// 교육자료 삭제
	@DeleteMapping("/delete")
	public String nutrEduDelete(Integer id) {
		nutrEduService.nutrEduDelete(id); 
		return "redirect:/nutrEdu/list";
	}
	
	// 교육자료 수정 처리하는 PUT 요청
    @PutMapping("/update")
    public String nutrEduUpdate(NutrEdu nutrEdu) {
        nutrEduService.update(nutrEdu); // 교육자료 수정
        return "redirect:/nutrEdu/list"; 
    }

	*/
}
