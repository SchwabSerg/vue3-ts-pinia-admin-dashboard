import { http, HttpResponse } from 'msw';

interface LoginRequestBody {
  email: string;
  password: string;
}

export const authHandlers = [
  http.post('/api/auth/login', async ({ request }) => {
    await new Promise<void>((resolve) => setTimeout(resolve, 400));

    const body = (await request.json()) as LoginRequestBody;

    if (body.password !== 'password') {
      return HttpResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    return HttpResponse.json({
      user: {
        id: 'user-001',
        name: 'Admin User',
        email: body.email,
      },
      token: 'fake-jwt-token',
    });
  }),
  http.post('/api/auth/logout', async () => {
    await new Promise<void>((resolve) => setTimeout(resolve, 200));

    return HttpResponse.json({ success: true });
  }),
];
