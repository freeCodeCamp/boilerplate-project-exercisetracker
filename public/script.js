const exerciseForm = document.getElementById("exercise-form");

exerciseForm.addEventListener("submit", () => {
  const userId = document.getElementById("uid").value;
  exerciseForm.action = `/api/users/${userId}/exercises`;

  exerciseForm.submit();
});
