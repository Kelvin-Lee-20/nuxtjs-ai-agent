<template>
  <UCard>
    <template #header><div class="h-6">Chat with Data</div></template>

    <div ref="chatContainer" class="h-112 overflow-y-auto">
      <UChatMessages
        :user="{
          side: 'right',
          variant: 'solid',
        }"
        :assistant="{
          side: 'left',
          variant: 'solid',
          avatar: {
            icon: 'i-lucide-bot',
          },
        }"
        :messages="messages"
      />
    </div>

    <template #footer>
      <div class="h-8">
        <form @submit.prevent="sendMessage">
          <div class="flex items-center justify-between text-primary">
            <UInput
              v-model="message"
              placeholder="Ask me the data"
              class="w-full"
            >
            </UInput>
            <UButton
              :disabled="isWaitingAgent"
              color="primary"
              variant="solid"
              :trailing="false"
              label="Send"
              class="ml-4"
              type="submit"
            />
          </div>
        </form>
      </div>
    </template>
  </UCard>
</template>

<script setup lang="ts">
const isWaitingAgent = ref(false);
const chatContainer = ref(null);
const message = ref("");
const messages = ref([
  {
    id: "7a92b3c1-d5f8-4e76-b8a9-3c1e5fb2e0d8",
    role: "assistant",
    parts: [
      {
        type: "text",
        text: "Hi, I am AI agent, I can help you query the data. You can ask any question.",
      },
    ],
  },
]);

const sendMessage = async () => {
  if (!message.value.trim()) return;

  addUserBubble();

  const currentMessage = message.value;
  message.value = "";

  addLoadingBubble();

  try {
    isWaitingAgent.value = true;
    const res = await $fetch("/api/chat", {
      method: "POST",
      body: {
        "chat-message": currentMessage,
      },
    });
    console.log(res);

    isWaitingAgent.value = false;
    addAIAgentBubble(res);
  } catch (error) {}
};

const addUserBubble = async () => {
  messages.value.push({
    id: "6045235a-a435-46b8-989d-2df38ca2eb48",
    parts: [{ type: "text", text: message.value }],
    role: "user",
  });

  await nextTick();
  scrollToBottom(true);
};

const addLoadingBubble = async () => {
  messages.value.push({
    id: "6045235a-a435-46b8-989d-2df38ca2eb49",
    parts: [
      {
        type: "text",
        text: "Thinking...",
      },
    ],
    role: "assistant",
  });
  await nextTick();
  scrollToBottom(true);
};

const addAIAgentBubble = async (messageFromServer: string) => {
  messages.value.pop();

  messages.value.push({
    id: "6045235a-a435-46b8-989d-2df38ca2eb49",
    parts: [
      {
        type: "text",
        text: messageFromServer,
      },
    ],
    role: "assistant",
  });
  await nextTick();
  scrollToBottom(true);
};

const scrollToBottom = (smooth = false) => {
  if (chatContainer.value) {
    chatContainer.value.scrollTo({
      top: chatContainer.value.scrollHeight,
      behavior: smooth ? "smooth" : "auto",
    });
  }
};
</script>
