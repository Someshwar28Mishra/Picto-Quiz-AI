def evaluate_quiz(quiz, user_answers):
    score = 0

    for i, q in enumerate(quiz):
        if user_answers.get(str(i)) == q["answer"]:
            score += 1

    return {
        "score": score,
        "total": len(quiz)
    }
