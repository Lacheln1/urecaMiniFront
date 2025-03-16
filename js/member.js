document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("signupBtn").addEventListener("click", registerMember);
    document.getElementById("loginBtn").addEventListener("click", loginMember);

    checkLoginStatus();

});

async function registerMember() {
    const name = document.getElementById("name").value;
    const nickname = document.getElementById("nickname").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("pwd").value;

    if (!name || !nickname || !email || !password) {
        alert("모든 필드를 입력해주세요.");
        return;
    }

    if (!isValidPassword(password)) {
        alert("비밀번호는 최소 8자 이상, 대문자 1개 포함해야 합니다.");
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

        if (response.status === 200) {
            alert("로그인 성공!");
            localStorage.setItem("jwtToken", JSON.stringify(response.data.token));
            localStorage.setItem("email", response.data.email);
            localStorage.setItem("username", response.data.username);

            updateUIAfterLogin(response.data.username);
            closeModal("#loginModal");

        } else {
            alert("로그인 실패");
        }
    } catch (error) {
        alert("로그인 실패: " + error.response?.data || "서버 오류");
    }
}

function checkLoginStatus() {
    const token = JSON.parse(localStorage.getItem("jwtToken")); //JSON.parse() 적용
    const username = localStorage.getItem("username");

    console.log("로그인 상태 확인 - token:", token, "username:", username);

    if (token && email) {
        updateUIAfterLogin(username);
    }
}



function updateUIAfterLogin(username) {
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
        </ul>
    `;

    authContainer.appendChild(userDropdown);

    // 로그아웃 버튼 이벤트 추가
    document.getElementById("logoutBtn").addEventListener("click", logoutMember);
}



async function logoutMember() {
    const email = localStorage.getItem("email");

    try {
        await axios.post("http://localhost:8080/api/members/logout", { email });

        // 로컬 스토리지에서 정보 삭제
        localStorage.removeItem("jwtToken");
        localStorage.removeItem("email");
        localStorage.removeItem("username");

        //  UI 변경 (다시 로그인 버튼으로 복구)
        restoreLoginButton();
        alert("로그아웃 되었습니다.");

        removeDarkOverlay();

    } catch (error) {
        console.error("로그아웃 오류:", error);
        alert("로그아웃 실패: 서버 오류");
    }
}

//다시 로그인버튼 만들기기
function restoreLoginButton() {
    const authContainer = document.getElementById("authContainer");

    authContainer.innerHTML = `
        <button type="button" class="btn btn-primary login-btn" data-bs-toggle="modal" data-bs-target="#loginModal">
            로그인
        </button>
    `;
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