package com.example.fintrack.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.ResultSet;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/health")
@RequiredArgsConstructor
@Slf4j
public class HealthCheckController {

    private final DataSource dataSource;

    @GetMapping("/database")
    public ResponseEntity<Map<String, Object>> checkDatabaseHealth() {
        Map<String, Object> health = new HashMap<>();
        
        try (Connection connection = dataSource.getConnection()) {
            DatabaseMetaData metaData = connection.getMetaData();
            
            health.put("status", "UP");
            health.put("database", metaData.getDatabaseProductName());
            health.put("version", metaData.getDatabaseProductVersion());
            health.put("url", metaData.getURL());
            health.put("driver", metaData.getDriverName());
            
            ResultSet rs = metaData.getTables(null, null, "%", new String[]{"TABLE"});
            int tableCount = 0;
            while (rs.next()) {
                tableCount++;
            }
            rs.close();
            
            health.put("tableCount", tableCount);
            health.put("schemaInitialized", tableCount > 0);
            
            if (tableCount == 0) {
                health.put("warning", "No tables found - Hibernate DDL auto-creation may have failed");
            }
            
            return ResponseEntity.ok(health);
            
        } catch (Exception e) {
            log.error("Database health check failed", e);
            health.put("status", "DOWN");
            health.put("error", e.getMessage());
            return ResponseEntity.status(500).body(health);
        }
    }
}
