package com.example.fintrack.security;

import com.example.fintrack.exception.BusinessErrorCodes;
import com.example.fintrack.exception.ExpiredTokenException;
import com.example.fintrack.security.service.JwtService;
import com.example.fintrack.user.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;

import static com.example.fintrack.security.TokenType.ACCESS;
import static java.util.Objects.isNull;
import static org.springframework.util.MimeTypeUtils.APPLICATION_JSON;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserService userService;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {        if (request.getServletPath().contains("/auth") ||
                request.getServletPath().contains("v2/api-docs") ||
                request.getServletPath().contains("v3/api-docs") ||
                request.getServletPath().contains("/swagger") ||
                request.getServletPath().contains("/currencies") ||
                request.getServletPath().contains("/api/health")
        ) {
            filterChain.doFilter(request, response);
            return;
        }

        Cookie[] cookies = request.getCookies();
        if (isNull(cookies)) {
            filterChain.doFilter(request, response);
            return;
        }

        String accessToken = Arrays.stream(cookies)
                .filter(cookie -> cookie.getName().equals("access_token"))
                .map(Cookie::getValue)
                .findFirst()
                .orElse(null);        if (accessToken == null) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            String userEmail = jwtService.extractEmail(accessToken, ACCESS);
            if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails user = userService.loadUserByUsername(userEmail);

                if (jwtService.isTokenValid(accessToken, user)) {
                    UsernamePasswordAuthenticationToken authToken =
                            new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());

                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
            filterChain.doFilter(request, response);
        } catch (ExpiredJwtException | ExpiredTokenException e) {
            handleError(response);
        }
    }

    private void handleError(HttpServletResponse response) throws IOException {
        response.resetBuffer();
        response.setStatus(BusinessErrorCodes.ACCESS_TOKEN_EXPIRED.getHttpStatus().value());
        response.setHeader(HttpHeaders.CONTENT_TYPE, String.valueOf(APPLICATION_JSON));
        response.getOutputStream().print(new ObjectMapper().writeValueAsString(BusinessErrorCodes.ACCESS_TOKEN_EXPIRED));
        response.flushBuffer();
    }
}
