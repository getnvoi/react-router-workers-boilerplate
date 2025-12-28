import { DurableObject } from "cloudflare:workers";

export class JobRunner extends DurableObject<Env> {
  // RPC method - notify specific job key
  async notify(key: string, data: any) {
    const message = JSON.stringify({ key, data, timestamp: Date.now() });
    this.ctx.getWebSockets().forEach((ws) => {
      try {
        ws.send(message);
      } catch (error) {
        console.error("Error sending WebSocket message:", error);
      }
    });
  }

  async fetch(request: Request) {
    if (request.headers.get("Upgrade") !== "websocket") {
      return new Response("Expected websocket", { status: 426 });
    }

    const pair = new WebSocketPair();
    const [client, server] = Object.values(pair);
    this.ctx.acceptWebSocket(server);

    return new Response(null, { status: 101, webSocket: client });
  }

  webSocketClose(ws: WebSocket) {
    ws.close();
  }

  webSocketError(ws: WebSocket, error: unknown) {
    console.error("WebSocket error:", error);
  }
}
