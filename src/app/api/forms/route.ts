export async function POST(request: Request) {
    try {
        const body = await request.text();
        const response = await fetch(
            "https://script.google.com/macros/s/AKfycbxZG-u152xexVTnwaxJk2Psnq88ADs5K6Zv1P9cZ0dJdvUAlAHeMvN5L-wzc4Od6anFPw/exec",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
                },
                body,
            }
        );

        if (!response.ok) {
            return new Response(
                JSON.stringify({ ok: false, status: response.status }),
                { status: 502, headers: { "Content-Type": "application/json" } }
            );
        }

        return new Response(JSON.stringify({ ok: true }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        return new Response(
            JSON.stringify({ ok: false, error: "proxy_failed" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}
