// Seed asset for teach workspaces. Copy to <teaching-workspace>/assets/quiz.js
// on the first multiple-choice lesson; once copied, the workspace owns its copy.
//
// Expected markup:
// <teach-quiz>
//   <div data-quiz-options>
//     <button type="button" data-quiz-option data-correct="true">Correct answer</button>
//     <button type="button" data-quiz-option>Distractor</button>
//   </div>
//   <p data-quiz-feedback hidden aria-live="polite"></p>
// </teach-quiz>
// <script defer src="../assets/quiz.js"></script>

(() => {
  const randomUnit = () => {
    if (globalThis.crypto?.getRandomValues) {
      const value = new Uint32Array(1);
      globalThis.crypto.getRandomValues(value);
      return value[0] / 0x100000000;
    }
    return Math.random();
  };

  const shuffled = (items) => {
    const result = [...items];
    for (let i = result.length - 1; i > 0; i -= 1) {
      const j = Math.floor(randomUnit() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  };

  class TeachQuiz extends HTMLElement {
    connectedCallback() {
      if (this.dataset.quizReady === "true") return;

      const options = [...this.querySelectorAll("[data-quiz-option]")];
      const optionContainer = this.querySelector("[data-quiz-options]");
      const correct = options.filter((option) => option.dataset.correct === "true");

      if (!optionContainer || options.length < 2 || correct.length !== 1) {
        console.error("teach-quiz requires one option container, at least two options, and exactly one correct option");
        return;
      }

      shuffled(options).forEach((option) => optionContainer.appendChild(option));
      options.forEach((option) => {
        option.addEventListener("click", () => this.#answer(option));
      });
      this.dataset.quizReady = "true";
    }

    #answer(selected) {
      if (this.dataset.answered === "true") return;
      this.dataset.answered = "true";

      const options = [...this.querySelectorAll("[data-quiz-option]")];
      const isCorrect = selected.dataset.correct === "true";

      options.forEach((option) => {
        option.disabled = true;
        if (option.dataset.correct === "true") {
          option.dataset.state = "correct";
        } else if (option === selected) {
          option.dataset.state = "incorrect";
        }
      });

      const feedback = this.querySelector("[data-quiz-feedback]");
      if (feedback) {
        feedback.hidden = false;
        feedback.textContent = selected.dataset.feedback || (isCorrect
          ? "Correct."
          : "Not quite. Review the explanation, then retrieve the answer again without relying on option position.");
      }

      this.dispatchEvent(new CustomEvent("teach-quiz-answer", {
        bubbles: true,
        detail: { correct: isCorrect },
      }));
    }
  }

  if (!customElements.get("teach-quiz")) {
    customElements.define("teach-quiz", TeachQuiz);
  }
})();
