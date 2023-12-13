import React from "react";
import { render, fireEvent, screen, act } from "@testing-library/react";
import Home from "../components/home";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";

jest.mock("@auth0/auth0-react");
jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
}));

describe("Home Component Tests", () => {
  const mockLoginWithRedirect = jest.fn();
  const mockNavigate = jest.fn();

  beforeEach(() => {
    useAuth0.mockReturnValue({
      isAuthenticated: false,
      loginWithRedirect: mockLoginWithRedirect,
    });
    useNavigate.mockReturnValue(mockNavigate);
  });

  test("displays Login button when not authenticated", () => {
    render(<Home />);
    expect(screen.getByText("Login")).toBeInTheDocument();
  });

  test("displays Enter App button when authenticated", () => {
    useAuth0.mockReturnValueOnce({
      isAuthenticated: true,
      loginWithRedirect: mockLoginWithRedirect,
    });
    render(<Home />);
    expect(screen.getByText("Enter App")).toBeInTheDocument();
  });

  test("Login button triggers loginWithRedirect", () => {
    render(<Home />);
    fireEvent.click(screen.getByText("Login"));
    expect(mockLoginWithRedirect).toHaveBeenCalled();
  });

  test("Enter App button triggers navigation", () => {
    useAuth0.mockReturnValueOnce({
      isAuthenticated: true,
      loginWithRedirect: mockLoginWithRedirect,
    });
    render(<Home />);
    fireEvent.click(screen.getByText("Enter App"));
    expect(mockNavigate).toHaveBeenCalledWith("/app");
  });

  test("Signup button triggers loginWithRedirect with correct parameters", () => {
    render(<Home />);
    fireEvent.click(screen.getByText("Create Account"));
    expect(mockLoginWithRedirect).toHaveBeenCalledWith({
      screen_hint: "signup",
    });
  });

  test("renders Explore Movies button", () => {
    render(<Home />);
    expect(screen.getByText("View All Movie Reviews")).toBeInTheDocument();
  });

  test("Explore Movies button triggers navigation", () => {
    render(<Home />);
    fireEvent.click(screen.getByText("View All Movie Reviews"));
    expect(mockNavigate).toHaveBeenCalledWith("/movies");
  });
  

  test("renders 'No overall reviews available' when there is no review", () => {
    jest.spyOn(global, "fetch").mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce([]),
    });

    render(<Home />);
    expect(screen.getByText("No overall reviews available. Be the first to write one!")).toBeInTheDocument();
  });

  test("renders Latest Overall Movie Review with existing review", async () => {
    const mockLatestReview = {
      movie: { title: "Sample Movie" },
      content: "Sample review content",
      createdAt: new Date().toISOString(),
    };

    jest.spyOn(global, "fetch").mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce([mockLatestReview]),
    });

    await act(async () => {
      render(<Home />);
    });

    expect(screen.getByText("Latest Overall Movie Review")).toBeInTheDocument();
    expect(screen.getByText(`Movie: ${mockLatestReview.movie.title}`)).toBeInTheDocument();
    expect(screen.getByText(mockLatestReview.content)).toBeInTheDocument();
    expect(screen.getByText(`Created at: ${new Date(mockLatestReview.createdAt).toLocaleString()}`)).toBeInTheDocument();
  });
  
});
