document.addEventListener("DOMContentLoaded", async function () {
    await fetchUserProfile();


    const socialInputs = document.getElementById("socialInputs");
    if (!socialInputs) {
        console.error("🚨 socialInputs 요소가 존재하지 않습니다!");
    } else {
        console.log("✅ socialInputs 요소가 정상적으로 로드되었습니다.");
    }


    //모든 모달 숨기기
    document.querySelectorAll(".modal").forEach(modal => {
        modal.classList.add("hidden");
        modal.style.display = "none";
    });


    
    document.addEventListener("click", function (event) {
        if (event.target.classList.contains("edit-btn")) {
            const target = event.target.dataset.target;
            toggleEditMode(target, event.target);
        }

        if (event.target.classList.contains("save-btn")) {
            const target = event.target.dataset.target;
            saveProfileUpdate(target, event.target);
        }

        if (event.target.id === "editSocialInfo") {
            showSocialInputs();
        }

        if (event.target.id === "saveSocialInfo") {
            saveSocialInfo();
        }
    });

    document.getElementById("password-confirm-btn").addEventListener("click", confirmPasswordForEmailChange);
    document.getElementById("password-change-btn").addEventListener("click", changePassword);
});


// 프로필 정보 불러오기
async function fetchUserProfile() {
    const token = localStorage.getItem("jwtToken")?.replace(/\"/g, "").trim();

    if (!token) {
        alert("로그인이 필요합니다.");
        window.location.href = "/login.html";
        return;
    }

    try {
        const response = await fetch("http://localhost:8080/api/members/profile", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) throw new Error("사용자 정보를 불러오는 데 실패했습니다.");

        const user = await response.json();
        localStorage.setItem("email", user.email);  // ✅ 이메일 저장 추가
        updateProfileUI(user);
    } catch (error) {
        console.error("프로필 로드 오류:", error);
        alert("프로필 정보를 불러올 수 없습니다.");
    }
}


// 프로필 UI 업데이트
function updateProfileUI(user) {
    if (!user) {
        console.error("서버에서 받은 사용자 데이터가 없습니다.");
        return;
    }

    document.getElementById("username").textContent = user.username;
    document.getElementById("edit-username").value = user.username;
    document.getElementById("email").textContent = user.email;
    document.getElementById("edit-email").value = user.email;
    document.getElementById("bio").textContent = user.bio || "안녕하세요!";
    document.getElementById("edit-bio").value = user.bio || "안녕하세요!";

    if (user.profileImage) {
        document.getElementById("profileImage").src = user.profileImage;
    }

    document.getElementById("blogTitle").textContent = `${user.username} .log`;
}

// 편집 모드 토글
function toggleEditMode(target, button) {
    console.log("토글 대상:", target);

    if (target === "email") {
        showPasswordConfirmModal();
        return;
    }

    if (target === "password") {
        showPasswordChangeModal();
        return;
    }

    const textElement = document.getElementById(target);
    const inputElement = document.getElementById(`edit-${target}`);
    const saveButton = document.querySelector(`.save-btn[data-target="${target}"]`);

    if (!textElement || !inputElement || !saveButton) {
        console.error("요소를 찾을 수 없음:", target);
        return;
    }

    textElement.classList.add("hidden");
    inputElement.classList.remove("hidden");
    saveButton.classList.remove("hidden");
    button.classList.add("hidden");
}

// 모달 열기/닫기 함수
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) {
        console.error(`🚨 모달을 찾을 수 없음: ${modalId}`);
        return;
    }
    modal.classList.remove("hidden");
    modal.style.display = "flex";  // 모달을 보이도록 설정
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) {
        console.error(`🚨 모달을 찾을 수 없음: ${modalId}`);
        return;
    }
    modal.classList.add("hidden");
    modal.style.display = "none";  // 모달을 숨김
}

// 이메일 변경 시 비밀번호 확인 모달 표시
function showPasswordConfirmModal() {
    openModal("password-confirm-modal");
}

document.getElementById("password-cancel-btn").addEventListener("click", function () {
    closeModal("password-confirm-modal");
});

// 비밀번호 변경 모달 표시
function showPasswordChangeModal() {
    openModal("password-change-modal");
}

document.getElementById("password-change-cancel-btn").addEventListener("click", function () {
    closeModal("password-change-modal");
});

// 비밀번호 확인 후 이메일 변경 실행
async function confirmPasswordForEmailChange() {
    const currentPassword = document.getElementById("password-confirm-input").value.trim();
    
    if (!currentPassword) {
        alert("비밀번호를 입력해주세요.");
        return;
    }

    try {
        const token = localStorage.getItem("jwtToken")?.replace(/\"/g, "").trim();
        const email = localStorage.getItem("email");

        const response = await fetch("http://localhost:8080/api/members/verify-password", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email: email, currentPassword: currentPassword })
        });

        const result = await response.text();

        if (!response.ok) {
            alert("비밀번호가 올바르지 않습니다.");
            return;
        }

        // 비밀번호가 맞으면 바로 이메일 변경 UI 활성화
        const emailTextElement = document.getElementById("email");
        const emailInputElement = document.getElementById("edit-email");
        const saveButton = document.querySelector(".save-btn[data-target='email']");
        const editButton = document.querySelector(".edit-btn[data-target='email']");

        emailTextElement.classList.add("hidden");
        emailInputElement.classList.remove("hidden");
        saveButton.classList.remove("hidden");
        editButton.classList.add("hidden");

        emailInputElement.focus();
        closeModal("password-confirm-modal");

        // 이메일 변경 버튼 클릭 시 비밀번호 포함하여 업데이트 요청
        saveButton.addEventListener("click", function () {
            saveProfileUpdate("email", saveButton, currentPassword);
        });

    } catch (error) {
        console.error("비밀번호 검증 오류:", error);
        alert("비밀번호 검증에 실패했습니다.");
    }
}

function showSocialInputs() {
    const socialInfoText = document.getElementById("socialInfoText");
    const socialInputs = document.getElementById("socialInputs");

    // 요소가 없으면 콘솔 오류 방지
    if (!socialInfoText || !socialInputs) {
        console.error("🚨 socialInfoText 또는 socialInputs 요소를 찾을 수 없습니다.");
        return;
    }

    // 기존 텍스트 숨기고 입력창 보이기
    socialInfoText.classList.add("hidden");
    socialInputs.innerHTML = `
        <input type="text" id="edit-github" placeholder="Github 계정">
        <input type="text" id="edit-twitter" placeholder="Twitter 계정">
        <input type="text" id="edit-website" placeholder="Website">
        <button id="saveSocialInfo">저장</button>
    `;
    
    // 입력 필드 보이기
    socialInputs.classList.remove("hidden");

    // 저장 버튼 이벤트 리스너 추가 (동적 추가된 요소 처리)
    document.getElementById("saveSocialInfo").addEventListener("click", saveSocialInfo);
}


function saveSocialInfo() {
    const token = localStorage.getItem("jwtToken")?.replace(/\"/g, "").trim();
    const email = localStorage.getItem("email");

    if (!token || !email) {
        alert("로그인이 필요합니다.");
        window.location.href = "/login.html";
        return;
    }

    const github = document.getElementById("edit-github")?.value.trim() || "";
    const twitter = document.getElementById("edit-twitter")?.value.trim() || "";
    const website = document.getElementById("edit-website")?.value.trim() || "";

    const updatedData = { email, github, twitter, website };

    fetch("http://localhost:8080/api/members/update", {
        method: "PUT",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedData)
    })
    .then(response => {
        if (!response.ok) throw new Error("소셜 정보 업데이트 실패");
        return response.text();
    })
    .then(data => {
        alert("소셜 정보가 성공적으로 업데이트되었습니다.");

        document.getElementById("socialInfoText").innerHTML = `
            <p>Github: ${github || "없음"}</p>
            <p>Twitter: ${twitter || "없음"}</p>
            <p>Website: ${website || "없음"}</p>
            <button id="editSocialInfo">수정</button>
        `;

        document.getElementById("socialInputs").classList.add("hidden");
        document.getElementById("socialInfoText").classList.remove("hidden");

        document.getElementById("editSocialInfo").addEventListener("click", showSocialInputs);
    })
    .catch(error => {
        console.error("❌ 소셜 정보 업데이트 오류:", error);
        alert("업데이트 실패: " + error.message);
    });
}




// 비밀번호 변경 실행




// 프로필 업데이트 (비밀번호 변경 지원)
async function saveProfileUpdate(field, button, currentPassword = null) {
    const token = localStorage.getItem("jwtToken")?.replace(/\"/g, "").trim();
    const inputElement = document.getElementById(`edit-${field}`);
    const value = inputElement ? inputElement.value.trim() : null;
    const email = localStorage.getItem("email");

    if (!token) {
        alert("로그인이 필요합니다.");
        window.location.href = "/login.html";
        return;
    }

    if (!email) {
        alert("사용자 이메일을 찾을 수 없습니다.");
        return;
    }

    console.log("🔍 업데이트 요청 데이터:", { email, field, value, currentPassword });

    let apiUrl = "http://localhost:8080/api/members/update";
    let updatedData = { email: email, [field]: value };

    if (field === "email") {
        apiUrl = "http://localhost:8080/api/members/update-email";
        updatedData = {
            email: email,
            newEmail: value,
            currentPassword: document.getElementById("password-confirm-input").value.trim(),
        };
    }

    console.log("🔍 업데이트 요청 데이터:", updatedData);

    try {
        const response = await fetch(apiUrl, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updatedData)
        });

        if (!response.ok) throw new Error(await response.text());

        alert("업데이트 성공", await response.text());

        if (field === "email") {
            localStorage.setItem("email", value);
        }

    } catch (error) {
        console.error("업데이트 오류:", error);
        alert("업데이트 실패: " + error.message);
    }
}

async function changePassword() {
    const currentPassword = document.getElementById("current-password").value.trim();
    const newPassword = document.getElementById("new-password").value.trim();
    const confirmNewPassword = document.getElementById("confirm-new-password").value.trim();

    if (!currentPassword || !newPassword || !confirmNewPassword) {
        alert("모든 필드를 입력해주세요.");
        return;
    }

    if (newPassword !== confirmNewPassword) {
        alert("새 비밀번호가 일치하지 않습니다.");
        return;
    }

    await savePasswordUpdate(currentPassword, newPassword);
}

async function savePasswordUpdate(currentPassword, newPassword) {
    const token = localStorage.getItem("jwtToken")?.replace(/\"/g, "").trim();

    if (!token) {
        alert("로그인이 필요합니다.");
        window.location.href = "/login.html";
        return;
    }

    console.log("비밀번호 변경 요청 데이터:", { currentPassword, newPassword });

    const apiUrl = "http://localhost:8080/api/members/change-password"; 
    const updatedData = {
        currentPassword: currentPassword,
        newPassword: newPassword
    };

    try {
        const response = await fetch(apiUrl, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updatedData)
        });

        if (!response.ok) throw new Error(await response.text());

        alert("비밀번호 변경 성공");
        window.location.reload();
    } catch (error) {
        console.error("비밀번호 변경 오류:", error);
        alert("비밀번호 변경 실패: " + error.message);
    }
}



