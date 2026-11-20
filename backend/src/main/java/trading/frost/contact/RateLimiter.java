package trading.frost.contact;

import java.time.Duration;
import java.util.Iterator;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/** Per-caller message limit, kept in memory because a single instance serves the form. */
final class RateLimiter {

    private static final int PRUNE_ABOVE = 5000;

    private final int max;
    private final long windowMillis;
    private final Map<String, Window> hits = new ConcurrentHashMap<>();

    RateLimiter(int max, Duration window) {
        this.max = max;
        this.windowMillis = window.toMillis();
    }

    /** Returns true when the caller has messages left in the current window. */
    boolean allow(String key) {
        long now = System.currentTimeMillis();
        Window window = hits.compute(key, (ignored, existing) -> {
            if (existing == null || now - existing.start > windowMillis) {
                return new Window(now);
            }
            existing.count++;
            return existing;
        });
        if (hits.size() > PRUNE_ABOVE) prune(now);
        return window.count <= max;
    }

    private void prune(long now) {
        Iterator<Map.Entry<String, Window>> entries = hits.entrySet().iterator();
        while (entries.hasNext()) {
            if (now - entries.next().getValue().start > windowMillis) entries.remove();
        }
    }

    private static final class Window {
        final long start;
        int count = 1;

        Window(long start) {
            this.start = start;
        }
    }
}
