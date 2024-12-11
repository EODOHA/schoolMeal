import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

function MealInfoMain() {
    const navigate = useNavigate();

    return (
        <div className="home-container" style={{ marginBottom: "50px" }}>
            <h2 style={{ textAlign: "center" }}>급식정보 Main</h2>
            <div className="button-container" style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate("/mealInfo/meal-menu")}
                >
                    학교별 급식식단 정보
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate("/mealInfo/meal-archive")}
                >
                    학교급식 과거와 현재
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate("/mealInfo/meal-expert")}
                >
                    급식 전문가 인력관리
                </Button>
            </div>
        </div >
    );
}

export default MealInfoMain;
