package com.example.schoolMeal.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;

import com.example.schoolMeal.domain.entity.eduData.EduMaterialSharing;
import com.example.schoolMeal.domain.entity.eduData.LessonDemoVideo;
import com.example.schoolMeal.domain.entity.eduData.NutritionDietEducation;
import com.example.schoolMeal.domain.entity.eduData.VideoEducation;
import com.example.schoolMeal.domain.entity.mealResource.MealFacilityEquipment;
import com.example.schoolMeal.domain.entity.mealResource.MealHygiene;
import com.example.schoolMeal.domain.entity.mealResource.MealPolicyOperation;
import com.example.schoolMeal.domain.entity.mealResource.MenuRecipe;
import com.example.schoolMeal.domain.entity.mealResource.NutritionManage;
import com.example.schoolMeal.domain.entity.mealResource.SchoolMealCase;

@Configuration
public class RestConfig {

	@Bean
    @Primary // 이 Bean을 기본으로 설정
    public RepositoryRestConfiguration customRepositoryRestConfiguration(RepositoryRestConfiguration config) {
        config.exposeIdsFor(// 급식자료실
        					MealPolicyOperation.class,
        					MenuRecipe.class,
        					NutritionManage.class,
        					MealHygiene.class,
        					MealFacilityEquipment.class,
        					SchoolMealCase.class,     
        					// 교육자료실
        					NutritionDietEducation.class,
        					VideoEducation.class,
					        LessonDemoVideo.class,
					        EduMaterialSharing.class
					        );
        return config;
    }
}
