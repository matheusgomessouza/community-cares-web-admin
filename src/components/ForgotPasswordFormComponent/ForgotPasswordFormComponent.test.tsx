import { fireEvent, render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";

import ForgotPasswordFormComponent from "./ForgotPasswordFormComponent";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

function renderComponent() {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: { retry: false },
			mutations: { retry: false },
		},
	});

	return render(
		<QueryClientProvider client={queryClient}>
			<ForgotPasswordFormComponent />
		</QueryClientProvider>,
	);
}

describe("ForgotPasswordFormComponent", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("shows a validation error for an invalid email", async () => {
		renderComponent();

		fireEvent.change(screen.getByLabelText(/email/i), {
			target: { value: "not-an-email" },
		});
		fireEvent.click(
			screen.getByRole("button", { name: /send reset link/i }),
		);

		expect(
			await screen.findByText("Invalid email address"),
		).toBeInTheDocument();
		expect(mockedAxios.post).not.toHaveBeenCalled();
	});

	it("shows the generic message after a successful request", async () => {
		mockedAxios.post.mockResolvedValue({ status: 202, data: {} });
		renderComponent();

		fireEvent.change(screen.getByLabelText(/email/i), {
			target: { value: "Admin@Example.com" },
		});
		fireEvent.click(
			screen.getByRole("button", { name: /send reset link/i }),
		);

		expect(await screen.findByRole("status")).toHaveTextContent(
			"If an account exists for this email, a reset link has been sent.",
		);
		expect(mockedAxios.post).toHaveBeenCalledWith(
			expect.stringContaining("/admin-users/password-reset/request"),
			{ email: "admin@example.com" },
		);
	});

	it("shows a rate limit message when the API returns 429", async () => {
		mockedAxios.post.mockRejectedValue({ response: { status: 429 } });
		renderComponent();

		fireEvent.change(screen.getByLabelText(/email/i), {
			target: { value: "admin@example.com" },
		});
		fireEvent.click(
			screen.getByRole("button", { name: /send reset link/i }),
		);

		expect(await screen.findByRole("alert")).toHaveTextContent(
			"Too many attempts. Try again in a few minutes.",
		);
	});
});
