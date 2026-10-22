const API_BASE_URL = "http://127.0.0.1:3000/greet";

const form = document.querySelector("#greeting-form");
const nameInput = document.querySelector("#name");
const submitButton = document.querySelector("#submit-button");
const feedback = document.querySelector("#feedback");
const greetingOutput = document.querySelector("#greeting");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const name = nameInput.value.trim();
  const endpoint = new URL(API_BASE_URL);
  endpoint.searchParams.set("name", name);

  submitButton.disabled = true;
  feedback.dataset.state = "loading";
  feedback.textContent = "Getting your greeting…";
  greetingOutput.textContent = "";

  try {
    const response = await fetch(endpoint, { method: "GET" });
    if (!response.ok) {
      throw new Error(`The greeting service returned HTTP ${response.status}.`);
    }

    const result = await response.json();
    if (result === null || typeof result !== "object" || typeof result.greeting !== "string") {
      throw new Error("The greeting service returned an invalid response.");
    }

    greetingOutput.textContent = result.greeting;
    feedback.dataset.state = "success";
    feedback.textContent = "Greeting received.";
  } catch (error) {
    feedback.dataset.state = "error";
    feedback.textContent = error instanceof TypeError
      ? "Could not reach the greeting service. Make sure the API is running at http://127.0.0.1:3000."
      : (error instanceof Error ? error.message : "Something went wrong while getting the greeting.");
  } finally {
    submitButton.disabled = false;
  }
});
