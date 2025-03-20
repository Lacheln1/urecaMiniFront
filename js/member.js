document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("signupBtn").addEventListener("click", registerMember);
    document.getElementById("loginBtn").addEventListener("click", loginMember);

    checkLoginStatus();

});


console.log("✅ 최종 응답 데이터:", responseData);

function parseJwt(token) {
    if (!token) {
        console.error("🚨 JWT 토큰이 없음!");
        return null;
    }
    try {
        const base64Url = token.split(".")[1];  // JWT의 Payload 부분
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");  // Base64 URL 수정
        const decodedData = JSON.parse(atob(base64)); // Base64 디코딩 후 JSON 변환
        return decodedData;
    } catch (e) {
        console.error("🚨 JWT 디코딩 오류:", e, token);
        return null;
    }
}


async function registerMember() {
    const name = document.getElementById("name").value;
    const nickname = document.getElementById("nickname").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("pwd").value;
    const checkPassword = document.getElementById("checkpwd").value;

    if (!name || !nickname || !email || !password) {
        alert("모든 필드를 입력해주세요.");
        return;
    }

    if (!isValidPassword(password)) {
        alert("비밀번호는 최소 8자 이상, 대문자 1개 포함해야 합니다.");
        return;
    }

    if(password!=checkPassword){
        alert("비밀번호가 일치하지 않습니다.");
        return;
    }

    const data = { 
        username : nickname,
        name, 
        email, 
        password
    };

    try {
        const response = await axios.post("http://localhost:8080/api/members/register", data, {
            headers: { "Content-Type": "application/json" }
        });

        console.log("회원가입 응답:", response);

        if (response.status === 200) {
            alert("회원가입 성공!");

            closeModal("#signupModal");

        } else {
            alert("회원가입 실패: " + JSON.stringify(response.data));
        }
    } catch (error) {
        console.error("회원가입 오류:", error);
        alert("회원가입 실패: " + (error.response?.data?.message || "서버 오류"));
    }
}

function isValidPassword(password) {
    return password.length >= 8 && /[A-Z]/.test(password);
}


document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("loginBtn").addEventListener("click", login);
});



async function loginMember() {
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPwd").value;

    try {
        const response = await axios.post("http://localhost:8080/api/members/login", { email, password });

        console.log("✅ 로그인 성공! 서버 응답:", response);  

        if (response.status === 200 && response.data.token) {
            alert("로그인 성공!");
            localStorage.setItem("jwtToken", response.data.token.replace(/\"/g, "").trim());
            localStorage.setItem("email", response.data.email);
            localStorage.setItem("username", response.data.username);

            updateUIAfterLogin(response.data.username);
        } else {
            alert("로그인 실패: 이메일 또는 비밀번호가 올바르지 않습니다.");
        }
    } catch (error) {
        console.error("로그인 오류:", error);
        alert("로그인 실패: 서버 오류");
    }
}




function checkLoginStatus() {
    const token = localStorage.getItem("jwtToken");
    const email = localStorage.getItem("email");  // email 가져오기 추가
    const username = localStorage.getItem("username");

    console.log("로그인 상태 확인 - token:", token, "email:", email, "username:", username);

    if (token && email && username) {
        updateUIAfterLogin(username);
    } else {
        restoreLoginButton(); // 🔹 로그아웃 상태일 경우 로그인 버튼 복원
    }
}




function updateUIAfterLogin(username) {
    const newPostBtnLayout = document.getElementById("postBtnLayout");
    
    const authContainer = document.getElementById("authContainer");
    authContainer.innerHTML = "";

    const userDropdown = document.createElement("div");
    userDropdown.classList.add("dropdown");

    userDropdown.innerHTML = `
        <button class="btn btn-primary dropdown-toggle" type="button" id="userDropdownBtn" data-bs-toggle="dropdown" aria-expanded="false">
            ${username}
        </button>
        <ul class="dropdown-menu" aria-labelledby="userDropdownBtn">
            <li><button class="dropdown-item" id="logoutBtn">로그아웃</button></li>
            <li><button class="dropdown-item" id="profileBtn">설정</button></li>
        </ul>
    `;
    authContainer.appendChild(userDropdown);
    newPostBtnLayout.innerHTML=`<button id ="newPostBtn" class = "btn" style="border:1px solid #000">새 글 작성</button>`;
    document.getElementById("newPostBtn").addEventListener("click", () => {
        window.location.href = "../writePost.html";
    });

    

    // 로그아웃 버튼 이벤트 추가
    setTimeout(() => {
        document.getElementById("logoutBtn").addEventListener("click", logoutMember);
        document.getElementById("profileBtn").addEventListener("click", function () {
            window.location.href = "profile.html";
        });
    }, 500);
}



async function logoutMember() {
    console.log("🚀 로그아웃 버튼 클릭됨");
    const email = localStorage.getItem("email");

    try {
        const response = await axios.post("http://localhost:8080/api/members/logout", { email });

        console.log("✅ 서버 응답:", response); // 응답 전체 확인
        console.log("✅ 응답 데이터:", response.data); // 응답 내용 확인

        if (typeof response.data === "string") {
            console.error("❌ 서버 응답이 JSON이 아님!:", response.data);
            return;
        }

        if (response.data && response.data.message === "로그아웃 성공!") {
            console.log("🚀 로그아웃 성공!");
            localStorage.removeItem("jwtToken");
            localStorage.removeItem("email");
            localStorage.removeItem("username");

            restoreLoginButton();
            alert("로그아웃 되었습니다.");
            removeDarkOverlay();
            window.location.reload();
        } else {
            console.error("❌ 로그아웃 실패:", response.data);
            alert("로그아웃 실패: " + response.data);
        }
    } catch (error) {
        console.error("🚨 로그아웃 오류:", error);
        alert("로그아웃 실패: 서버 오류");
    }
}





//다시 로그인버튼 만들기
function restoreLoginButton() {
    const authContainer = document.getElementById("authContainer");

    if (!authContainer) {
        console.error("🚨 authContainer를 찾을 수 없습니다.");
        return;
    }

    authContainer.innerHTML = `
        <button type="button" class="btn btn-primary login-btn" data-bs-toggle="modal" data-bs-target="#loginModal">
            로그인
        </button>
    `;

    // 🔹 로그인 버튼 다시 등록
    document.getElementById("loginBtn").addEventListener("click", loginMember);
}


function closeModal(modalId) {
    const modal = document.querySelector(modalId);
    const modalBackdrop = document.querySelector(".modal-backdrop");

    if (modal) {
        modal.classList.remove("show");
        modal.style.display = "none";
    }
    
    if (modalBackdrop) {
        modalBackdrop.remove();
    }

    document.body.classList.remove("modal-open"); // 모달 열릴 때 추가된 클래스 제거
    document.body.style.overflow = ""; // 스크롤 복원
}

// 로그아웃 후 화면 비활성화 해결 (모달 오버레이 제거)
function removeDarkOverlay() {
    document.body.classList.remove("modal-open");
    document.querySelectorAll(".modal-backdrop").forEach(el => el.remove());
    document.body.style.overflow = ""; // 스크롤 복원
}




async function checkTokenExpiration() {
    const token = localStorage.getItem("jwtToken");

    if (!token) {
        console.log("🔴 토큰 없음 → 로그인 필요");
        logoutAndRedirect();
        return;
    }

    // 🛑 JWT 토큰 디코딩하여 만료 시간 확인
    const decodedToken = parseJwt(token);
    if (!decodedToken || !decodedToken.exp) {
        console.error("🚨 토큰 디코딩 실패 또는 만료 정보 없음 → 로그아웃 실행");
        logoutAndRedirect();
        return;
    }

    const currentTime = Math.floor(Date.now() / 1000);
    console.log(`🔍 현재 시간: ${new Date(currentTime * 1000)}`);
    console.log(`🔍 토큰 만료 시간: ${new Date(decodedToken.exp * 1000)}`);

    if (decodedToken.exp < currentTime) {
        console.log("⏳ 토큰 만료됨 → 로그아웃 실행");
        logoutAndRedirect();
    } else {
        console.log("✅ 토큰 아직 유효");
    }
}

// 🚀 10초마다 실행하여 토큰 만료 확인
setInterval(checkTokenExpiration, 10000);







function logoutAndRedirect() {
    if (!localStorage.getItem("jwtToken")) return; // 🔥 이미 로그아웃된 경우 실행 X

    alert("세션이 만료되었습니다. 다시 로그인해주세요.");
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("email");
    localStorage.removeItem("username");

    console.log("🚀 자동 로그아웃 실행됨");

    // 🔥 무한 새로고침 방지: 특정 횟수 이상 이동하지 않도록 설정
    if (!sessionStorage.getItem("redirected")) {
        sessionStorage.setItem("redirected", "true");
        window.location.href = "index.html"; 
    } else {
        console.log("🚀 이미 리디렉트됨, 추가 이동 방지");
    }
}



async function refreshAuthToken() {
    const token = localStorage.getItem("jwtToken");

    if (!token) return;

    try {
        const response = await fetch("http://localhost:8080/api/members/refresh-token", {
            method: "POST",
            headers: { "Authorization": `Bearer ${token.replace(/\"/g, "").trim()}` }
        });

        if (!response.ok) {
            console.log("토큰 갱신 실패 → 로그아웃 처리");
            localStorage.removeItem("jwtToken");
            localStorage.removeItem("email");
            localStorage.removeItem("username");
            window.location.href = "index.html"; 
            return;
        }

        const data = await response.json();  // JSON으로 파싱
        console.log("🔄 새로운 토큰 발급 완료:", data.newToken);
        localStorage.setItem("jwtToken", JSON.stringify(data.newToken));

    } catch (error) {
        console.error("🚨 토큰 갱신 중 오류 발생:", error);
        window.location.href = "index.html"; 
    }
}


async function refreshTokenIfNeeded() {
    const token = localStorage.getItem("jwtToken");

    if (!token) {
        console.log("🔴 토큰 없음 → 로그인 필요");
        return;
    }

    // 🛑 토큰이 만료된 경우 갱신하지 않고 즉시 로그아웃
    const decodedToken = parseJwt(token);
    const currentTime = Math.floor(Date.now() / 1000);
    if (decodedToken.exp < currentTime) {
        console.log("⏳ 토큰이 만료되어 갱신하지 않고 로그아웃 실행");
        logoutAndRedirect();
        return;
    }

    console.log(`🔍 남은 시간: ${decodedToken.exp - currentTime}초`);

    if (decodedToken.exp - currentTime < 30) { // 30초 이하일 때만 갱신 시도
        console.log("🔄 토큰 갱신 시작...");

        try {
            const response = await fetch("http://localhost:8080/api/members/refresh-token", {
                method: "POST",
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (!response.ok) {
                console.log("🔴 토큰 갱신 실패 → 로그아웃 처리");
                logoutAndRedirect();
                return;
            }

            const newToken = await response.text();
            console.log("🔄 새로운 토큰 발급 완료:", newToken);
            localStorage.setItem("jwtToken", newToken.trim());
        } catch (error) {
            console.error("🚨 토큰 갱신 중 오류 발생:", error);
            logoutAndRedirect();
        }
    }
}



axios.interceptors.request.use(async function (config) {
    const token = localStorage.getItem("jwtToken");

    // 🔥 토큰이 없는 경우 `refreshTokenIfNeeded()` 실행하지 않음
    if (token) {
        await refreshTokenIfNeeded();
        config.headers.Authorization = `Bearer ${JSON.parse(token)}`;
    }

    return config;
}, function (error) {
    return Promise.reject(error);
});

axios.interceptors.response.use(
    response => response,  // ✅ 응답이 정상인 경우 그대로 반환
    error => {
        if (error.response && error.response.status === 401) {
            console.log("⏳ JWT 토큰이 만료됨 → 자동 로그아웃 실행");

            // ✅ 로컬 스토리지 정보 삭제
            localStorage.removeItem("jwtToken");
            localStorage.removeItem("email");
            localStorage.removeItem("username");

            // ✅ DB에서도 세션 삭제 요청 (백엔드 로그아웃 API 호출)
            axios.post("http://localhost:8080/api/members/logout", { email: localStorage.getItem("email") })
                .then(() => {
                    console.log("✅ DB 로그아웃 완료");
                })
                .catch(err => {
                    console.error("🚨 DB 로그아웃 중 오류 발생:", err);
                });

            // ✅ index.html로 이동
            alert("세션이 만료되었습니다. 다시 로그인해주세요.");
            window.location.href = "index.html";
        }

        return Promise.reject(error);
    }
);



// 10초마다 토큰 만료 여부 확인 (최대 3회만 실행)
let tokenCheckCount = 0;
const maxTokenChecks = 3;

const tokenCheckInterval = setInterval(() => {
    if (tokenCheckCount >= maxTokenChecks) {
        clearInterval(tokenCheckInterval); // 🔥 일정 횟수 후 중단
    } else {
        checkTokenExpiration();
        tokenCheckCount++;
    }
}, 10000);

// 5분마다 토큰 갱신 실행 (30분 지나기 전에 미리 연장)
setInterval(refreshAuthToken, 1000 * 60 * 1);


