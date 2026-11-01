"""Search fictional documents using shared keywords. No LLM or network calls."""

import argparse
import re


DOCUMENTS = [
    {
        "id": "password-reset",
        "title": "Reset your password",
        "text": (
            "Use Reset password on the sign-in screen. A reset link expires "
            "after 20 minutes. Contact IT if you cannot access your email."
        ),
    },
    {
        "id": "workspace-access",
        "title": "Request workspace access",
        "text": (
            "A workspace owner reviews access requests. Include the workspace "
            "name and the role you need."
        ),
    },
    {
        "id": "expense-guide",
        "title": "Submit an expense",
        "text": (
            "Attach a receipt and a description of the business purpose. "
            "The reviewer checks the category before approving reimbursement."
        ),
    },
]
STOP_WORDS = {
    "a", "an", "and", "are", "can", "do", "for", "how", "i", "in", "is",
    "it", "me", "my", "of", "on", "the", "to", "what", "where", "with", "your",
}


def tokens(text):
    # A deliberately simple English tokenizer, not a language-model tokenizer.
    return set(re.findall(r"[a-z0-9]+", text.lower())) - STOP_WORDS


def search(query):
    query_terms = tokens(query)
    matches = []
    for document in DOCUMENTS:
        evidence_terms = tokens(document["title"] + " " + document["text"])
        shared_terms = query_terms & evidence_terms
        if shared_terms:
            matches.append((len(shared_terms), document, sorted(shared_terms)))
    return sorted(matches, key=lambda match: (-match[0], match[1]["id"]))


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("query", nargs="?", default="How do I reset my password?")
    args = parser.parse_args()
    print("Fictional learning documents — keyword search, not a generated answer.")
    matches = search(args.query)
    if not matches:
        print("No matching evidence. Try different words or ask a person.")
        return
    for score, document, shared in matches[:3]:
        print(f"\n[{document['id']}] {document['title']}")
        print(f"Shared keywords ({score}): {', '.join(shared)}")
        print("Evidence:", document["text"])
    print("\nKeyword overlap is not confidence that the passage answers the question.")


if __name__ == "__main__":
    main()
