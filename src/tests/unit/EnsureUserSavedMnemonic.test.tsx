import { EnsureUserSavedMnemonic } from "@popup/components/Protocol/EnsureUserSavedMnemonic";
import ReactTestUtils from "react-dom/test-utils";
import { render, unmountComponentAtNode } from "react-dom";

let container: any;

beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

describe("mnemonicScreen", () => {
  function getProtocolOptIn() {
    return {
      getMnemonic: async () =>
        "benefit cement cement exhaust figure list meadow minimum narrow rain sausage scale worth",
    };
  }

  it("duplicate word test", async () => {
    const mockCallBack = jest.fn();
    await ReactTestUtils.act(async () => {
      render(
        <EnsureUserSavedMnemonic
          onComplete={mockCallBack}
          getOptIn={getProtocolOptIn}
        />,
        container,
      );
    });

    let result = container.getElementsByClassName("MnemonicWordButton");

    Array.from(result).forEach(function (item: any) {
      ReactTestUtils.Simulate.click(item);
    });
    let continueButton = Array.from(document.querySelectorAll("button")).find(
      (el) => el.textContent === "Continue",
    );

    expect(continueButton?.disabled).toBe(false);
  });
});
