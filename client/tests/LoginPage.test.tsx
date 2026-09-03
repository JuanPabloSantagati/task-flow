import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import LoginPage from "../src/pages/LoginPage.js";
import { AuthProvider } from "../src/context/AuthContext.js";
import { LanguageProvider } from "../src/context/LanguageContext.js";

vi.stubGlobal("fetch", vi.fn(async () =>
  new Response(JSON.stringify({ accessToken: "t", user: { id: "1", email: "a@b.com", name: "A" } }), {
    status: 200,
  })
));

describe("LoginPage", () => {
  it("submits email and password", async () => {
    render(
      <MemoryRouter>
        <LanguageProvider>
          <AuthProvider>
            <LoginPage />
          </AuthProvider>
        </LanguageProvider>
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "a@b.com" } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "password123" } });
    fireEvent.click(screen.getByRole("button", { name: /log in/i }));

    await waitFor(() => expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/auth/login"),
      expect.objectContaining({ method: "POST" })
    ));
  });
});
