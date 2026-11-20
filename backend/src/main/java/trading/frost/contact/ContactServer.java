package trading.frost.contact;

import io.javalin.Javalin;
import io.javalin.http.HandlerType;

import java.util.List;
import java.util.Map;

/**
 * The FROS'T contact endpoint. One small service, no database: validate the
 * message and hand it to Resend so it lands in the business inbox.
 */
public final class ContactServer {

    private ContactServer() {
    }

    public static void main(String[] args) {
        int port = Integer.parseInt(System.getenv().getOrDefault("PORT", "8080"));
        Javalin app = createApp(ContactApi.fromEnvironment());
        app.start("0.0.0.0", port);
        System.out.println("FROS'T contact API listening on 0.0.0.0:" + port);
    }

    static Javalin createApp(ContactApi api) {
        Javalin app = Javalin.create(config -> config.showJavalinBanner = false);

        app.get("/health", ctx -> ctx.json(Map.of("ok", true)));

        // The endpoint only accepts POST: everything else answers 405, not 404.
        for (HandlerType type : List.of(HandlerType.GET, HandlerType.PUT, HandlerType.PATCH, HandlerType.DELETE)) {
            app.addHttpHandler(type, "/api/contact", api::methodNotAllowed);
        }

        app.options("/api/contact", api::preflight);
        app.post("/api/contact", api::handle);

        return app;
    }
}
