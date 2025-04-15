import React from "react";
import { Link } from "react-router-dom"; // Bu satırı ekleyin
import * as S from "./styles";
import { useAuth } from "../../contexts/AuthContext";

function Sidebar() {
  const { isAdmin, logout } = useAuth();

  return (
    <S.SideBar>
      <S.Logo to="/">
        <img src="../../../images/logo.png" alt="logo" />
      </S.Logo>

      <S.Menu to="/anasayfa">Anasayfa</S.Menu>
      <S.Menu to="/wcst-test">Wisconsin Testi</S.Menu>

      {!isAdmin ? (
        <S.LoginButton as={Link} to="/login">
          Giriş Yap
        </S.LoginButton>
      ) : (
        <>
          <S.Menu to="/Iowa-kumar-test">Iowa Kumar Testi</S.Menu>
          <S.Menu to="/d2-test-result">D2 Puan Hesaplaması</S.Menu>
          <S.Menu to="/wcst-test-result">WCST Sonuç</S.Menu>
          <S.LogoutButton onClick={logout}>
            Çıkış Yap
          </S.LogoutButton>
        </>
      )}

<S.FooterText>
        Created by Safer
    
          </S.FooterText>

    </S.SideBar>
  );
}

export default Sidebar;