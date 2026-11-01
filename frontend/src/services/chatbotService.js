// src/services/chatbotService.js

import { apiPost } from "./api";

/**
 * Send a message to BharatYatra AI Travel Assistant.
 *
 * Backend:
 * POST /api/chatbot
 *
 * @param {string} message
 * @param {object|string|null} destination
 * @returns {Promise<object>}
 */
export async function sendChatMessage(
  message,
  destination = null
) {
  const cleanMessage = String(
    message || ""
  ).trim();

  if (!cleanMessage) {
    throw new Error(
      "Please enter a message."
    );
  }

  const response = await apiPost(
    "/api/chatbot",
    {
      message: cleanMessage,
      destination,
    }
  );

  return response;
}

/**
 * Send a travel question with destination context.
 *
 * @param {string} message
 * @param {object} destination
 * @returns {Promise<object>}
 */
export async function askTravelAssistant(
  message,
  destination
) {
  return sendChatMessage(
    message,
    destination
  );
}

/**
 * Extract assistant reply from API response.
 *
 * Supports both:
 *
 * {
 *   message: "..."
 * }
 *
 * and
 *
 * {
 *   reply: "..."
 * }
 */
export function getChatReply(data) {
  if (!data) {
    return "I could not answer that right now.";
  }

  return (
    data.message ||
    data.reply ||
    data.answer ||
    "I could not answer that right now."
  );
}

/**
 * Create a user chat message object.
 */
export function createUserMessage(text) {
  return {
    role: "user",
    text: String(text || "").trim(),
    timestamp: new Date().toISOString(),
  };
}

/**
 * Create an assistant chat message object.
 */
export function createAssistantMessage(
  text
) {
  return {
    role: "assistant",
    text: String(text || "").trim(),
    timestamp: new Date().toISOString(),
  };
}

/**
 * Create the initial BharatYatra AI message.
 */
export function createWelcomeMessage() {
  return createAssistantMessage(
    "Namaste! I am your free BharatYatra travel assistant. How can I help?"
  );
}

/**
 * Build the complete conversation payload.
 *
 * Useful when the backend later supports
 * multi-turn conversation history.
 */
export function createChatPayload({
  message,
  destination = null,
  history = [],
}) {
  const cleanMessage = String(
    message || ""
  ).trim();

  return {
    message: cleanMessage,
    destination,
    history: Array.isArray(history)
      ? history
      : [],
  };
}

/**
 * Send a conversation with history.
 *
 * This is ready for the backend when
 * conversation memory is enabled.
 */
export async function sendConversation({
  message,
  destination = null,
  history = [],
}) {
  const payload = createChatPayload({
    message,
    destination,
    history,
  });

  if (!payload.message) {
    throw new Error(
      "Please enter a message."
    );
  }

  return apiPost(
    "/api/chatbot",
    payload
  );
}

/**
 * Get common suggested questions
 * for the AI travel assistant.
 */
export function getSuggestedQuestions(
  destinationName = ""
) {
  const destination =
    String(destinationName || "").trim();

  if (destination) {
    return [
      `What are the best places to visit in ${destination}?`,
      `What food should I try in ${destination}?`,
      `Plan a 3-day trip to ${destination}.`,
      `What is the best time to visit ${destination}?`,
      `What should I know before visiting ${destination}?`,
    ];
  }

  return [
    "Suggest the best places to visit in India.",
    "Plan a budget trip in India.",
    "Which Indian destinations are best for families?",
    "What are the best places for a weekend trip?",
    "Suggest some offbeat destinations in India.",
  ];
}