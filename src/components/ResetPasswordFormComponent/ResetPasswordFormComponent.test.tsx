import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";

import ResetPasswordFormComponent from "./ResetPasswordFormComponent";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockReplace = jest.fn();
let mockSearchParams = new URLSearchParams("token=raw-token");

jest.mock("next/navigation", () => ({
	useRouter: () => ({ replace: mockReplace }),
	useSearchParams: () => mockSearchParams,
}));

function renderComponent() {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: { retry: false },
			mutations: { retry: false },
		},
	});

	return render(
		<QueryClientProvider client={queryClient}>
			<ResetPasswordFormComponent />
		</QueryClientProvider>,
	);
}

describe("ResetPasswordFormComponent", () => {
	beforeEach(() => {
		jest.clearAllMocks();
		mockSearchParams = new URLSearchParams("token=raw-token");
	});

	it("shows an invalid state when the token is missing", () => {
		mockSearchParams = new URLSearchParams();
		renderComponent();

		expect(
			screen.getByText("This link is invalid or expired."),
		).toBeInTheDocument();
		expect(screen.queryByLabelText(/new password/i)).not.toBeInTheDocument();
		expect(mockedAxios.get).not.toHaveBeenCalled();
	});

	it("shows an invalid state when the API rejects the token", async () => {
		mockedAxios.get.mockRejectedValue({ response: { status: 400 } });
		renderComponent();

		expect(
			await screen.findByText("This link is invalid or expired."),
		).toBeInTheDocument();
		expect(screen.queryByLabelText(/new password/i)).not.toBeInTheDocument();
	});

	it("renders the form for a valid token", async () => {
		mockedAxios.get.mockResolvedValue({
			status: 200,
			data: { valid: true, expiresAt: "2026-11-05T12:30:00.000Z" },
		});
		renderComponent();

		expect(await screen.findByLabelText(/new password/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
	});

	it("shows an error when the passwords do not match", async () => {
		mockedAxios.get.mockResolvedValue({
			status: 200,
			data: { valid: true, expiresAt: "2026-11-05T12:30:00.000Z" },
		});
		renderComponent();

		fireEvent.change(await screen.findByLabelText(/new password/i), {
			target: { value: "new-password" },
		});
		fireEvent.change(screen.getByLabelText(/confirm password/i), {
			target: { value: "different-password" },
		});
		fireEvent.click(
			screen.getByRole("button", { name: /set new password/i }),
		);

		expect(await screen.findByText("Passwords don't match")).toBeInTheDocument();
		expect(mockedAxios.post).not.toHaveBeenCalled();
	});

	it("sends the token and the password and redirects on success", async () => {
		mockedAxios.get.mockResolvedValue({
			status: 200,
			data: { valid: true, expiresAt: "2026-11-05T12:30:00.000Z" },
		});
		mockedAxios.post.mockResolvedValue({ status: 200, data: {} });
		renderComponent();

		fireEvent.change(await screen.findByLabelText(/new password/i), {
			target: { value: "new-password" },
		});
		fireEvent.change(screen.getByLabelText(/confirm password/i), {
			target: { value: "new-password" },
		});
		fireEvent.click(
			screen.getByRole("button", { name: /set new password/i }),
		);

		await waitFor(() => {
			expect(mockedAxios.post).toHaveBeenCalledWith(
				expect.stringContaining(
					"/admin-users/password-reset/confirm",
				),
				{ token: "raw-token", password: "new-password" },
			);
		});
		await waitFor(() => {
			expect(mockReplace).toHaveBeenCalledWith("/");
		});
	});
});
