export default {
  async fetch(request, env) {
    const { messages } = await request.json();

    const response = await env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
      messages,
    });

    return new Response(JSON.stringify(response), {
      headers: { "Content-Type": "application/json" },
    });
  },
};

