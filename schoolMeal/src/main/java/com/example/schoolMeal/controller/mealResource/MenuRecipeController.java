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
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.schoolMeal.domain.entity.mealResource.MenuRecipe;
import com.example.schoolMeal.service.mealResource.MenuRecipeService;

/*   급식 자료실 - 식단 및 레시피   */
@RestController
@RequestMapping(value = "/menuRecipe")
public class MenuRecipeController {
	
	@Autowired
	private MenuRecipeService menuRecipeService;
	
	// 식단 및 레시피 작성 폼
	@GetMapping("/write")
	public String menuRecipeWriteForm() {
		return "menuRecipewrite";
	}
	
	// 식단 및 레시피 작성 처리
	@PostMapping("/writepro")
	public String menuRecipeWritePro(@ModelAttribute MenuRecipe menuRecipe, @RequestParam("file") MultipartFile file) {
		// MmenuRecipeService의 write() 메서드 호출 (file도 함께 전달)
		menuRecipeService.write(menuRecipe ,file);  // service 메서드에서 MenuRecipe와 FileUrl 연결 처리
		return "redirect:/menuRecipe/list";
	}

	// 식단 및 레시피 목록을 반환
	@GetMapping("/list")
	public List<MenuRecipe> menuRecipeList() {
	    return menuRecipeService.menuRecipeList(); // 식단 및 레시피 목록을 JSON 형식으로 반환
	}
	
	// 식단 및 레시피를 조회 (ID로 조회) (+ ID로 조회는 임시)
	@GetMapping("/view") // localhost:8090/menuRecipe/view?id=1
    public String menuRecipeView(Model model, @RequestParam("id") Long id) {
		MenuRecipe menuRecipe = menuRecipeService.getPostWithFileDetails(id);
	    model.addAttribute("mealPolicy", menuRecipe);
        return "menuRecipeview";
    }
	
	// 파일 업로드
	@PostMapping("/post")
	public String write(@RequestParam("file") MultipartFile files, MenuRecipe menuRecipe) {
		// MenuRecipeService의 write() 메서드 호출
		menuRecipeService.write(menuRecipe, files);  // 여기서 파일 업로드와 게시글 저장을 처리

		return "redirect:/MenuRecipe/list";
	}
	
	// 식단 및 레시피 삭제
	@DeleteMapping("/delete")
	public String menuRecipeDelete(@RequestParam("id") Long id) {
		menuRecipeService.menuRecipeDelete(id); 
		return "redirect:/menuRecipe/list";
	}
	
	// 식단 및 레시피 수정 처리하는 PUT 요청
    @PutMapping("/update")
    public String menuRecipeUpdate(MenuRecipe menuRecipe) {
    	menuRecipeService.menuRecipeUpdate(menuRecipe); // 식단 및 레시피 수정
        return "redirect:/menuRecipe/list"; 
    }

}
