import { Provider } from "react-redux"
import configureStore from "redux-mock-store"
import { render } from "@testing-library/react";

import Landing from "@popup/landing";

describe("Landing", () => {
  const mockStore = configureStore();

  it("renders title, description and button", () => {
    const store = mockStore({});

    const { getByText, getByRole } = render(<Provider store={store}><Landing /></Provider>);

    const title = getByText("Welcome!");
    const description = getByText("Press the below button to setup a kilt identity.");
    const button = getByRole("button");

    expect(title).toBeInTheDocument();
    expect(description).toBeInTheDocument();
    expect(button).toBeInTheDocument();
  });
});
