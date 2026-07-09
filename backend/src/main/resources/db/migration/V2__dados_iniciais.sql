-- ============================================================
-- V2 - Dados iniciais (usuarios, campus, localizacoes,
--      banheiros e avaliacoes de demonstracao)
-- Senhas (BCrypt): admin@utfpr.edu.br = admin123
--                  joao@alunos.utfpr.edu.br = user123
--                  maria@alunos.utfpr.edu.br = user123
-- ============================================================

INSERT INTO usuario (id, nome, email, senha, role, ativo, data_criacao) VALUES
    (1, 'Administrador', 'admin@utfpr.edu.br', '$2a$10$F1ysnPFNRpj9DqIIunz8k.FVuJAMPk8VIVrx8a9fjpf9uun6QYZiC', 'ADMIN', b'1', CURDATE()),
    (2, 'Joao Aluno',    'joao@alunos.utfpr.edu.br',  '$2a$10$IJwflzFx3gQZxd5AdDJiQuhr63Hd9ZEwr9Sj7Mjs5wJnlh6J.k6CO', 'USER', b'1', CURDATE()),
    (3, 'Maria Aluna',   'maria@alunos.utfpr.edu.br', '$2a$10$IJwflzFx3gQZxd5AdDJiQuhr63Hd9ZEwr9Sj7Mjs5wJnlh6J.k6CO', 'USER', b'1', CURDATE());

INSERT INTO campus (id, nome, cidade, estado, ativo) VALUES
    (1, 'UTFPR Santa Helena', 'Santa Helena', 'PR', b'1'),
    (2, 'UTFPR Toledo',       'Toledo',       'PR', b'1');

INSERT INTO localizacao (id, campus_id, tipo, nome, descricao, ativo) VALUES
    (1, 1, 'BLOCO',        'Bloco A',            'Bloco principal de salas de aula',      b'1'),
    (2, 1, 'BLOCO',        'Bloco B',            'Bloco dos laboratorios de informatica', b'1'),
    (3, 1, 'BIBLIOTECA',   'Biblioteca',         'Predio da biblioteca do campus',        b'1'),
    (4, 1, 'AREA_EXTERNA', 'Quadra de esportes', 'Area externa ao lado da quadra',        b'1'),
    (5, 2, 'PREDIO',       'Predio Central',     'Predio administrativo',                 b'1');

INSERT INTO banheiro (id, localizacao_id, identificador, andar, tipo, descricao, qtd_cabines, acessivel, ativo) VALUES
    (1, 1, 'Bloco A - Terreo - Masculino',  0,    'M',       'Ao lado da cantina',                 3, b'0', b'1'),
    (2, 1, 'Bloco A - Terreo - Feminino',   0,    'F',       'Ao lado da cantina',                 4, b'0', b'1'),
    (3, 2, 'Bloco B - 1o andar - Unissex',  1,    'UNISSEX', 'Em frente ao laboratorio 3',         2, b'0', b'1'),
    (4, 3, 'Biblioteca - PCD',              0,    'PCD',     'Entrada principal da biblioteca',    1, b'1', b'1'),
    (5, 4, 'Container da quadra',           NULL, 'UNISSEX', 'Container provisorio, sem andar',    1, b'0', b'1'),
    (6, 2, 'Bloco B - Terreo - Masculino',  0,    'M',       'Interditado para reforma',           2, b'0', b'0');

-- Avaliacoes de demonstracao (datas relativas para o app estar sempre "vivo")
-- Banheiro 4 (Biblioteca): otimo -> Trono de Ouro | Banheiro 5 (Container): pessimo -> Zona de Risco
INSERT INTO avaliacao (usuario_id, banheiro_id, limpeza, cheiro, papel_higienico, estado_portas, iluminacao, silencio, movimentacao, comentario, data_avaliacao, horario_avaliacao) VALUES
    -- Banheiro 1: mediano, avaliacoes em horarios variados (para analise temporal)
    (2, 1, 3, 3, 2, 4, 4, 2, 2, 'Muito movimento no intervalo',           CURDATE() - INTERVAL 14 DAY, '09:50:00'),
    (3, 1, 3, 2, 3, 4, 4, 2, 1, 'Fila na troca de aula',                  CURDATE() - INTERVAL 12 DAY, '10:05:00'),
    (2, 1, 4, 3, 3, 4, 4, 4, 4, 'De tarde fica bem tranquilo',            CURDATE() - INTERVAL 9 DAY,  '15:30:00'),
    (3, 1, 4, 4, 3, 4, 5, 5, 5, 'Vazio a noite, otimo',                   CURDATE() - INTERVAL 6 DAY,  '20:10:00'),
    (2, 1, 3, 3, 4, 4, 4, 4, 4, NULL,                                     CURDATE() - INTERVAL 2 DAY,  '16:45:00'),
    -- Banheiro 2: bom e estavel
    (3, 2, 4, 4, 4, 4, 4, 4, 3, 'Sempre limpo',                           CURDATE() - INTERVAL 10 DAY, '11:20:00'),
    (2, 2, 4, 4, 5, 4, 4, 3, 3, NULL,                                     CURDATE() - INTERVAL 5 DAY,  '13:40:00'),
    (3, 2, 4, 5, 4, 4, 5, 4, 4, 'Melhorou depois da manutencao',          CURDATE() - INTERVAL 1 DAY,  '10:15:00'),
    -- Banheiro 3: em tendencia de melhora (notas antigas baixas, recentes altas)
    (2, 3, 2, 2, 1, 2, 3, 3, 3, 'Sem papel de novo...',                   CURDATE() - INTERVAL 20 DAY, '08:30:00'),
    (3, 3, 2, 3, 2, 2, 3, 3, 3, NULL,                                     CURDATE() - INTERVAL 15 DAY, '14:00:00'),
    (2, 3, 4, 4, 4, 3, 4, 4, 4, 'Arrumaram as portas',                    CURDATE() - INTERVAL 4 DAY,  '09:10:00'),
    (3, 3, 4, 4, 5, 4, 4, 4, 4, 'Bem melhor agora',                       CURDATE() - INTERVAL 1 DAY,  '16:20:00'),
    -- Banheiro 4 (Biblioteca PCD): excelente -> Trono de Ouro
    (2, 4, 5, 5, 5, 5, 5, 5, 5, 'O melhor banheiro do campus, disparado', CURDATE() - INTERVAL 8 DAY,  '10:40:00'),
    (3, 4, 5, 5, 4, 5, 5, 5, 5, 'Silencioso e impecavel',                 CURDATE() - INTERVAL 3 DAY,  '15:00:00'),
    (2, 4, 5, 4, 5, 5, 5, 5, 5, NULL,                                     CURDATE() - INTERVAL 1 DAY,  '11:30:00'),
    -- Banheiro 5 (Container): pessimo -> Zona de Risco
    (2, 5, 1, 1, 1, 2, 2, 3, 2, 'Evitem, so em emergencia',               CURDATE() - INTERVAL 7 DAY,  '17:00:00'),
    (3, 5, 1, 1, 2, 1, 1, 2, 2, 'Porta nao fecha e nao tem papel',        CURDATE() - INTERVAL 2 DAY,  '18:30:00');

-- Nota geral de cada avaliacao = media dos 7 criterios
UPDATE avaliacao
   SET nota_geral = (limpeza + cheiro + papel_higienico + estado_portas + iluminacao + silencio + movimentacao) / 7.0;

-- Estatisticas agregadas dos banheiros
UPDATE banheiro b
   SET nota_media = COALESCE((SELECT AVG(a.nota_geral) FROM avaliacao a WHERE a.banheiro_id = b.id), 0),
       total_avaliacoes = (SELECT COUNT(*) FROM avaliacao a WHERE a.banheiro_id = b.id);

INSERT INTO comentario (usuario_id, banheiro_id, texto, data_criacao) VALUES
    (2, 4, 'Dica: o da biblioteca sempre tem papel e sabonete.', NOW() - INTERVAL 3 DAY),
    (3, 5, 'Alguem avisa a prefeitura do campus sobre o container?', NOW() - INTERVAL 2 DAY),
    (2, 1, 'Evitem o intervalo das 9h50, fila enorme.', NOW() - INTERVAL 1 DAY);
