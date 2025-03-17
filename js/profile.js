document.addEventListener("DOMContentLoaded", function () {

    const editProfileBtn = document.getElementById("editProfileBtn");
    const saveBtn = document.getElementById("saveBtn");
    const editSection = document.querySelector(".edit-section");
    const usernameField = document.getElementById("username");
    const bioField = document.getElementById("bio");
    const editUsername = document.getElementById("editUsername");
    const editBio = document.getElementById("editBio");
    const themeButtons = document.querySelectorAll(".theme-btn");
    const deleteAccountBtn = document.getElementById("deleteAccountBtn");

    // 프로필 수정 버튼 클릭
    editProfileBtn.addEventListener("click", function () {
        editSection.classList.remove("hidden");
        editUsername.value = usernameField.textContent;
        editBio.value = bioField.textContent;
    });

    // 저장 버튼 클릭
    saveBtn.addEventListener("click", function () {
        usernameField.textContent = editUsername.value;
        bioField.textContent = editBio.value;
        editSection.classList.add("hidden");
    });

    // 테마 변경 버튼
    themeButtons.forEach(button => {
        button.addEventListener("click", function () {
            themeButtons.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");

            if (button.classList.contains("dark")) {
                document.body.style.background = "#333";
                document.body.style.color = "#fff";
            } else {
                document.body.style.background = "#f5f5f5";
                document.body.style.color = "#000";
            }
        });
    });

    // 회원 탈퇴 버튼 클릭
    deleteAccountBtn.addEventListener("click", function () {
        if (confirm("정말로 탈퇴하시겠습니까?")) {
            alert("탈퇴가 완료되었습니다.");
            // 실제 회원 탈퇴 API 연동 필요
        }
    });
});
