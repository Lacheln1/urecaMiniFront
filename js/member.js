document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("signupBtn").addEventListener("click", registerMember);
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
