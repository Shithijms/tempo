class UserSession:
    def __init__(self, max_tokens=2000):
        self.conversation = deque()  # recent messages
        self.max_tokens = max_tokens
        self.summary = ""  # long-term memory

    def add_message(self, message: str):
        self.conversation.append(message)
        while self.count_tokens() > self.max_tokens:
            self._summarize_oldest()

    def count_tokens(self):
        return sum(len(m.split()) for m in self.conversation)

    def _summarize_oldest(self):
        old_msgs = [self.conversation.popleft() for _ in range(len(self.conversation)//2)]
        summary_text = " ".join(old_msgs)
        # Use Hugging Face LLM for summarization
        from app.utils.hf_llm import summarize_text
        summary = summarize_text(summary_text)
        self.summary += f" {summary}"
