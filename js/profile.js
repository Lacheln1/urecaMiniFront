document.addEventListener("DOMContentLoaded", async function () {
    await fetchUserProfile();


    //모든 모달 숨기기
    document.querySelectorAll(".modal").forEach(modal => {
        modal.classList.add("hidden");
        modal.style.display = "none";
    });


    
    document.addEventListener("click", function (event) {
        const target = event.target.dataset.target;

        if (event.target.classList.contains("edit-btn")) {
            toggleEditMode(target, event.target);
        }

        if (event.target.id === "editSocialInfo") {
            showSocialInputs();
        }

        if (event.target.id === "cancelSocialInfo") {
            cancelSocialEdit();
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
        localStorage.setItem("email", user.email);  // 이메일 저장 추가
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

    updateProfileImage(user.profileImage);
    document.getElementById("blogTitle").textContent = `${user.username} .log`;
}

// 편집 모드 토글
function toggleEditMode(target, button) {
    console.log("토글 대상:", target);

    const textElement = document.getElementById(target);
    const inputElement = document.getElementById(`edit-${target}`);
    const saveButton = document.querySelector(`.save-btn[data-target="${target}"]`);

    if (!textElement || !inputElement || !saveButton) {
        console.error("요소를 찾을 수 없음:", target);
        return;
    }

    // 편집 모드 전환
    if (textElement.classList.contains("hidden")) {
        // 편집 취소 (input 숨기고 기존 텍스트 표시)
        textElement.classList.remove("hidden");
        inputElement.classList.add("hidden");
        saveButton.classList.add("hidden");
        button.textContent = "수정";
    } else {
        // 수정 모드 (기존 텍스트 숨기고 input 보이기)
        textElement.classList.add("hidden");
        inputElement.classList.remove("hidden");
        saveButton.classList.remove("hidden");
        button.textContent = "취소";
    }

    // 이메일 수정 시 비밀번호 확인 모달 열기
    if (target === "email") {
        showPasswordConfirmModal();
        return;
    }

    // 비밀번호 변경 모달
    if (target === "password") {
        showPasswordChangeModal();
        return;
    }

    if (target === "socialInfo") {
        showSocialInputs();
        return;
    }
}


document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".save-btn").forEach(button => {
        button.addEventListener("click", function (event) {
            const target = event.target.dataset.target;
            saveProfileUpdate(target, event.target);
        });
    });
});



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

document.getElementById("password-confirm-cancel-btn").addEventListener("click", function () {
    closeModal("password-confirm-modal");
});

// 비밀번호 변경 모달 표시
function showPasswordChangeModal() {
    openModal("password-change-modal");
}

    document.getElementById("password-cancel-btn").addEventListener("click", function () {
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

    // 기존 텍스트 숨기기
    socialInfoText.classList.add("hidden");

    // 입력 필드 HTML 추가
    socialInputs.innerHTML = `
        <input type="text" id="edit-github" placeholder="Github 계정">
        <input type="text" id="edit-twitter" placeholder="Twitter 계정">
        <input type="text" id="edit-website" placeholder="Website">
        <div class="button-group">
            <button id="cancelSocialInfo" class="edit-btn">취소</button>
            <button id="saveSocialInfo" class="save-btn">저장</button>
        </div>
        
    `;

    // 입력 필드 보이기
    socialInputs.classList.remove("hidden");
}

function cancelSocialEdit() {
    document.getElementById("socialInputs").classList.add("hidden");
    document.getElementById("socialInfoText").classList.remove("hidden");
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
            <button id="editSocialInfo" class="edit-btn">수정</button>
        `;

        document.getElementById("socialInputs").classList.add("hidden");
        document.getElementById("socialInfoText").classList.remove("hidden");
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
    const textElement = document.getElementById(field);
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

    const value = inputElement ? inputElement.value.trim() : null;

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

        // 🔹 성공적으로 업데이트되면 UI를 원래대로 변경
        textElement.textContent = value; // 새로운 값으로 업데이트
        inputElement.classList.add("hidden"); // input 숨기기
        textElement.classList.remove("hidden"); // 텍스트 보이기

        const saveButton = document.querySelector(`.save-btn[data-target="${field}"]`);
        const editButton = document.querySelector(`.edit-btn[data-target="${field}"]`);

        saveButton.classList.add("hidden"); // 저장 버튼 숨기기
        editButton.classList.remove("hidden"); // 수정 버튼 다시 보이게 하기

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



function updateProfileImage(profileImageUrl) {
    const profileImage = document.getElementById("profileImage");

    if (!profileImageUrl || profileImageUrl.trim() === "") {
        console.warn("🚨 프로필 이미지가 없습니다. 기본 이미지로 설정.");
        profileImage.src = "http://localhost:8080/uploads/no-intro.png"; // 기본 이미지
        return;
    }

    // 서버에서 받은 URL이 상대 경로인지 확인 후 절대 경로로 변환
    let imageUrl = profileImageUrl.startsWith("/uploads/")
        ? `http://localhost:8080${profileImageUrl}`
        : `http://localhost:8080/uploads/${profileImageUrl}`;

    // 캐시 문제 방지 (새로운 이미지 강제 로드)
    const timestamp = new Date().getTime();
    profileImage.src = `${imageUrl}?t=${timestamp}`;

    console.log("프로필 이미지 업데이트됨:", profileImage.src);
}





document.getElementById("uploadImgBtn").addEventListener("click", function () {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";

    fileInput.addEventListener("change", async function () {
        const file = fileInput.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        const token = localStorage.getItem("jwtToken")?.replace(/\"/g, "").trim();

        if (!token) {
            alert("로그인이 필요합니다.");
            return;
        }

        try {
            const response = await fetch("http://localhost:8080/api/members/upload-profile-image", {  
                method: "POST",
                headers: { "Authorization": `Bearer ${token}` },
                body: formData
            });

            if (!response.ok) throw new Error("이미지 업로드 실패");

            const { profileImageUrl } = await response.json();
            updateProfileImage(profileImageUrl);  //수정된 함수 호출

            alert("이미지 업로드 완료!");

        } catch (error) {
            console.error("이미지 업로드 오류:", error);
            alert("이미지 업로드 실패!");
        }
    });

    fileInput.click();
});



document.getElementById("removeImgBtn").addEventListener("click", async function () {
    const token = localStorage.getItem("jwtToken")?.replace(/\"/g, "").trim();

    if (!token) {
        alert("로그인이 필요합니다.");
        return;
    }

    try {
        const response = await fetch("http://localhost:8080/api/members/remove-profile-image", {
            method: "PUT",
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!response.ok) throw new Error("프로필 이미지 제거 실패!");

        alert("프로필 이미지가 제거되었습니다.");

        // 기본 프로필 이미지로 변경
        updateProfileImage("/uploads/no-intro.png");

    } catch (error) {
        console.error("프로필 이미지 제거 오류:", error);
        alert("이미지 제거 실패!");
    }
});
