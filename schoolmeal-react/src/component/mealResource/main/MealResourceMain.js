import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

function MealResourceMain() {
    const navigate = useNavigate();

    return (
        <div className="home-container">
            <h2>게시판 선택 Home</h2>
            <div className="button-container">
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate("/mealResource/meal-policy-operation")}
                >
                    급식 정책 게시판
                </Button>
                <br /><br />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate("/mealResource/menu-recipe")}
                >
                    식단 및 레시피 게시판
                </Button>
                <br /><br />
            </div>
        </div>
    );
}

export default MealResourceMain;
