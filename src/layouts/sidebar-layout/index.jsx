import React from "react";
import * as S from "./styles";

function Sidebar() {
  return (
    <S.SideBar>
      <S.Logo to="/">
        <img src="../../../images/logo.png" alt="logo" />
      </S.Logo>

      <S.Menu to="/">Wisconsin Test</S.Menu>
      <S.Menu to="/d2-test-result">D2 Puan Hesaplaması</S.Menu> 
      
 
    </S.SideBar>
  );
}

export default Sidebar;
