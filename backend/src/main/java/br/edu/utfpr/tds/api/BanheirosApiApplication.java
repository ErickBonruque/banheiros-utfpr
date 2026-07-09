package br.edu.utfpr.tds.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class BanheirosApiApplication {

    public static void main(String[] args) {
        SpringApplication.run(BanheirosApiApplication.class, args);
    }
}
