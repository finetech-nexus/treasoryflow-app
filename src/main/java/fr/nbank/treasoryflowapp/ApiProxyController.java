package fr.nbank.treasoryflowapp;

import jakarta.servlet.http.HttpServletRequest;
import java.util.Enumeration;
import java.util.Set;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestClient;

@RestController
public class ApiProxyController {
    private static final Logger log = LoggerFactory.getLogger(ApiProxyController.class);
    private static final String IN_CLUSTER = "http://treasoryflow-api:8108";
    private static final Set<String> HOP_BY_HOP = Set.of(
            "host", "connection", "content-length", "transfer-encoding", "expect", "upgrade");

    private final RestClient http;
    private final String upstream;

    public ApiProxyController(RestClient.Builder builder, @Value("${treasoryflow.upstream-url}") String upstream) {
        this.http = builder.build();
        this.upstream = inCluster(upstream);
        log.info("TreasoryFlow API proxy target is {}", this.upstream);
    }

    static String inCluster(String upstream) {
        String value = upstream == null ? "" : upstream.trim().replaceAll("/+$", "");
        if (value.isBlank() || value.startsWith("https://")) {
            return IN_CLUSTER;
        }
        return value;
    }

    @RequestMapping("/api/**")
    public ResponseEntity<byte[]> proxy(HttpServletRequest request, @RequestBody(required = false) byte[] body) {
        String query = request.getQueryString();
        String target = upstream + request.getRequestURI() + (query == null || query.isBlank() ? "" : "?" + query);
        HttpMethod method = HttpMethod.valueOf(request.getMethod());
        RestClient.RequestBodySpec call = http.method(method).uri(target);
        Enumeration<String> names = request.getHeaderNames();
        while (names != null && names.hasMoreElements()) {
            String name = names.nextElement();
            if (name == null || HOP_BY_HOP.contains(name.toLowerCase())) {
                continue;
            }
            call.header(name, request.getHeader(name));
        }
        if (body != null && body.length > 0 && method != HttpMethod.GET && method != HttpMethod.HEAD) {
            call.body(body);
        }
        return call.exchange((ignored, response) -> {
            HttpHeaders headers = new HttpHeaders();
            if (response.getHeaders().getContentType() != null) {
                headers.setContentType(response.getHeaders().getContentType());
            }
            byte[] payload = response.getBody() == null ? new byte[0] : response.getBody().readAllBytes();
            return ResponseEntity.status(response.getStatusCode()).headers(headers).body(payload);
        });
    }
}
