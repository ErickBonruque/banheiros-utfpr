-- ============================================================
-- V1 - Criacao das tabelas do BanheiroUTFPR
-- Hierarquia: campus -> localizacao -> banheiro
-- Avaliacoes, comentarios e insights ligados ao banheiro
-- ============================================================

CREATE TABLE usuario (
    id            BIGINT       NOT NULL AUTO_INCREMENT,
    nome          VARCHAR(255) NOT NULL,
    email         VARCHAR(255) NOT NULL,
    senha         VARCHAR(255) NOT NULL,
    role          VARCHAR(20)  NOT NULL DEFAULT 'USER',
    avatar        VARCHAR(255),
    ativo         BIT(1)       NOT NULL DEFAULT b'1',
    data_criacao  DATE,
    PRIMARY KEY (id),
    UNIQUE KEY uk_usuario_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE campus (
    id      BIGINT       NOT NULL AUTO_INCREMENT,
    nome    VARCHAR(100) NOT NULL,
    cidade  VARCHAR(255) NOT NULL,
    estado  VARCHAR(2)   NOT NULL,
    ativo   BIT(1)       NOT NULL DEFAULT b'1',
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE localizacao (
    id         BIGINT       NOT NULL AUTO_INCREMENT,
    campus_id  BIGINT       NOT NULL,
    tipo       VARCHAR(20)  NOT NULL,
    nome       VARCHAR(255) NOT NULL,
    descricao  VARCHAR(255),
    ativo      BIT(1)       NOT NULL DEFAULT b'1',
    PRIMARY KEY (id),
    CONSTRAINT fk_localizacao_campus FOREIGN KEY (campus_id) REFERENCES campus (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE banheiro (
    id                BIGINT       NOT NULL AUTO_INCREMENT,
    localizacao_id    BIGINT       NOT NULL,
    identificador     VARCHAR(255) NOT NULL,
    andar             INT,
    tipo              VARCHAR(10)  NOT NULL,
    descricao         VARCHAR(255),
    foto              VARCHAR(255),
    qtd_cabines       INT,
    acessivel         BIT(1)       NOT NULL DEFAULT b'0',
    nota_media        DOUBLE       NOT NULL DEFAULT 0,
    total_avaliacoes  INT          NOT NULL DEFAULT 0,
    ativo             BIT(1)       NOT NULL DEFAULT b'1',
    PRIMARY KEY (id),
    CONSTRAINT fk_banheiro_localizacao FOREIGN KEY (localizacao_id) REFERENCES localizacao (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE avaliacao (
    id                 BIGINT NOT NULL AUTO_INCREMENT,
    usuario_id         BIGINT NOT NULL,
    banheiro_id        BIGINT NOT NULL,
    limpeza            INT    NOT NULL,
    cheiro             INT    NOT NULL,
    papel_higienico    INT    NOT NULL,
    estado_portas      INT    NOT NULL,
    iluminacao         INT    NOT NULL,
    silencio           INT    NOT NULL,
    movimentacao       INT    NOT NULL,
    nota_geral         DOUBLE,
    comentario         VARCHAR(255),
    foto               VARCHAR(255),
    data_avaliacao     DATE   NOT NULL,
    horario_avaliacao  TIME,
    PRIMARY KEY (id),
    -- Regra de negocio: um usuario so pode avaliar o mesmo banheiro uma vez por dia
    UNIQUE KEY uk_avaliacao_usuario_banheiro_data (usuario_id, banheiro_id, data_avaliacao),
    CONSTRAINT fk_avaliacao_usuario  FOREIGN KEY (usuario_id)  REFERENCES usuario (id),
    CONSTRAINT fk_avaliacao_banheiro FOREIGN KEY (banheiro_id) REFERENCES banheiro (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE comentario (
    id            BIGINT       NOT NULL AUTO_INCREMENT,
    usuario_id    BIGINT       NOT NULL,
    banheiro_id   BIGINT       NOT NULL,
    texto         VARCHAR(500) NOT NULL,
    data_criacao  DATETIME(6)  NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_comentario_usuario  FOREIGN KEY (usuario_id)  REFERENCES usuario (id),
    CONSTRAINT fk_comentario_banheiro FOREIGN KEY (banheiro_id) REFERENCES banheiro (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE insight (
    id           BIGINT        NOT NULL AUTO_INCREMENT,
    banheiro_id  BIGINT        NOT NULL,
    tipo         VARCHAR(30)   NOT NULL,
    titulo       VARCHAR(255)  NOT NULL,
    descricao    VARCHAR(1000),
    dados        TEXT,
    gerado_em    DATETIME(6),
    PRIMARY KEY (id),
    CONSTRAINT fk_insight_banheiro FOREIGN KEY (banheiro_id) REFERENCES banheiro (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
