package com.example.schoolMeal.controller.mealCounsel;

//식생활 및 습관 진단 프로그램 페이지(현재는 URL형식으로 특정 사이트에 연결)
//향후 필요하다면 진단 페이지를 직접 제작
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.servlet.view.RedirectView;

@Controller
public class CounselController {

    @GetMapping("/goToCounsel")
    public RedirectView redirectToExternalUrl() {

        //아래 URL: 식생활 진단 웹 페이지
        String externalUrl = "https://www.foodsafetykorea.go.kr/portal/exhealthyfoodlife/index.html";
        return new RedirectView(externalUrl);
    }
    
}
