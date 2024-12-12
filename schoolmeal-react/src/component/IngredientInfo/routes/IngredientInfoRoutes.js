import React from 'react';
import { Route } from "react-router-dom";

// 식재료 정보 관련 컴포넌트 임포트
import IngredientInfoMain from '../routes/IngredientInfoMain';
// import IngredientPriceList from '../lists/IngredientPriceList';
// import ProductSafetyList from '../lists/ProductSafetyList';
import HaccpInfoList from '../lists/HaccpInfoList';
import HaccpInfoWrite from '../writes/HaccpInfoWrite';
import HaccpInfoEdit from '../edits/HaccpInfoEdit';
import HaccpFileUpload from '../uploads/HaccpFileUpload';



const IngredientInfoRoutes = (
  <>
    <Route path="ingredientInfo" element={<IngredientInfoMain />} />
    {/* <Route path="ingredientInfo/ingredient-price" element={<IngredientPriceList />} />
    <Route path="ingredientInfo/product-safety" element={<ProductSafetyList />} /> */}
    <Route path="ingredientInfo/haccp-info" element={<HaccpInfoList />} />

    <Route path="ingredientInfo/haccp-info/write" element={<HaccpInfoWrite />} />
    <Route path="ingredientInfo/haccp-info/edit/:haccpId" element={<HaccpInfoEdit />} />
    <Route path="haccp-info/write-file-upload" element={<HaccpFileUpload />} />
    <Route path="haccp-info/write" element={<HaccpInfoWrite />} />


  </>
);

export default IngredientInfoRoutes;
