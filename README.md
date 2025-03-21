유레카 미니 프로젝트 7조 프론트엔드 레포지토리


1.
Velog Front-End

Velog BenthMarking 을 통한 웹구조 이해

urecaMiniFront
├── index.html
├── css/
│   └── style.css
├── js/
      ├── index.js
      ├── member.js
      ├── profile.js


프로젝트 정보

개발 환경 : Html, Css, JavaScript
Axios Library 사용
JWT 인증 기반의 통신

구현 목록 : 
게시글 작성/수정/삭제
게시글 좋아요
회원가입/ 로그인
프로필 이미지 업로드 & 삭제
사용자 정보 수정
JWT 기반의 인증 요청

ex)
 localStorage.setItem("jwtToken", token); // 로그인 후 토큰 저장
fetch("/api/members/update-profile", {
    method: "PUT",
    headers: { Authorization: Bearer ${token} },
    body: JSON.stringify({ username: "New Name" })
});

프로젝트 결과물
https://youtu.be/a5jftCSjDkA

