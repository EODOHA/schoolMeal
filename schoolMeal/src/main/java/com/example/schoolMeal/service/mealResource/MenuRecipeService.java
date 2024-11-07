package com.example.schoolMeal.service.mealResource;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.schoolMeal.domain.entity.mealResource.MenuRecipe;
import com.example.schoolMeal.domain.repository.mealResource.MenuRecipeRepository;

@Service
public class MenuRecipeService {

	@Autowired
	private MenuRecipeRepository menuRecipeRepository;
	
	// 글 작성
	public void write(MenuRecipe menuRecipe) {
		menuRecipeRepository.save(menuRecipe);
	}
	
	// 게시글 리스트 처리
	public List<MenuRecipe> menuRecipeList() {
		return menuRecipeRepository.findAll();
	}
	
	// 특정 게시글 불러오기
	public MenuRecipe menuRecipeView(Integer id) {
		return menuRecipeRepository.findById(id).get();
	}
	
	// 특정 게시글 삭제
	public void menuRecipeDelete(Integer id) {
		menuRecipeRepository.deleteById(id);
	}
	
	// 게시글 수정
	public void menuRecipeUpdate(MenuRecipe menuRecipe) {
		menuRecipeRepository.save(menuRecipe);
	}
	 
}
