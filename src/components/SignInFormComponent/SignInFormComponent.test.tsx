import { render, screen } from "@testing-library/react";

import SignInFormComponent from "./SignInFormComponent";

jest.mock("next/navigation", () => ({
	useRouter: () => ({ push: jest.fn() }),
}));

jest.mock("@tanstack/react-query", () => ({
	useMutation: () => ({ mutate: jest.fn(), isPending: false }),
}));

describe("SignInFormComponent", () => {
	it("links to the forgot password page", () => {
		render(<SignInFormComponent />);

		expect(
			screen.getByRole("link", { name: /forgot password/i }),
		).toHaveAttribute("href", "/forgot-password");
	});
});
