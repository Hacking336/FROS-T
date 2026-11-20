package trading.frost.contact;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.javalin.http.Context;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.regex.Pattern;

/**
 * Validates a "Message us" submission and forwards it to Resend.
 *
 * <p>Environment: {@code RESEND_API_KEY} (required to send), {@code CONTACT_TO_EMAIL},
 * {@code CONTACT_FROM_EMAIL}, {@code ALLOWED_ORIGINS} (comma separated site origins
 * allowed to post from a browser, e.g. https://www.example.com).
 */
public final class ContactApi {

    static final int NAME_LIMIT = 80;
    static final int EMAIL_LIMIT = 160;
    static final int ADDRESS_LIMIT = 200;
    static final int MESSAGE_LIMIT = 4000;

    static final String DEFAULT_TO = "leandroparagas1987.2015@gmail.com";
    static final String DEFAULT_FROM = "FROS'T Website <onboarding@resend.dev>";

    private static final Pattern EMAIL = Pattern.compile("^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$");
    private static final String RESEND_ENDPOINT = "https://api.resend.com/emails";

    private final String apiKey;
    private final String to;
    private final String from;
    private final Set<String> allowedOrigins;
    private final RateLimiter rateLimiter;
    private final HttpClient http;
    private final ObjectMapper json = new ObjectMapper();

    ContactApi(String apiKey, String to, String from, Set<String> allowedOrigins, RateLimiter rateLimiter,
               HttpClient http) {
        this.apiKey = apiKey;
        this.to = to;
        this.from = from;
        this.allowedOrigins = allowedOrigins;
        this.rateLimiter = rateLimiter;
        this.http = http;
    }

    public static ContactApi fromEnvironment() {
        Map<String, String> env = System.getenv();
        return new ContactApi(
                text(env.get("RESEND_API_KEY")),
                valueOr(env.get("CONTACT_TO_EMAIL"), DEFAULT_TO),
                valueOr(env.get("CONTACT_FROM_EMAIL"), DEFAULT_FROM),
                origins(env.get("ALLOWED_ORIGINS")),
                new RateLimiter(5, Duration.ofMinutes(10)),
                HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(10)).build());
    }

    // ---------------------------------------------------------------- routes

    void methodNotAllowed(Context ctx) {
        reject(ctx, 405, "Use POST.");
    }

    void preflight(Context ctx) {
        String origin = ctx.header("origin");
        if (origin == null || !originAllowed(origin, ctx)) {
            reject(ctx, 403, "Cross-site requests are not allowed.");
            return;
        }
        allowOrigin(ctx, origin);
        ctx.header("access-control-allow-methods", "POST, OPTIONS");
        ctx.header("access-control-allow-headers", "content-type");
        ctx.header("access-control-max-age", "600");
        ctx.header("cache-control", "no-store");
        ctx.status(204);
    }

    void handle(Context ctx) {
        ctx.header("cache-control", "no-store");

        String origin = ctx.header("origin");
        if (origin != null) {
            if (!originAllowed(origin, ctx)) {
                reject(ctx, 403, "Cross-site requests are not allowed.");
                return;
            }
            allowOrigin(ctx, origin);
        }

        JsonNode payload;
        try {
            payload = json.readTree(ctx.body());
        } catch (Exception notJson) {
            reject(ctx, 400, "Send a JSON body.");
            return;
        }
        if (payload == null || !payload.isObject()) {
            reject(ctx, 400, "Send a JSON body.");
            return;
        }

        // Bots fill every input they can see; people never see this one.
        if (!clean(payload.path("company"), ADDRESS_LIMIT).isEmpty()) {
            ctx.status(200).json(Map.of("ok", true));
            return;
        }

        String name = clean(payload.path("name"), NAME_LIMIT);
        String email = clean(payload.path("email"), EMAIL_LIMIT);
        String address = clean(payload.path("address"), ADDRESS_LIMIT);
        String message = clean(payload.path("message"), MESSAGE_LIMIT);

        Map<String, String> problems = new LinkedHashMap<>();
        if (name.length() < 2) problems.put("name", "Please give us your name.");
        if (!EMAIL.matcher(email).matches()) problems.put("email", "Please give us a valid email address.");
        if (message.length() < 10) problems.put("message", "Tell us a little more about what you need.");
        if (!problems.isEmpty()) {
            Map<String, Object> body = new LinkedHashMap<>();
            body.put("ok", false);
            body.put("error", "Please check the highlighted fields.");
            body.put("problems", problems);
            ctx.status(422).json(body);
            return;
        }

        if (!rateLimiter.allow(caller(ctx))) {
            reject(ctx, 429, "Too many messages. Please call or text us instead.");
            return;
        }

        if (apiKey == null || apiKey.isBlank()) {
            reject(ctx, 503, "Message sending is not configured yet. Please call or email us directly.");
            return;
        }

        String failure = send(name, email, address, message);
        if (failure != null) {
            reject(ctx, 502, failure);
            return;
        }
        ctx.status(200).json(Map.of("ok", true));
    }

    // ----------------------------------------------------------------- Resend

    /** Returns null on success, or the visitor-facing error message on failure. */
    private String send(String name, String email, String address, String message) {
        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("from", from);
        payload.put("to", List.of(to));
        payload.put("reply_to", email);
        payload.put("subject", "Website enquiry from " + name);
        payload.put("text", String.join("\n",
                "Name: " + name,
                "Email: " + email,
                "Address: " + (address.isEmpty() ? "(not given)" : address),
                "",
                message));
        payload.put("html", "<h2>Website enquiry</h2>\n<p><strong>Name:</strong> " + escape(name)
                + "<br />\n<strong>Email:</strong> " + escape(email)
                + "<br />\n<strong>Address:</strong> " + (address.isEmpty() ? "(not given)" : escape(address))
                + "</p>\n<p style=\"white-space:pre-wrap\">" + escape(message) + "</p>");

        HttpRequest request;
        try {
            request = HttpRequest.newBuilder(URI.create(RESEND_ENDPOINT))
                    .timeout(Duration.ofSeconds(15))
                    .header("authorization", "Bearer " + apiKey)
                    .header("content-type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(json.writeValueAsString(payload)))
                    .build();
        } catch (Exception serialization) {
            System.err.println("Could not build the mail request: " + serialization.getMessage());
            return "We could not send that message. Please try again or call us directly.";
        }

        try {
            HttpResponse<String> response = http.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() / 100 == 2) return null;
            // Log the provider's reason for the server, never for the visitor.
            String detail = response.body() == null ? "" : response.body();
            System.err.println("Resend rejected the message " + response.statusCode() + " "
                    + detail.substring(0, Math.min(500, detail.length())));
            return "We could not send that message. Please try again or call us directly.";
        } catch (InterruptedException interrupted) {
            Thread.currentThread().interrupt();
            return "We could not reach the mail service. Please try again.";
        } catch (Exception unreachable) {
            System.err.println("Could not reach Resend: " + unreachable.getMessage());
            return "We could not reach the mail service. Please try again.";
        }
    }

    // ---------------------------------------------------------------- helpers

    private void reject(Context ctx, int status, String error) {
        ctx.header("cache-control", "no-store");
        ctx.status(status).json(Map.of("ok", false, "error", error));
    }

    private void allowOrigin(Context ctx, String origin) {
        ctx.header("access-control-allow-origin", origin);
        ctx.header("vary", "Origin");
    }

    /**
     * Same-origin posts (or ones without an Origin header) always pass; anything else
     * has to be listed in ALLOWED_ORIGINS.
     */
    private boolean originAllowed(String origin, Context ctx) {
        String trimmed = origin.endsWith("/") ? origin.substring(0, origin.length() - 1) : origin;
        if (allowedOrigins.contains(trimmed)) return true;
        String host = ctx.header("host");
        if (host == null) return false;
        return trimmed.equalsIgnoreCase("http://" + host) || trimmed.equalsIgnoreCase("https://" + host);
    }

    private static String caller(Context ctx) {
        String forwarded = ctx.header("x-forwarded-for");
        if (forwarded != null && !forwarded.isBlank()) {
            String first = forwarded.split(",")[0].trim();
            if (!first.isEmpty()) return first;
        }
        String real = ctx.header("x-real-ip");
        if (real != null && !real.isBlank()) return real.trim();
        return ctx.ip();
    }

    private static String clean(JsonNode field, int max) {
        if (field == null || !field.isTextual()) return "";
        String value = field.asText().trim();
        return value.length() > max ? value.substring(0, max) : value;
    }

    private static String escape(String value) {
        return value.replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;");
    }

    private static String text(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }

    private static String valueOr(String value, String fallback) {
        return value == null || value.isBlank() ? fallback : value.trim();
    }

    private static Set<String> origins(String value) {
        Set<String> origins = new LinkedHashSet<>();
        if (value == null) return origins;
        List<String> parts = new ArrayList<>(List.of(value.split(",")));
        for (String part : parts) {
            String trimmed = part.trim();
            if (trimmed.endsWith("/")) trimmed = trimmed.substring(0, trimmed.length() - 1);
            if (!trimmed.isEmpty()) origins.add(trimmed);
        }
        return origins;
    }
}
