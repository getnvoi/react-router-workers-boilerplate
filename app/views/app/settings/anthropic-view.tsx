import { Form, Link } from "react-router";
import { Button, Input, Field } from "~/components";
import { Check, ExternalLink, Info } from "lucide-react";
import type { SessionUser } from "~/sessions.server";

interface AnthropicViewProps {
  authUrl: string;
  isConnected: boolean;
  user: SessionUser;
}

export function AnthropicView({
  authUrl,
  isConnected,
  user,
}: AnthropicViewProps) {
  return (
    <div >
      <div >
        <div >
          <h1 >Claude Settings</h1>
          <p >
            Connect your Claude account to enable AI-powered features
          </p>
        </div>

        <div >
          {isConnected ? (
            <div >
              <div >
                <div >
                  <Check  />
                </div>
                <div>
                  <h3 >Claude Connected</h3>
                  <p >
                    Your Claude account is connected and ready to use
                  </p>
                </div>
              </div>

              <div >
                <h4 >Account Info</h4>
                <dl >
                  <div >
                    <dt >User:</dt>
                    <dd >
                      {user.name || user.login}
                    </dd>
                  </div>
                </dl>
              </div>

              <div >
                <Button variant="secondary" size="md">
                  Disconnect Claude
                </Button>
              </div>
            </div>
          ) : (
            <div >
              <div >
                <h3 >
                  Step 1: Authorize with Claude
                </h3>
                <p >
                  Click the button below to open the Claude authorization page:
                </p>
                <a
                  href={authUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  
                >
                  <Button size="md">
                    Open Claude Authorization
                    <ExternalLink  />
                  </Button>
                </a>
              </div>

              <div >
                <h3 >
                  Step 2: Enter Authorization Code
                </h3>
                <p >
                  After authorizing, copy the code shown by Claude and paste it
                  below:
                </p>

                <Form method="post" >
                  <input
                    type="hidden"
                    name="state"
                    value={new URL(authUrl).searchParams.get("state") || ""}
                  />

                  <Field.Root name="code">
                    <Field.Label>Authorization Code</Field.Label>
                    <Field.Control
                      type="text"
                      required
                      placeholder="Paste code here (e.g., abc123#xyz789)"
                    />
                  </Field.Root>

                  <Button type="submit" size="md">
                    Connect Claude Account
                  </Button>
                </Form>
              </div>
            </div>
          )}
        </div>

        <div >
          <div >
            <div >
              <Info />
            </div>
            <div>
              <h3 >About Claude OAuth</h3>
              <p >
                This connection uses OAuth with PKCE (Proof Key for Code
                Exchange) for secure authentication. The authorization code must
                be manually entered because Anthropic redirects to their console,
                not directly back to this application.
              </p>
            </div>
          </div>
        </div>

        <div >
          <Button variant="ghost" size="sm" asChild>
            <Link to="/app">← Back to app</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
