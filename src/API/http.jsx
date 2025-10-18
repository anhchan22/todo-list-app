const API_BASE = ""; // Đổi thành domain API của bạn

function getToken() {
    return localStorage.getItem("token");
}

export async function http(path, init = {}) {
    // Tạo headers
    const headers = new Headers(init.headers);
    headers.set("Content-Type", "application/json");

    // Lấy token và thêm vào header nếu có
    const token = getToken();
    if (token) headers.set("Authorization", `Bearer ${token}`);

    // Gửi request
    const res = await fetch(API_BASE + path, { ...init, headers });
    const text = await res.text();
    let data = null;
    try {
        data = text ? JSON.parse(text) : null;
    } catch {
        data = text;
    }

    if (!res.ok) throw new Error((data && data.message) || res.statusText);
    return data?.result ?? data;
}