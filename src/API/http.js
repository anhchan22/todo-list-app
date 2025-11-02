const API_BASE = ""; // Dùng proxy của Vite, không cần domain

function getToken() {
    return localStorage.getItem("authToken"); 
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

    if (!res.ok) {
        console.error('HTTP error:', {
            status: res.status,
            statusText: res.statusText,
            responseText: text,
            parsedData: data
        });
        throw new Error((data && data.message) || 'Uncategorized error');
    }
    return data?.result ?? data;
}