1.
 Velog Front-End 
 
 Velog BenthMarking 을 통한 웹구조 이해
 
 urecaMiniFront <br/>
 ├── index.html  <br/>
 ├── css/   <br/>
 │   └── style.css  <br/>
 ├── js/<br/>
       ├── index.js <br/>
       ├── member.js  <br/>
       ├── profile.js  <br/>
 
 
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
 ```
 ex)
  localStorage.setItem("jwtToken", token); // 로그인 후 토큰 저장
 fetch("/api/members/update-profile", {
     method: "PUT",
     headers: { Authorization: Bearer ${token} },
     body: JSON.stringify({ username: "New Name" })
 });
```
프로젝트 회고
yongGyu :

전반적인 회원관리, 인증 시스템, 프로필 관리 기능 등을 구현하면서  MyBatis를 활용한 DB 이용, JWT 이용 방법, 파일 업로드 같은 백엔드 기능 부분을 구현하는 경험이 값진 프로젝트.

JWT 토큰 만료시간, JWT BlackList 등을 구현하지 못한 아쉬움.
여러가지 해커 공격에 여전히 취약한 것에 대한 아쉬움

이번 프로젝트를 통해 풀스택의 마인드를 가진 프론트엔드 개발자가 왜 필요한지 경험할 수 있었음.
이를 통해 앞으로도 지향하는 개발자의 목표를 정할 수 있는 계기가 됨.

무엇보다 좋은 팀원과 함께할 수 있어서 영광이었음.

seonghyun :
평소 부족하다고 느꼈던 것들을 이번 프로젝트를 통해서 완벽히 채웠다고는 못하지만 내실이 쌓여가는 느낌을 받았고 코드를 작성하는 스타일이 다르다본니 다양한 방식으로도 구현이 가능하다는걸 느낄 수 있었던 의미있는 프로젝트.

성능 향상 및 보안성 향상 관점에서 접근 자체가 어려웠으며 미흡하다고 스스로가 느껴졌던 것과 구현하지 못했던 기능들이 있어서 아쉬움.

프로젝트를 진행하며 느꼈던 것들을 가지고 주눅들지 않으며 잘 해야겠다는 각오가 생김.


프로젝트 결과물
https://youtu.be/a5jftCSjDkA
