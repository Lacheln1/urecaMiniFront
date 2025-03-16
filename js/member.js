document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("signupBtn").addEventListener("click", registerMember);
});

async function registerMember() {
    const username = document.getElementById("nickname").value;
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("pwd").value;

    if (!username || !name || !email || !password) {
        alert("모든 필드를 입력해주세요.");
        return;
    }

    const data = { username, name, email, password };

    try {
        const response = await axios.post("http://localhost:8080/api/members/register", data, {
            headers: { "Content-Type": "application/json" }
        });

        console.log(response.data);
        alert("회원가입 성공!");
    } catch (error) {
        console.error("회원가입 오류:", error);
        alert("회원가입 실패: " + (error.response?.data || "서버 오류"));
    }
}
