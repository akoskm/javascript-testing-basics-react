import userEvent from "@testing-library/user-event";
import { render, screen, waitFor } from "@testing-library/react";
import App from "./App";

test("renders the form", () => {
  render(<App />);
  const linkElement = screen.getByText(/Welcome/i);
  expect(linkElement).toBeInTheDocument();
});

describe("form submission", () => {
  test("validates the email field", () => {
    render(<App />);
    expect(screen.queryByText(/Email is required/i)).not.toBeInTheDocument();

    const submitButton = screen.getByText(/Login/i);
    submitButton.click();

    expect(screen.queryByText(/Email is required/i)).toBeInTheDocument();
  });

  test("login successful", async () => {
    window.fetch = jest.fn().mockResolvedValue({
      json: () => ({
        success: true,
      }),
    });

    render(<App />);

    // fill the form
    const emailInput = screen.getByPlaceholderText(/Email/i);
    userEvent.type(emailInput, "user@example.com");

    const passwordInput = screen.getByPlaceholderText(/Password/i);
    userEvent.type(passwordInput, "abc123");

    const submitButton = screen.getByText(/Login/i);
    submitButton.click();

    await waitFor(() =>
      expect(screen.queryByText(/Login successful!/i)).toBeInTheDocument()
    );
    expect(window.fetch).toHaveBeenCalledTimes(1);
    expect(window.fetch).toHaveBeenCalledWith(
      "https://jsonplaceholder.typicode.com/posts",
      {
        method: "POST",
        body: JSON.stringify({
          username: "user@example.com",
          password: "abc123",
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      }
    );
  });

  describe("login failed", () => {
    test("failure message", async () => {
      // stub fetch
      window.fetch = jest.fn().mockResolvedValue({
        json: () => ({
          success: false,
        }),
      });

      render(<App />);

      const emailInput = screen.getByPlaceholderText(/Email/i);
      userEvent.type(emailInput, "user@example.com");

      const passwordInput = screen.getByPlaceholderText(/Password/i);
      userEvent.type(passwordInput, "abc123");

      const submitButton = screen.getByText(/Login/i);
      submitButton.click();

      await waitFor(() =>
        expect(screen.queryByText(/Login failed./i)).toBeInTheDocument()
      );
    });
  });
});
