import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest, event: NextFetchEvent) {
    // Basic認証をスキップするパス
    if (request.nextUrl.pathname.startsWith('/api/login')) {
        return NextResponse.next();
    }

    const basicAuth = request.headers.get('authorization');

    const USERNAME = process.env.BASIC_AUTH_USER; // ここに基本認証のユーザー名を設定
    const PASSWORD = process.env.BASIC_AUTH_PASSWORD; // ここに基本認証のパスワードを設定

    if (basicAuth) {
        const auth = basicAuth.split(' ')[1];
        const [username, password] = Buffer.from(auth, 'base64').toString().split(':');

        if (username === USERNAME && password === PASSWORD) {
            // 認証成功時はリクエストを許可
            return NextResponse.next();
        }
    }

    // 認証失敗時はBasic認証のダイアログを表示
    return new NextResponse('認証が必要です', {
        status: 401,
        headers: {
            'WWW-Authenticate': 'Basic realm="Secure Area"',
        },
    });
}
