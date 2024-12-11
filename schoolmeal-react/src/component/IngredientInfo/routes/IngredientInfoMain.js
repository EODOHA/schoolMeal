import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

function IngredientInfoMain() {
    const navigate = useNavigate();

    return (
        <div className="home-container" style={{ marginBottom: "50px" }}>
            <h2 style={{ textAlign: "center" }}>식재료 정보 Main</h2>
            <div className="button-container" style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate("/ingredientInfo/ingredient-price")}
                >
                    식재료 가격정보
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate("/ingredientInfo/product-safety")}
                >
                    식품 안정성 조사결과 정보
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate("/ingredientInfo/haccp-info")}
                >
                    식재료 안정성 인증 정보
                </Button>
            </div>
        </div >
    );
}

export default IngredientInfoMain;
